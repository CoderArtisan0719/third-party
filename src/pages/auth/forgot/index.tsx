/* eslint-disable react/no-unescaped-entities */
/* eslint-disable no-console */
import { useAuthActions } from '@convex-dev/auth/react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import React, { useState } from 'react';

import Meta from '@/components/common/Meta';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from '@/components/ui/input-otp';

const Forgot = () => {
  const [step, setStep] = useState<'forgot' | { email: string }>('forgot');

  const router = useRouter();

  const { signIn } = useAuthActions();

  return (
    <div className="flex min-h-screen items-center justify-center p-8">
      <Meta title="Forgot password" />

      <div className="flex size-full max-w-sm flex-col items-center gap-4">
        <img src="/logo.png" className="h-10" alt="logo.png" />
        <div className="rounded-lg bg-black px-8 py-12 opacity-70 shadow-lg">
          <div className="flex justify-center">
            <img src="/img/forgot.png" className="h-40" alt="forgot.png" />
          </div>

          <h2 className="mb-4 text-2xl font-bold text-white">
            Forgot password?
          </h2>

          <p className="text-gray-500">
            Please enter your registered email address.
          </p>
          <p className="mb-4 text-gray-500">
            We'll send instructions to help reset your password
          </p>

          <form
            onSubmit={(event) => {
              event.preventDefault();
              const formData = new FormData(event.currentTarget);
              signIn('forgot-password', formData).then(() => {
                if (step === 'forgot')
                  setStep({ email: formData.get('email') as string });
                else router.push('/auth/signin/client');
              });
            }}
          >
            <div className="grid gap-4">
              <Input
                name="flow"
                type="hidden"
                value={step === 'forgot' ? 'reset' : 'reset-verification'}
              />

              <Input
                type="text"
                name="email"
                className="mt-4 w-full text-white"
                placeholder="E-mail"
              />

              {step !== 'forgot' && (
                <InputOTP maxLength={8} name="code">
                  <InputOTPGroup>
                    <InputOTPSlot className="text-white" index={0} />
                    <InputOTPSlot className="text-white" index={1} />
                    <InputOTPSlot className="text-white" index={2} />
                    <InputOTPSlot className="text-white" index={3} />
                  </InputOTPGroup>
                  <InputOTPSeparator className="text-white" />
                  <InputOTPGroup>
                    <InputOTPSlot className="text-white" index={4} />
                    <InputOTPSlot className="text-white" index={5} />
                    <InputOTPSlot className="text-white" index={6} />
                    <InputOTPSlot className="text-white" index={7} />
                  </InputOTPGroup>
                </InputOTP>
              )}

              {step !== 'forgot' && (
                <Input
                  type="password"
                  name="newPassword"
                  className="w-full text-white"
                  placeholder="New password"
                />
              )}

              {step !== 'forgot' && (
                <Input name="email" value={step.email} type="hidden" />
              )}
              <Button
                type="submit"
                className="text-md w-full rounded-md bg-blue-600 py-2 text-white transition duration-200 hover:bg-blue-700"
              >
                {step === 'forgot' ? 'Send reset instructions' : 'Continue'}
              </Button>

              {step !== 'forgot' && (
                <Button
                  type="button"
                  className="text-md w-full rounded-md bg-blue-600 py-2 text-white transition duration-200 hover:bg-blue-700"
                  onClick={() => setStep('forgot')}
                >
                  Cancel
                </Button>
              )}
            </div>
          </form>
        </div>

        <p className="mt-4">
          Go back to{' '}
          <Link
            href="/auth/signin/vendor"
            className="text-blue-700 hover:underline"
          >
            Sign In
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Forgot;
