import { useAuthActions } from '@convex-dev/auth/react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import type { BaseSyntheticEvent, Dispatch, SetStateAction } from 'react';
import React, { useState } from 'react';

import Meta from '@/components/common/Meta';

const SignupClient = () => {
  const [fullname, setFullname] = useState('');
  const [fullnameChanged, setFullnameChanged] = useState(false);
  const [email, setEmail] = useState('');
  const [emailChanged, setEmailChanged] = useState(false);
  const [password, setPassword] = useState('');
  const [passwordChanged, setPasswordChanged] = useState(false);
  const [confirmPassword, setConfirmPassword] = useState('');
  const [confirmPasswordChanged, setConfirmPasswordChanged] = useState(false);
  const [isAgreed, setIsAgreed] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [criteria, setCriteria] = useState(false);

  const emailRegex = /^[\w-+.]+@([\w-]+\.)+[\w-]{2,4}$/;
  const passwordRegex =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*[\d!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,}$/;

  const router = useRouter();

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

    if (!isAgreed) {
      setErrorMessage('You must agree to the Terms & Conditions');
      return;
    }

    if (!emailRegex.test(email)) {
      setErrorMessage('Email is an invalid one.');
      return;
    }

    // Validate password
    if (!passwordRegex.test(password)) {
      setErrorMessage('Password is too weak.');
      setCriteria(true);
      return;
    }

    setCriteria(false);

    // Clear error message if agreement is checked
    setErrorMessage('');

    if (
      fullname === '' ||
      email === '' ||
      password === '' ||
      confirmPassword === '' ||
      password !== confirmPassword
    )
      return;

    setSubmitting(true);

    const formData = new FormData(event.currentTarget);
    formData.append('balance', '0');

    signIn('password', formData)
      .then(() => {
        router.push('/auth/signin/client');
      })
      .catch((error) => {
        if (error.message.includes('already exists'))
          setErrorMessage('This account already exists.');

        setSubmitting(false);
        setFullnameChanged(true);
        setEmailChanged(true);
        setPasswordChanged(true);
        setConfirmPasswordChanged(true);
      });
  };

  return (
    // bg-gradient-to-r from-blue-500 to-teal-500
    <div className="flex min-h-screen items-center justify-center p-8">
      <Meta title="signup" />

      <div className="rounded-3xl bg-black px-8 pb-40 pt-8 opacity-90 shadow-primary">
        <img src="/logo.png" className="h-10" alt="logo.png" />

        <div className="mt-8 grid gap-20 md:px-16 lg:grid-cols-2">
          <img src="/img/signup.png" alt="signup.png" />

          <div className="lg:pr-16 xl:pr-28">
            <h2 className="mb-6 text-2xl font-bold text-white">
              Client Sign up
            </h2>

            <form onSubmit={onSubmit}>
              <div className="mb-4">
                <div className="relative">
                  <div className="pointer-events-none absolute inset-y-0 start-0 flex ps-3 pt-3">
                    <img
                      src="/img/user.png"
                      className="size-5"
                      alt="user.png"
                    />
                  </div>

                  <input
                    type="text"
                    name="fullname"
                    id="fullname"
                    className="w-full rounded border border-gray-500 bg-transparent p-2 ps-10 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Full Name"
                    autoComplete="on"
                    value={fullname}
                    onChange={(e) =>
                      validateRequired(
                        setFullname,
                        e.target.value,
                        setFullnameChanged,
                      )
                    }
                  />

                  {fullnameChanged && fullname === '' && (
                    <p className="text-red-500">Full Name is required</p>
                  )}
                </div>
              </div>

              <div className="mb-4">
                <div className="relative">
                  <div className="pointer-events-none absolute inset-y-0 start-0 flex ps-3 pt-3">
                    <img
                      src="/img/envelope.png"
                      className="size-5"
                      alt="user.png"
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
                      validateRequired(
                        setEmail,
                        e.target.value,
                        setEmailChanged,
                      )
                    }
                  />

                  {emailChanged && email === '' && (
                    <p className="text-red-500">Email is required</p>
                  )}
                </div>
              </div>

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
                    <p className="text-red-500">Password is required</p>
                  )}
                </div>
              </div>

              <div className="mb-4">
                <div className="relative">
                  <div className="pointer-events-none absolute inset-y-0 start-0 flex ps-4 pt-4">
                    <img
                      src="/img/check.png"
                      className="size-3"
                      alt="key.png"
                    />
                  </div>

                  <input
                    type="password"
                    id="confirmPassword"
                    className="w-full rounded border border-gray-500 bg-transparent p-2 ps-10 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Re-Type"
                    autoComplete="off"
                    value={confirmPassword}
                    onChange={(e) =>
                      validateRequired(
                        setConfirmPassword,
                        e.target.value,
                        setConfirmPasswordChanged,
                      )
                    }
                  />

                  {confirmPasswordChanged && confirmPassword === '' && (
                    <p className="text-red-500">Confirm is required</p>
                  )}

                  {confirmPasswordChanged &&
                    confirmPassword !== '' &&
                    confirmPassword !== password && (
                      <p className="text-red-500">Password not match</p>
                    )}
                </div>
              </div>

              <input type="hidden" name="flow" value="signUp" />
              <input type="hidden" name="type" value="client" />

              <div className="mb-4 flex items-center">
                <input
                  type="checkbox"
                  id="agree"
                  checked={isAgreed}
                  onChange={(e) => setIsAgreed(e.target.checked)}
                  className="mr-2"
                  autoComplete="off"
                />

                <label className="text-gray-300" htmlFor="agree">
                  I agree to the Terms & Conditions
                </label>
              </div>

              {errorMessage && (
                <p className="mb-4 text-sm text-red-500">{errorMessage}</p>
              )}

              {criteria && (
                <div className="mb-4">
                  <p className="text-red-500">
                    Password must contains following.
                  </p>
                  <p className="text-slate-400">1 uppercase letter</p>
                  <p className="text-slate-400">1 lowercase letter</p>
                  <p className="text-slate-400">
                    1 number or special character
                  </p>
                  <p className="text-slate-400">8 characters long</p>
                </div>
              )}

              <button
                type="submit"
                className="w-full rounded bg-blue-600 py-2 font-bold text-white hover:bg-blue-700 disabled:bg-blue-400"
                disabled={submitting}
              >
                Create my account
              </button>
            </form>

            <p className="mt-8 text-gray-400">
              Do you want to work as a vendor?
            </p>

            <p>
              <Link
                href="/auth/signup/vendor"
                className="text-blue-700 hover:underline"
              >
                Sign Up as a vendor
              </Link>
            </p>

            <p className="mt-4 text-gray-400">Already have an account? </p>

            <p>
              <Link
                href="/auth/signin/client"
                className="text-blue-700 hover:underline"
              >
                Sign In as a client
              </Link>

              <span className="text-white">&nbsp; &nbsp; or &nbsp; &nbsp;</span>

              <Link
                href="/auth/signin/vendor"
                className="text-blue-700 hover:underline"
              >
                Sign In as a vendor
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignupClient;
