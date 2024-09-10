/* eslint-disable no-underscore-dangle */
import { v } from 'convex/values';

import { getAllValues } from '../src/utils/Object';
import type { BidType } from '../src/utils/types';
import { internal } from './_generated/api';
import { mutation } from './_generated/server';

// Helper function to expand bids
const expandBids = async (ctx: any, bids: BidType[]) => {
  return Promise.all(
    bids.map(async (bid) => {
      const request = await ctx.db.get(bid.requestId);
      const client = await ctx.db.get(bid.clientId);
      const vendor = await ctx.db.get(bid.vendorId);
      return {
        ...bid,
        request: request!,
        client: {
          fullname: client?.fullname!,
          email: client?.email!,
          creationTime: client?._creationTime!,
        },
        vendor: {
          fullname: vendor?.fullname!,
          email: vendor?.email!,
          creationTime: vendor?._creationTime!,
        },
      };
    }),
  );
};

// Helper function for filtering bids
const filterBids = (bids: BidType[], filter: string) => {
  return bids.filter((bid: BidType) =>
    getAllValues(bid).some(
      (value: any) =>
        (typeof value === 'string' &&
          value.toLowerCase().includes(filter.toLowerCase())) ||
        (typeof value === 'number' && value === Number(filter)),
    ),
  );
};

// Helper function for pagination
const paginateBids = (bids: BidType[], page: number, perpage: number) => {
  return bids.slice((page - 1) * perpage, page * perpage);
};

export const getById = mutation({
  args: { bidId: v.id('bids') },
  handler: async (ctx, args) => {
    try {
      const bid = await ctx.db.get(args.bidId);
      if (!bid) throw new Error('Bid not found.');
      return bid;
    } catch (error) {
      throw new Error(`Get by ID error: ${error}`);
    }
  },
});

export const getPlacedByRequestId = mutation({
  args: {
    requestId: v.id('requests'),
    filter: v.string(),
    page: v.number(),
    perpage: v.number(),
  },
  handler: async (ctx, args) => {
    try {
      const allBids = await ctx.db
        .query('bids')
        .filter((q) => q.eq(q.field('requestId'), args.requestId))
        .filter((q) => q.eq(q.field('status'), 'placed'))
        .order('desc')
        .collect();

      const expandedBids = await expandBids(ctx, allBids as BidType[]);
      const filteredBids = filterBids(expandedBids, args.filter);
      const bids = paginateBids(filteredBids, args.page, args.perpage);

      return { bids, total: filteredBids.length };
    } catch (error) {
      throw new Error(`Get placed by request ID error: ${error}`);
    }
  },
});

export const getByRequestId = mutation({
  args: {
    requestId: v.id('requests'),
    filter: v.string(),
    page: v.number(),
    perpage: v.number(),
  },

  handler: async (ctx, args) => {
    try {
      const allBids = await ctx.db
        .query('bids')
        .filter((q) => q.eq(q.field('requestId'), args.requestId))
        .order('desc')
        .collect();

      const expandedBids = await expandBids(ctx, allBids as BidType[]);
      const filteredBids = filterBids(expandedBids, args.filter);
      const bids = paginateBids(filteredBids, args.page, args.perpage);

      return { bids, total: filteredBids.length };
    } catch (error) {
      throw new Error(`Get by request ID error: ${error}`);
    }
  },
});

export const getByClientId = mutation({
  args: {
    clientId: v.id('users'),
    filter: v.string(),
    page: v.number(),
    perpage: v.number(),
  },

  handler: async (ctx, args) => {
    try {
      const allBids = await ctx.db
        .query('bids')
        .filter((q) => q.eq(q.field('clientId'), args.clientId))
        .order('desc')
        .collect();

      const expandedBids = await expandBids(ctx, allBids as BidType[]);
      const filteredBids = filterBids(expandedBids, args.filter);
      const bids = paginateBids(filteredBids, args.page, args.perpage);

      return { bids, total: filteredBids.length };
    } catch (error) {
      throw new Error(`Get by client ID error: ${error}`);
    }
  },
});

