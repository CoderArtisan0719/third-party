import Resend from '@auth/core/providers/resend';
import { alphabet, generateRandomString } from 'oslo/crypto';
import { Resend as ResendAPI } from 'resend';

export const ResendOTPPasswordReset = Resend({
  id: 'resend-otp',
  apiKey: process.env.AUTH_RESEND_KEY,
  async generateVerificationToken() {
    return generateRandomString(8, alphabet('0-9'));
  },
  async sendVerificationRequest({ identifier: email, provider, token }) {
    if (!process.env.AUTH_RESEND_KEY) {
      throw new Error('Resend API key is not defined.');
    }

    const resend = new ResendAPI(provider.apiKey);
    const { error } = await resend.emails.send({
      from: 'Third Parties <onboarding@resend.dev>',
      to: [email],
      subject: 'Reset your password in Third Parties',
      text: `Your password reset code is ${token}`,
    });

    if (error) {
      throw new Error(
        `Could not send an email for password reset: ${error.message}`,
      );
    }
  },
});
