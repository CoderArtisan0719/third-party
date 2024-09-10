/* eslint-disable no-console */
/* eslint-disable no-underscore-dangle */
import { v } from 'convex/values';

import { getAllValues } from '../src/utils/Object';
import type { RequestTableType } from '../src/utils/types';
import { mutation } from './_generated/server';

// Utility function for filtering requests
const filterRequests = (requests: RequestTableType[], filter: string) => {
  return requests.filter((request) =>
    getAllValues(request).some(
      (value) =>
        (typeof value === 'string' &&
          value.toLowerCase().includes(filter.toLowerCase())) ||
        (typeof value === 'number' && value === Number(filter)),
    ),
  );
};

// Fetch a request by ID
export const getById = mutation({
  args: { requestId: v.id('requests') },

  handler: async (ctx, args) => {
    try {
      const request = await ctx.db.get(args.requestId);
      if (!request)
        throw new Error(`Request with ID ${args.requestId} not found.`);
      return request;
    } catch (error) {
      console.error('Error fetching request by ID:', error);
      throw new Error(`Unable to fetch request: ${error}`);
    }
  },
});

// Fetch all requests for a specific user
export const getAvailable = mutation({
  args: {
    filter: v.string(),
    page: v.number(),
    perpage: v.number(),
  },

  handler: async (ctx, args) => {
    try {
      const allRequests = await ctx.db
        .query('requests')
        .filter((q) => q.eq(q.field('status'), 'open'))
        .order('desc')
        .collect();

      const filteredRequests = filterRequests(allRequests, args.filter);

      const total = allRequests.length;
      const totalFiltered = filteredRequests.length;

      const paginatedRequests =
        args.page && args.perpage
          ? filteredRequests.slice(
              (args.page - 1) * args.perpage,
              args.page * args.perpage,
            )
          : filteredRequests;

      const resolvedRequests = await Promise.all(
        paginatedRequests.map(async (request) => {
          const requestUser = await ctx.db.get(request.userId);
          return {
            ...request,
            requestUser: {
              creationTime: requestUser!._creationTime,
              fullname: requestUser!.fullname,
              email: requestUser!.email,
            },
          };
        }),
      );

      return { resolvedRequests, total, totalFiltered };
    } catch (error) {
      console.error('Error fetching requests by user ID:', error);
      throw new Error(`Unable to fetch requests: ${error}`);
    }
  },
});

// Fetch all requests for a specific user
export const getByUserId = mutation({
  args: {
    userId: v.id('users'),
    filter: v.string(),
    page: v.number(),
    perpage: v.number(),
  },

  handler: async (ctx, args) => {
    try {
      const allRequests = await ctx.db
        .query('requests')
        .filter((q) => q.eq(q.field('userId'), args.userId))
        .order('desc')
        .collect();

      const filteredRequests = filterRequests(allRequests, args.filter);

      const total = filteredRequests.length;

      const paginatedRequests =
        args.page && args.perpage
          ? filteredRequests.slice(
              (args.page - 1) * args.perpage,
              args.page * args.perpage,
            )
          : filteredRequests;

      const resolvedRequests = await Promise.all(
        paginatedRequests.map(async (request) => {
          const requestUser = await ctx.db.get(request.userId);
          return {
            ...request,
            requestUser: {
              creationTime: requestUser!._creationTime,
              fullname: requestUser!.fullname,
              email: requestUser!.email,
            },
          };
        }),
      );

      return { resolvedRequests, total };
    } catch (error) {
      console.error('Error fetching requests by user ID:', error);
      throw new Error(`Unable to fetch requests: ${error}`);
    }
  },
});

// Create a new request
export const create = mutation({
  args: {
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
    receivedBids: v.array(v.id('bids')),
    receivedUsers: v.array(v.id('users')),
    status: v.string(),
    requestUser: v.object({
      creationTime: v.number(),
      email: v.string(),
      fullname: v.string(),
    }),
  },

  handler: async (ctx, args) => {
    try {
      return await ctx.db.insert('requests', {
        ...args,
      });
    } catch (error) {
      console.error('Error creating request:', error);
      throw new Error(`Unable to create request: ${error}`);
    }
  },
});

// Increment the received count for a request
export const plusOne = mutation({
  args: {
    _id: v.id('requests'),
    bidId: v.id('bids'),
    userId: v.id('users'),
  },

  handler: async (ctx, args) => {
    try {
      const matched = await ctx.db.get(args._id);
      if (!matched) throw new Error('Request not found.');

      await ctx.db.patch(args._id, {
        receivedBids: [...matched.receivedBids, args.bidId],
        receivedUsers: [...matched.receivedUsers, args.userId],
      });
    } catch (error) {
      console.error('Error incrementing received count:', error);
      throw new Error(`Unable to increment received count: ${error}`);
    }
  },
});
