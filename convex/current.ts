import { mutation, query } from './_generated/server';
import { auth } from './auth';

export const session = mutation({
  args: {},

  handler: async (ctx) => {
    const sessionId = await auth.getSessionId(ctx);
    if (sessionId === null) return null;

    const result = await ctx.db.get(sessionId);

    return result;
  },
});

export const user = query({
  args: {},

  handler: async (ctx) => {
    const userId = await auth.getUserId(ctx);

    return userId !== null ? ctx.db.get(userId) : null;
  },
});
