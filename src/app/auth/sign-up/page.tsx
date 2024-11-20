// app/auth/sign-up/page.tsx
"use client";

import { SignUpForm } from "./SignUpForm";

export default function SignUpPage() {
  return (
    <>
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12 px-4">
        <div className="max-w-md mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              Join Kifuliiru Dictionary
            </h1>
            <p className="mt-2 text-gray-600 dark:text-gray-400">
              Create an account to contribute and access all features
            </p>
          </div>

          <div className="bg-white dark:bg-gray-800 shadow-md rounded-lg p-6">
            <SignUpForm />

            <p className="mt-4 text-center text-sm text-gray-600 dark:text-gray-400">
              Already have an account?{" "}
              <a
                href="/auth/sign-in"
                className="text-indigo-600 hover:text-indigo-500"
              >
                Sign in
              </a>
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
