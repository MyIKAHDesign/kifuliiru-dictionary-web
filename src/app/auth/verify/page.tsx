/* // app/auth/verify/page.tsx
"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { Loader2, CheckCircle2, XCircle } from "lucide-react";

export default function VerifyPage() {
  const [verificationStatus, setVerificationStatus] = useState<
    "loading" | "success" | "error"
  >("loading");
  const [errorMessage, setErrorMessage] = useState<string>("");
  const router = useRouter();
  const searchParams = useSearchParams();
  const supabase = createClientComponentClient();

  useEffect(() => {
    const handleVerification = async () => {
      try {
        // Get the token from URL
        const token = searchParams.get("token");
        const type = searchParams.get("type");

        if (!token || !type) {
          setVerificationStatus("error");
          setErrorMessage("Invalid verification link");
          return;
        }

        if (type === "signup") {
          const { error } = await supabase.auth.verifyOtp({
            token_hash: token,
            type: "signup",
          });

          if (error) throw error;

          setVerificationStatus("success");
          // Redirect after a short delay
          setTimeout(() => {
            router.push("/auth/signin");
          }, 2000);
        } else if (type === "recovery") {
          // Handle password reset verification
          const { error } = await supabase.auth.verifyOtp({
            token_hash: token,
            type: "recovery",
          });

          if (error) throw error;
          setVerificationStatus("success");
          router.push("/auth/reset-password");
        }
      } catch (error) {
        console.error("Verification error:", error);
        setVerificationStatus("error");
        setErrorMessage(
          error instanceof Error ? error.message : "Verification failed"
        );
      }
    };

    handleVerification();
  }, [router, searchParams, supabase.auth]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 px-4">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          {verificationStatus === "loading" && (
            <div className="space-y-4">
              <Loader2 className="animate-spin h-12 w-12 mx-auto text-indigo-600" />
              <h2 className="text-2xl font-semibold">
                Verifying your email...
              </h2>
              <p className="text-gray-600 dark:text-gray-300">
                Please wait while we confirm your email address
              </p>
            </div>
          )}

          {verificationStatus === "success" && (
            <div className="space-y-4">
              <CheckCircle2 className="h-12 w-12 mx-auto text-green-600" />
              <h2 className="text-2xl font-semibold text-green-600">
                Email Verified Successfully!
              </h2>
              <p className="text-gray-600 dark:text-gray-300">
                Redirecting you to sign in...
              </p>
            </div>
          )}

          {verificationStatus === "error" && (
            <div className="space-y-4">
              <XCircle className="h-12 w-12 mx-auto text-red-600" />
              <h2 className="text-2xl font-semibold text-red-600">
                Verification Failed
              </h2>
              <p className="text-gray-600 dark:text-gray-300">{errorMessage}</p>
              <button
                onClick={() => router.push("/auth/signin")}
                className="mt-4 inline-flex items-center px-4 py-2 border border-transparent 
                         rounded-md shadow-sm text-sm font-medium text-white 
                         bg-indigo-600 hover:bg-indigo-700 focus:outline-none 
                         focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Return to Sign In
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
 */
