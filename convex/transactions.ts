/* eslint-disable no-underscore-dangle */
import { v } from 'convex/values';

import { internal } from './_generated/api';
import { internalMutation, mutation } from './_generated/server';

type TransactionStatusType =
  | 'escrow'
  | 'submitted'
  | 'rework'
  | 'paid'
  | 'refunding'
  | 'refunded'
  | 'closed';
type StateTransitions = {
  [key in TransactionStatusType]: TransactionStatusType[];
};

const validTransitions: StateTransitions = {
  escrow: ['submitted'],
  submitted: ['rework', 'paid', 'closed'],
  rework: ['submitted'],
  paid: ['refunding', 'closed'],
  refunding: ['refunded'],
  refunded: ['closed'],
  closed: ['closed'],
};

export const deposit = mutation({
  args: { clientId: v.id('users'), amount: v.number() },

  handler: async (ctx, args) => {
    try {
      if (args.amount <= 0) throw new Error('Amount must be positive.');

      const user = await ctx.db.get(args.clientId);
      if (!user) throw new Error('User not found.');

      const newBalance = JSON.parse(user.balance) + args.amount;

      await ctx.db.patch(args.clientId, {
        balance: JSON.stringify(newBalance),
      });

      await ctx.db.insert('transactions', {
        senderId: args.clientId,
        receiverId: args.clientId,
        amount: args.amount,
        type: 'deposit',
      });

      return await ctx.db.get(args.clientId);
    } catch (error) {
      throw new Error(`Deposit error: ${error}`);
    }
  },
});

export const withdraw = mutation({
  args: { userId: v.id('users'), amount: v.number() },

  handler: async (ctx, args) => {
    try {
      const user = await ctx.db.get(args.userId);
      if (!user) throw new Error('User not found.');

      const userBalance = JSON.parse(user.balance);

      if (args.amount <= 0)
        throw new Error('Withdraw amount must be positive.');
      if (userBalance < args.amount) throw new Error('Insufficient balance.');

      const newBalance = JSON.parse(user.balance) - args.amount;

      await ctx.db.insert('transactions', {
        senderId: args.userId,
        receiverId: args.userId,
        amount: args.amount,
        type: 'withdraw',
      });

      await ctx.db.patch(args.userId, {
        balance: JSON.stringify(newBalance),
      });

      return await ctx.db.get(args.userId);
    } catch (error) {
      throw new Error(`Withdraw error: ${error}`);
    }
  },
});

export const startContract = internalMutation({
  args: { bidId: v.id('bids') },

  handler: async (ctx, args) => {
    try {
      const bid = await ctx.db.get(args.bidId);
      if (!bid) throw new Error('Bid not found.');

      const sender = await ctx.db.get(bid.clientId);
      const receiver = await ctx.db.get(bid.vendorId);
      const senderBalance = JSON.parse(sender!.balance);

      if (sender!.type !== 'client')
        throw new Error('Sender must be a client.');
      if (receiver!.type !== 'vendor')
        throw new Error('Recipient must be a vendor.');
      if (bid.amount <= 0) throw new Error('Bid amount must be positive.');
      if (senderBalance < bid.amount)
        throw new Error('Insufficient balance to start contract.');

      await ctx.db.patch(bid.clientId, {
        balance: JSON.stringify(senderBalance - bid.amount),
      });

      await ctx.db.insert('transactions', {
        senderId: bid.clientId,
        receiverId: bid.vendorId,
        amount: bid.amount,
        bidId: args.bidId,
        type: 'escrow',
      });
    } catch (error) {
      throw new Error(`Start contract error: ${error}`);
    }
  },
});

