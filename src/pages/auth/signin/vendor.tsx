/* eslint-disable no-console */
import { useAuthActions, useAuthToken } from '@convex-dev/auth/react';
import { useMutation } from 'convex/react';
import Cookies from 'js-cookie';
import { jwtDecode } from 'jwt-decode';
import Link from 'next/link';
import { useRouter } from 'next/router';
import type { BaseSyntheticEvent, Dispatch, SetStateAction } from 'react';
import React, { useEffect, useState } from 'react';

import Meta from '@/components/common/Meta';

import { api } from '../../../../convex/_generated/api';
import type { Id } from '../../../../convex/_generated/dataModel';

const SigninVendor = () => {
  const [email, setEmail] = useState('');
  const [emailChanged, setEmailChanged] = useState(false);
  const [password, setPassword] = useState('');
  const [passwordChanged, setPasswordChanged] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  const router = useRouter();

  const token = useAuthToken();
  const userMutation = useMutation(api.users.getById);
  const { signIn } = useAuthActions();

  const validateRequired = (
    stateSetter: Dispatch<SetStateAction<string>>,
    value: string,
    isChangedSetter: Dispatch<SetStateAction<boolean>>,
  ) => {
    stateSetter(value);
    isChangedSetter(true);
  };

  const onSubmit = (event: BaseSyntheticEvent) => {
    event.preventDefault();

    if (email === '' || password === '') {
      setEmailChanged(true);
      setPasswordChanged(true);
      return;
    }

    setErrorMessage('');
    setSubmitting(true);
    const formData = new FormData(event.currentTarget);

    signIn('password', formData)
      .then(() => {
        setSuccess(true);
      })
      .catch((error) => {
        if (error.message.includes('InvalidAccountId'))
          setErrorMessage('Invalid Email');

        if (error.message.includes('InvalidSecret'))
          setErrorMessage('Wrong password');

        setSubmitting(false);
      });
  };

  useEffect(() => {
    if (success && token) {
      const userId = token
        ? jwtDecode(String(token))?.sub?.split('|')[0]
        : null;

      userMutation({ userId: userId as Id<'users'> }).then((res) => {
        if (res.type !== 'vendor') {
          setSubmitting(false);
          setSuccess(false);
          setErrorMessage(
            'This account already exists as a client. Please sign in as a vendor.',
          );
        } else {
          Cookies.set('auth-token', token, { expires: 7 }); // Store token in cookies for 7 days
          sessionStorage.setItem('userInfo', JSON.stringify(res));
          router.push('/vendor');
        }
      });
    }
  }, [success, token]);

  return (
    // bg-gradient-to-r from-blue-500 to-teal-500
    <div className="flex min-h-screen items-center justify-center p-8">
      <Meta title="signin" />

      <div className="flex size-full max-w-sm flex-col items-center gap-4">
        <img
          src="/logo.png"
          className="h-10 cursor-pointer"
          alt="logo.png"
          onClick={() => router.push('/')}
        />
        <div className="rounded-lg bg-black px-8 py-12 opacity-70 shadow-lg">
          <h2 className="mb-4 text-2xl font-bold text-white">Vendor Sign in</h2>
          <p className="mb-4 text-gray-500">Login to manage your account</p>

          <form onSubmit={onSubmit}>
            <div className="mb-4">
              <div className="relative">
                <div className="pointer-events-none absolute inset-y-0 start-0 flex ps-3 pt-3">
                  <img
                    src="/img/envelope.png"
                    className="size-5"
                    alt="envelope.png"
                  />
                </div>

                <input
                  type="text"
                  name="email"
                  id="email"
                  className="w-full rounded border border-gray-500 bg-transparent p-2 ps-10 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="E-mail"
                  autoComplete="on"
                  value={email}
                  onChange={(e) =>
                    validateRequired(setEmail, e.target.value, setEmailChanged)
                  }
                />

                {emailChanged && email === '' && (
                  <p className="mt-1 text-red-500">Email is required</p>
                )}
              </div>
            </div>

            <input name="flow" value="signIn" type="hidden" />
            <input name="type" value="vendor" type="hidden" />

            <div className="mb-4">
              <div className="relative">
                <div className="pointer-events-none absolute inset-y-0 start-0 flex ps-2 pt-2">
                  <img src="/img/key.png" className="size-7" alt="key.png" />
                </div>

                <input
                  type="password"
                  name="password"
                  id="password"
                  className="w-full rounded border border-gray-500 bg-transparent p-2 ps-10 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Password"
                  autoComplete="off"
                  value={password}
                  onChange={(e) =>
                    validateRequired(
                      setPassword,
                      e.target.value,
                      setPasswordChanged,
                    )
                  }
                />

                {passwordChanged && password === '' && (
                  <p className="mt-1 text-red-500">Password is required</p>
                )}
              </div>
            </div>

            {errorMessage !== '' && (
              <p className="mb-4 text-red-500">{errorMessage}</p>
            )}

            <button
              type="submit"
              className="w-full rounded-md bg-blue-600 py-2 text-white transition duration-200 hover:bg-primary-azureBlue disabled:bg-blue-400"
              disabled={submitting}
            >
              {submitting ? 'Please wait...' : 'Sign in'}
            </button>
          </form>
        </div>

        <div className="mt-4 text-center">
          <p>
            <Link
              href="/auth/signin/client"
              className="text-primary-azureBlue hover:underline"
            >
              Sign in as a client
            </Link>
          </p>

          <p className="mt-4 whitespace-nowrap">Don&apos;t have an account?</p>

          <p>
            <Link
              href="/auth/signup/client"
              className="text-primary-azureBlue hover:underline"
            >
              Sign up as a client
            </Link>
            &nbsp; &nbsp; or &nbsp; &nbsp;
            <Link
              href="/auth/signup/vendor"
              className="text-primary-azureBlue hover:underline"
            >
              Sign up as a vendor
            </Link>
          </p>

          <p className="mt-4">
            <Link
              href="/auth/forgot"
              className="text-primary-azureBlue hover:underline"
            >
              Forgot password?
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default SigninVendor;
