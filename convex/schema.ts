import { authTables } from '@convex-dev/auth/server';
import { defineSchema, defineTable } from 'convex/server';
import { v } from 'convex/values';

const schema = defineSchema({
  ...authTables,

  users: defineTable({
    type: v.string(), // vendor or client
    fullname: v.string(),
    email: v.string(),
    emailVerificationTime: v.optional(v.float64()),
    photo: v.optional(v.id('_storage')),
    balance: v.string(),
    isAnonymous: v.optional(v.boolean()),
  }).index('email', ['email']),

  requests: defineTable({
    userId: v.id('users'),
    kind: v.string(),
    survey: v.optional(v.string()),
    asset: v.optional(v.string()),
    assetOther: v.optional(v.string()),
    ALTAoptions: v.array(v.string()),
    propertyAddress: v.string(),
    countyAccountInfo: v.optional(v.string()),
    siteContactInfoName: v.string(),
    siteContactInfoPhone: v.string(),
    siteContactInfoEmail: v.string(),
    turnaroundTime: v.string(),
    specificDate: v.string(),
    additionalInfo: v.array(
      v.object({
        index: v.number(),
        key: v.string(),
        value: v.string(),
        isEdit: v.boolean(),
      }),
    ),
    otherSurvey: v.string(),
    uploadCommits: v.array(v.string()),
    uploadSurveys: v.array(v.string()),
    uploadOthers: v.array(v.string()),
    receivedBids: v.array(v.id('bids')), // received bid ids
    receivedUsers: v.array(v.id('users')), // received user ids
    requestUser: v.object({
      fullname: v.string(),
      email: v.string(),
      creationTime: v.number(),
    }),
    status: v.string(), // open, start, revise, closed
  }),

  bids: defineTable({
    requestId: v.id('requests'),
    clientId: v.id('users'),
    vendorId: v.id('users'),
    amount: v.number(),
    unit: v.string(),
    workId: v.optional(v.id('_storage')),
    status: v.string(), // placed, rejected, accepted, submitted, rework, paid, refunding, refunded, closed
  }),

  transactions: defineTable({
    senderId: v.id('users'), // senderId === receiverId && type === 'deposite'
    receiverId: v.id('users'), // senderId === receiverId && type === 'withdraw'
    bidId: v.optional(v.id('bids')),
    amount: v.number(),
    type: v.string(), // deposit, escrow, sudmitted, paid, refunding, refunded, closed, withdraw
  }),
});

export default schema;