export const updateContract = internalMutation({
  args: { bidId: v.id('bids'), type: v.string() },

  handler: async (ctx, args) => {
    try {
      const bid = await ctx.db.get(args.bidId);
      if (!bid) throw new Error('Bid not found.');

      const transaction = await ctx.db
        .query('transactions')
        .filter((q) => q.eq(q.field('bidId'), args.bidId))
        .first();
      if (!transaction) throw new Error('Transaction not found.');

      const sender = await ctx.db.get(bid.clientId);
      const receiver = await ctx.db.get(bid.vendorId);
      const senderBalance = JSON.parse(sender!.balance);
      const receiverBalance = JSON.parse(receiver!.balance);

      if (receiver!.type !== 'vendor')
        throw new Error('Recipient must be a vendor.');
      if (bid.amount <= 0) throw new Error('Bid amount must be positive.');

      if (sender!.type === 'client' && args.type === 'refunded') {
        await ctx.db.patch(bid.clientId, {
          balance: JSON.stringify(senderBalance + bid.amount),
        });
      }

      if (receiver!.type === 'vendor' && args.type === 'closed') {
        await ctx.db.patch(bid.vendorId, {
          balance: JSON.stringify((receiverBalance + bid.amount) * 0.98), // fee: -2%
        });
      }

      if (
        transaction.type &&
        validTransitions[transaction.type as TransactionStatusType]
      ) {
        if (
          !validTransitions[transaction.type as TransactionStatusType].includes(
            args.type as TransactionStatusType,
          )
        ) {
          throw new Error(
            `Invalid state transition from ${transaction.type} to ${args.type}.`,
          );
        }
      } else {
        throw new Error('Transaction type is invalid or undefined.');
      }

      ctx.scheduler
        .runAfter(0, internal.transactions.update, {
          transactionId: transaction._id,
          type: args.type,
        })
        .catch((error) => {
          throw new Error(`Scheduler error: ${error}`);
        });
    } catch (error) {
      throw new Error(`Update contract error: ${error}`);
    }
  },
});

export const update = internalMutation({
  args: {
    transactionId: v.id('transactions'),
    type: v.string(),
  },

  handler: async (ctx, args) => {
    try {
      const transaction = await ctx.db.get(args.transactionId);
      if (!transaction) throw new Error('Transaction not found.');

      if (transaction.amount <= 0)
        throw new Error('Transaction amount must be positive.');

      if (
        transaction.type &&
        validTransitions[transaction.type as TransactionStatusType]
      ) {
        if (
          !validTransitions[transaction.type as TransactionStatusType].includes(
            args.type as TransactionStatusType,
          )
        ) {
          throw new Error(
            `Invalid state transition from ${transaction.type} to ${args.type}.`,
          );
        }
      } else {
        throw new Error('Transaction type is invalid or undefined.');
      }

      ctx.db.patch(args.transactionId, { type: args.type });
    } catch (error) {
      throw new Error(`Update error: ${error}`);
    }
  },
});
export const getByUserId = mutation({
  args: {
    userId: v.id('users'),
    page: v.number(),
    perpage: v.number(),
    filter: v.string(),
  },

  handler: async (ctx, args) => {
    try {
      const transactions = await ctx.db
        .query('transactions')
        .filter((q) =>
          q.or(
            q.eq(q.field('senderId'), args.userId),
            q.eq(q.field('receiverId'), args.userId),
          ),
        )
        .filter((q) =>
          q.or(
            q.eq(q.field('type'), 'deposit'),
            q.eq(q.field('type'), 'withdraw'),
            q.eq(q.field('type'), 'closed'),
          ),
        )
        .order('desc')
        .collect();

      const filteredTransactions = transactions.filter((res) =>
        res.type.includes(args.filter),
      );
      const total = filteredTransactions.length;

      const results = await Promise.all(
        filteredTransactions
          .slice((args.page - 1) * args.perpage, args.page * args.perpage)
          .map(async (row) => {
            const sender = await ctx.db.get(row.senderId);
            const receiver = await ctx.db.get(row.receiverId);
            return { ...row, sender, receiver };
          }),
      );

      return { total, results };
    } catch (error) {
      throw new Error(`Get by ID error: ${error}`);
    }
  },
});