export const getByVendorId = mutation({
  args: {
    vendorId: v.id('users'),
    filter: v.string(),
    page: v.number(),
    perpage: v.number(),
  },

  handler: async (ctx, args) => {
    try {
      const allBids = await ctx.db
        .query('bids')
        .filter((q) => q.eq(q.field('vendorId'), args.vendorId))
        .order('desc')
        .collect();

      const expandedBids = await expandBids(ctx, allBids as BidType[]);
      const filteredBids = filterBids(expandedBids, args.filter);
      const bids = paginateBids(filteredBids, args.page, args.perpage);

      return { bids, total: filteredBids.length };
    } catch (error) {
      throw new Error(`Get by vendor ID error: ${error}`);
    }
  },
});

export const getActiveByClientId = mutation({
  args: {
    clientId: v.id('users'),
    filter: v.string(),
    page: v.number(),
    perpage: v.number(),
  },

  handler: async (ctx, args) => {
    try {
      const allBids = await ctx.db
        .query('bids')
        .filter((q) => q.eq(q.field('clientId'), args.clientId))
        .filter((q) =>
          q.and(
            q.neq(q.field('status'), 'placed'),
            q.neq(q.field('status'), 'rejected'),
            q.neq(q.field('status'), 'closed'),
          ),
        )
        .order('desc')
        .collect();

      const expandedBids = await expandBids(ctx, allBids as BidType[]);
      const filteredBids = filterBids(expandedBids, args.filter);
      const bids = paginateBids(filteredBids, args.page, args.perpage);

      return { bids, total: filteredBids.length };
    } catch (error) {
      throw new Error(`Get active by client ID error: ${error}`);
    }
  },
});

export const getActiveByVendorId = mutation({
  args: {
    vendorId: v.id('users'),
    filter: v.string(),
    page: v.number(),
    perpage: v.number(),
  },

  handler: async (ctx, args) => {
    try {
      const allBids = await ctx.db
        .query('bids')
        .filter((q) => q.eq(q.field('vendorId'), args.vendorId))
        .filter((q) =>
          q.and(
            q.neq(q.field('status'), 'placed'),
            q.neq(q.field('status'), 'rejected'),
            q.neq(q.field('status'), 'closed'),
          ),
        )
        .order('desc')
        .collect();

      const expandedBids = await expandBids(ctx, allBids as BidType[]);
      const filteredBids = filterBids(expandedBids, args.filter);
      const bids = paginateBids(filteredBids, args.page, args.perpage);

      return { bids, total: filteredBids.length };
    } catch (error) {
      throw new Error(`Get active by vendor ID error: ${error}`);
    }
  },
});

export const create = mutation({
  args: {
    requestId: v.id('requests'),
    clientId: v.id('users'),
    vendorId: v.id('users'),
    amount: v.number(),
    unit: v.string(),
  },

  handler: async (ctx, args) => {
    try {
      return await ctx.db.insert('bids', {
        ...args,
        status: 'placed',
      });
    } catch (error) {
      throw new Error(`Create bid error: ${error}`);
    }
  },
});

export const update = mutation({
  args: {
    bidId: v.id('bids'),
    status: v.string(),
  },

  handler: async (ctx, args) => {
    try {
      const bid = await ctx.db.get(args.bidId);
      if (!bid) throw new Error('Bid not found.');

      if (
        [
          'submitted',
          'rework',
          'paid',
          'refunding',
          'refunded',
          'closed',
        ].includes(args.status)
      ) {
        await ctx.scheduler.runAfter(0, internal.transactions.updateContract, {
          bidId: args.bidId,
          type: args.status,
        });
      }

      await ctx.db.patch(args.bidId, { status: args.status });

      if (args.status === 'accepted') {
        await ctx.scheduler.runAfter(0, internal.transactions.startContract, {
          bidId: args.bidId,
        });
        await ctx.db.patch(bid.requestId, { status: 'start' });
      }
      if (args.status === 'rework') {
        await ctx.db.patch(bid.requestId, { status: 'revise' });
      }
      if (args.status === 'closed') {
        await ctx.db.patch(bid.requestId, { status: 'closed' });
      }
    } catch (error) {
      throw new Error(`Update error: ${error}`);
    }
  },
});

export const sendWork = mutation({
  args: {
    bidId: v.id('bids'),
    workId: v.optional(v.id('_storage')),
  },

  handler: async (ctx, args) => {
    try {
      await ctx.db.patch(args.bidId, {
        status: 'submitted',
        workId: args.workId,
      });
      await ctx.scheduler.runAfter(0, internal.transactions.updateContract, {
        bidId: args.bidId,
        type: 'submitted',
      });
    } catch (error) {
      throw new Error(`Send work error: ${error}`);
    }
  },
});
