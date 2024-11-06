// src/app/components/ProtectedRoute.tsx

"use client";

import { useAuth } from "@/app/lib/firebase/auth";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function ProtectedRoute({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    // Only redirect if user is explicitly `null` (unauthenticated), not `undefined` (loading)
    if (user === null) {
      router.push("/auth/login");
    }
  }, [user, router]);

  if (user === undefined) return null; // Show nothing while user state is loading
  if (user === null) return null; // Avoid rendering content for unauthenticated users

  return <>{children}</>; // Render content for authenticated users
}
