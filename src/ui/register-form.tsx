"use client";

import { lusitana } from "@/ui/fonts";
import {
  UserIcon,
  AtSymbolIcon,
  KeyIcon,
  ExclamationCircleIcon,
  EyeIcon,
  EyeSlashIcon,
} from "@heroicons/react/24/outline";
import { ArrowRightIcon } from "@heroicons/react/20/solid";
import Link from "next/link";
import { useActionState, useState } from "react";
import { registerUser } from "@/lib/actions";

export default function RegisterForm() {
  const [state, formAction, isPending] = useActionState(registerUser, {
    message: null,
    errors: {},
    values: {
      name: "",
      email: "",
      password: "",
    },
  });
  const [showPassword, setShowPassword] = useState(false);

  const nameErrors = state?.errors?.name ?? [];
  const emailErrors = state?.errors?.email ?? [];
  const passwordErrors = state?.errors?.password ?? [];

  return (
    <form action={formAction} autoComplete="off">
      <div className="flex-1 rounded-lg bg-gray-100 px-6 py-6">
        <h1 className={`${lusitana.className} mb-3 text-2xl`}>
          Create your account.
        </h1>
        <div
          className="flex items-end space-x-1"
          aria-live="polite"
          aria-atomic="true"
        >
          {state?.message && (
            <>
              <ExclamationCircleIcon className="h-5 w-5 text-red-500" />
              <p className="text-sm text-red-500">{state.message}</p>
            </>
          )}
        </div>
        <div className="w-full">
          <div>
            <label
              className="mb-3 mt-5 block text-xs font-medium text-gray-900"
              htmlFor="name"
            >
              Full name
            </label>
            <div className="relative">
              <input
                className={`peer block w-full rounded-md border py-[9px] pl-10 text-sm outline-2 placeholder:text-gray-500 ${
                  nameErrors.length > 0
                    ? "border-red-300 focus:border-red-500"
                    : "border-gray-200"
                }`}
                id="name"
                type="text"
                name="name"
                placeholder="Enter your full name"
                autoComplete="off"
                spellCheck={false}
                defaultValue={state?.values?.name ?? ""}
                aria-invalid={nameErrors.length > 0}
              />
              <UserIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />
            </div>
            {nameErrors.length > 0 && (
              <div className="mt-2 space-y-1">
                {nameErrors.map((error) => (
                  <p key={error} className="text-sm text-red-500">
                    {error}
                  </p>
                ))}
              </div>
            )}
          </div>
          <div className="mt-4">
            <label
              className="mb-3 mt-5 block text-xs font-medium text-gray-900"
              htmlFor="email"
            >
              Email
            </label>
            <div className="relative">
              <input
                className={`peer block w-full rounded-md border py-[9px] pl-10 text-sm outline-2 placeholder:text-gray-500 ${
                  emailErrors.length > 0
                    ? "border-red-300 focus:border-red-500"
                    : "border-gray-200"
                }`}
                id="email"
                type="email"
                name="email"
                placeholder="Enter your email address"
                autoComplete="off"
                spellCheck={false}
                defaultValue={state?.values?.email ?? ""}
                aria-invalid={emailErrors.length > 0}
              />
              <AtSymbolIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />
            </div>
            {emailErrors.length > 0 && (
              <div className="mt-2 space-y-1">
                {emailErrors.map((error) => (
                  <p key={error} className="text-sm text-red-500">
                    {error}
                  </p>
                ))}
              </div>
            )}
          </div>
          <div className="mt-4">
            <label
              className="mb-3 mt-5 block text-xs font-medium text-gray-900"
              htmlFor="password"
            >
              Password
            </label>
            <div className="relative">
              <input
                className={`peer block w-full rounded-md border py-[9px] pl-10 pr-10 text-sm outline-2 placeholder:text-gray-500 ${
                  passwordErrors.length > 0
                    ? "border-red-300 focus:border-red-500"
                    : "border-gray-200"
                }`}
                id="password"
                type={showPassword ? "text" : "password"}
                name="password"
                placeholder="Create a password"
                autoComplete="new-password"
                minLength={6}
                defaultValue={state?.values?.password ?? ""}
                aria-invalid={passwordErrors.length > 0}
              />
              <KeyIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />
              <button
                type="button"
                title={showPassword ? "Hide password" : "Show password"}
                aria-label={showPassword ? "Hide password" : "Show password"}
                onClick={() => setShowPassword((current) => !current)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-600 hover:text-gray-800"
              >
                {showPassword ? (
                  <EyeIcon className="h-5 w-5" />
                ) : (
                  <EyeSlashIcon className="h-5 w-5" />
                )}
              </button>
            </div>
            {passwordErrors.length > 0 && (
              <div className="mt-2 space-y-1">
                {passwordErrors.map((error) => (
                  <p key={error} className="text-sm text-red-500">
                    {error}
                  </p>
                ))}
              </div>
            )}
          </div>
        </div>
        <button
          type="submit"
          className="mt-4 flex w-full items-center justify-center rounded-lg bg-blue-500 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-500 active:bg-blue-600 aria-disabled:cursor-not-allowed aria-disabled:opacity-50"
          aria-disabled={isPending}
        >
          Create account
          <ArrowRightIcon className="ml-auto h-5 w-5 text-gray-50" />
        </button>
        <p className="mt-4 text-center text-sm text-gray-600">
          Already have an account?{" "}
          <Link href="/login" className="text-blue-600 hover:text-blue-700 hover:underline">
            Log in
          </Link>
        </p>
      </div>
    </form>
  );
}
