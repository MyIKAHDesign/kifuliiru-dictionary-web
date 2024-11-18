"use client";

import { SignUp } from "@clerk/nextjs";
import { useSearchParams } from "next/navigation";

export default function SignUpPage() {
  const searchParams = useSearchParams();
  const redirectUrl = searchParams?.get("redirect_url") || "/dashboard";

  return (
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

        <SignUp
          appearance={{
            variables: {
              colorPrimary: "#4F46E5",
              colorTextOnPrimaryBackground: "#ffffff",
            },
            elements: {
              card: "bg-white dark:bg-gray-800 shadow-md",
              headerTitle: "text-gray-900 dark:text-white",
              headerSubtitle: "text-gray-600 dark:text-gray-400",
              formButtonPrimary: "bg-indigo-600 hover:bg-indigo-700 text-white",
              footerActionLink: "text-indigo-600 hover:text-indigo-500",
              dividerLine: "bg-gray-200 dark:bg-gray-700",
              dividerText: "text-gray-500 dark:text-gray-400",
              formFieldLabel: "text-gray-700 dark:text-gray-300",
              formFieldInput:
                "border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900",
              socialButtonsBlockButton:
                "border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700",
              socialButtonsBlockButtonText: "text-gray-600 dark:text-gray-300",
            },
            layout: {
              socialButtonsPlacement: "bottom",
              socialButtonsVariant: "blockButton",
            },
          }}
          redirectUrl={redirectUrl}
          signInUrl="/auth/sign-in"
          routing="path"
          path="/auth/sign-up"
        />
      </div>
    </div>
  );
}
