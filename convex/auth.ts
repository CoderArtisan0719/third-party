// import { Password } from '@convex-dev/auth/providers/Password';
import { Password } from '@convex-dev/auth/dist/providers/Password';
import { convexAuth } from '@convex-dev/auth/server';

import { ResendOTP } from './ResendOTP';
import { ResendOTPPasswordReset } from './ResendOTPPasswordReset';

export const { auth, signIn, signOut, store } = convexAuth({
  providers: [
    Password({
      id: 'forgot-password',
      reset: ResendOTPPasswordReset,
      verify: ResendOTP,
    }),

    Password({
      profile(params) {
        const email = params.email as string;
        const fullname = params.fullname as string;
        const type = params.type as string;
        const balance = params.balance as string;

        if (!email) {
          throw new Error('Missing email in profile parameters');
        }

        return {
          fullname,
          email,
          type,
          balance,
        };
      },
    }),
  ],
});
