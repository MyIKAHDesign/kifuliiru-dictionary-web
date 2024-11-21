"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { Loader2 } from "lucide-react";
import { useAuth } from "@clerk/nextjs";

export default function ProtectedRoute({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isLoaded, isSignedIn } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (isLoaded && !isSignedIn) {
      // Store the intended destination to redirect back after sign in
      const currentPath = window.location.pathname;
      router.push(`/sign-in?redirect_url=${currentPath}`);
    }
  }, [isLoaded, isSignedIn, router]);

  // Show loading spinner while Clerk loads
  if (!isLoaded) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-indigo-600" />
      </div>
    );
  }

  // Don't render anything if not authenticated
  if (!isSignedIn) {
    return null;
  }

  // User is authenticated, render the protected content
  return <>{children}</>;
}
