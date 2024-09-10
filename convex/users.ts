/* eslint-disable no-underscore-dangle */
import { v } from 'convex/values';

import { mutation } from './_generated/server';

export const getById = mutation({
  args: { userId: v.id('users') },

  handler: async (ctx, args) => {
    try {
      const result = await ctx.db.get(args.userId);

      return { ...result };
    } catch (error) {
      throw new Error('Unable to fetch request.');
    }
  },
});
