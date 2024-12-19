"use client";

import { SignInForm } from "./SignInForm";

export default function SignInPage() {
  return (
    <>
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 p-4">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <div className="inline-block mb-6">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg">
                <span className="text-2xl font-bold text-white">Kifuliiru</span>
              </div>
            </div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 dark:from-gray-100 dark:to-gray-300 bg-clip-text text-transparent">
              Welcome Back
            </h1>
            <p className="mt-3 text-gray-600 dark:text-gray-400">
              Sign in to contribute and access features
            </p>
          </div>

          <div className="backdrop-blur-sm bg-white/80 dark:bg-gray-800/80 rounded-2xl shadow-xl ring-1 ring-gray-900/5 dark:ring-gray-100/5 p-6">
            <SignInForm />
          </div>

          <p className="mt-6 text-center text-sm text-gray-600 dark:text-gray-400">
            New user?{" "}
            <a
              href="/auth/sign-up"
              className="text-indigo-600 dark:text-indigo-400 hover:underline"
            >
              Sign up
            </a>
          </p>
        </div>
      </div>
    </>
  );
}
