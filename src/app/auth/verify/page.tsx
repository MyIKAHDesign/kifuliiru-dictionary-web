"use client";

import React, { useEffect } from "react";
import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { Loader2 } from "lucide-react";

// Define the verification types that Supabase supports
type VerificationType =
  | "signup"
  | "recovery"
  | "invite"
  | "email"
  | "magiclink";

function VerifyComponent() {
  const searchParams = useSearchParams();
  const next = searchParams.get("next");
  const token_hash = searchParams.get("token_hash");
  const type = searchParams.get("type") as VerificationType | null;
  const supabase = createClientComponentClient();

  useEffect(() => {
    const handleEmailVerification = async () => {
      try {
        if (token_hash && type) {
          if (!isValidVerificationType(type)) {
            throw new Error("Invalid verification type");
          }

          const { error } = await supabase.auth.verifyOtp({
            token_hash,
            type,
          });
          if (error) throw error;
          // Redirect after verification
          window.location.href = next || "/";
        }
      } catch (error: unknown) {
        console.error("Error verifying email:", error);
        // Handle error (e.g., show error message)
      }
    };

    handleEmailVerification();
  }, [token_hash, type, next, supabase.auth]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
      <div className="max-w-md w-full space-y-8 p-8 bg-white dark:bg-gray-800 rounded-lg shadow-lg">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
            Verifying your email
          </h2>
          <p className="mt-2 text-gray-600 dark:text-gray-300">
            Please wait while we verify your email address...
          </p>
          <div className="mt-4 flex justify-center">
            <Loader2 className="h-8 w-8 animate-spin text-orange-600" />
          </div>
        </div>
      </div>
    </div>
  );
}

// Type guard to ensure we have a valid verification type
function isValidVerificationType(type: string): type is VerificationType {
  const validTypes: VerificationType[] = [
    "signup",
    "recovery",
    "invite",
    "email",
    "magiclink",
  ];
  return validTypes.includes(type as VerificationType);
}

export default function VerifyPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
          <Loader2 className="h-8 w-8 animate-spin text-orange-600" />
        </div>
      }
    >
      <VerifyComponent />
    </Suspense>
  );
}
