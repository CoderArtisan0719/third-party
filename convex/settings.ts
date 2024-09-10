/* eslint-disable no-console */
import { modifyAccountCredentials } from '@convex-dev/auth/server';
import { v } from 'convex/values';

import { mutation } from './_generated/server';

export const profile = mutation({
  args: { userId: v.id('users'), fullname: v.string(), email: v.string() },

  handler: async (ctx, args) => {
    ctx.db.patch(args.userId, { fullname: args.fullname, email: args.email });
  },
});

export const photo = mutation({
  args: { userId: v.id('users'), photo: v.id('_storage') },

  handler: async (ctx, args) => {
    ctx.db.patch(args.userId, { photo: args.photo });
  },
});

export const password = mutation({
  args: {
    userId: v.id('users'),
    oldPassword: v.string(),
    newPassword: v.string(),
  },

  handler: async (ctx, args) => {
    const user = await ctx.db.get(args.userId);

    modifyAccountCredentials(ctx as any, {
      account: {
        id: 'xlooplion@gmail.com',
        secret: args.newPassword,
      },
      provider: 'password',
    });

    console.log(user);

    return 'Current password is incorrect';
  },
});
