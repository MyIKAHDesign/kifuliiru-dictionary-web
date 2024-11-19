"use client";

import { SignIn } from "@clerk/nextjs";
import { useSearchParams } from "next/navigation";

export default function SignInPage() {
  const searchParams = useSearchParams();
  const redirectUrl = searchParams?.get("redirect_url") || "/dashboard";

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 p-4">
      <div className="w-full max-w-md">
        {/* Logo and Welcome Text */}
        <div className="text-center mb-8">
          <div className="inline-block mb-6">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg">
              <span className="text-2xl font-bold text-white">KD</span>
            </div>
          </div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 dark:from-gray-100 dark:to-gray-300 bg-clip-text text-transparent">
            Welcome Back
          </h1>
          <p className="mt-3 text-gray-600 dark:text-gray-400">
            Sign in to continue exploring Kifuliiru language
          </p>
        </div>

        {/* Clerk Sign In Component */}
        <div className="backdrop-blur-sm bg-white/80 dark:bg-gray-800/80 rounded-2xl shadow-xl ring-1 ring-gray-900/5 dark:ring-gray-100/5">
          <SignIn
            appearance={{
              variables: {
                colorPrimary: "#4F46E5",
                colorBackground: "transparent",
                borderRadius: "0.75rem",
              },
              elements: {
                card: "shadow-none bg-transparent",
                headerTitle: "text-gray-900 dark:text-white text-xl",
                headerSubtitle: "text-gray-600 dark:text-gray-400",
                formButtonPrimary:
                  "bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-700 hover:to-indigo-800 shadow-md hover:shadow-lg transition-all duration-200",
                formFieldLabel: "text-gray-700 dark:text-gray-300",
                formFieldInput:
                  "bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-700 focus:border-indigo-500 dark:focus:border-indigo-400 focus:ring-2 focus:ring-indigo-500/20 dark:focus:ring-indigo-400/20 rounded-xl",
                footerActionLink:
                  "text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300",
                dividerLine: "bg-gray-200 dark:bg-gray-700",
                dividerText:
                  "text-gray-500 dark:text-gray-400 bg-white/80 dark:bg-gray-800/80",
                socialButtonsBlockButton:
                  "border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50 rounded-xl transition-colors",
                socialButtonsBlockButtonText:
                  "text-gray-700 dark:text-gray-300",
                formFieldErrorText: "text-red-600 dark:text-red-400",
                alert:
                  "bg-red-50 dark:bg-red-900/50 border-red-100 dark:border-red-800",
                alertText: "text-red-700 dark:text-red-300",
              },
              layout: {
                socialButtonsPlacement: "bottom",
                socialButtonsVariant: "blockButton",
              },
            }}
            redirectUrl={redirectUrl}
            signUpUrl="/auth/sign-up"
            routing="path"
            path="/auth/sign-in"
          />
        </div>

        {/* Footer Text */}
        <p className="mt-6 text-center text-sm text-gray-600 dark:text-gray-400">
          By signing in, you agree to our{" "}
          <a
            href="/terms"
            className="text-indigo-600 dark:text-indigo-400 hover:underline"
          >
            Terms of Service
          </a>{" "}
          and{" "}
          <a
            href="/privacy"
            className="text-indigo-600 dark:text-indigo-400 hover:underline"
          >
            Privacy Policy
          </a>
        </p>
      </div>
    </div>
  );
}
