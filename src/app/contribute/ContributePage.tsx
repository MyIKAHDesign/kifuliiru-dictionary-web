"use client";

import { useEffect, useState } from "react";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import ContributeContent from "./ContributeContent";

export default function ContributePage() {
  const [loading, setLoading] = useState(true);
  const [isAuthorized, setIsAuthorized] = useState(false);
  const router = useRouter();
  const supabase = createClientComponentClient();

  useEffect(() => {
    async function checkAuth() {
      try {
        const {
          data: { session },
        } = await supabase.auth.getSession();

        if (!session) {
          const currentPath = window.location.pathname;
          router.push(`/auth/sign-in?redirect_url=${currentPath}`);
          return;
        }

        // Check user role in profiles table
        const { data: profile, error } = await supabase
          .from("profiles")
          .select("role")
          .eq("id", session.user.id)
          .single();

        if (error) throw error;

        // Check if user has the required role
        const allowedRoles = ["editor", "admin", "super_admin"];
        if (profile && allowedRoles.includes(profile.role)) {
          setIsAuthorized(true);
        } else {
          // Redirect to unauthorized page if user doesn't have required role
          router.push("/unauthorized");
        }
      } catch (error) {
        console.error("Error checking authorization:", error);
        router.push("/error");
      } finally {
        setLoading(false);
      }
    }

    checkAuth();
  }, [router, supabase]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
          <p className="text-gray-600 dark:text-gray-400">Loading...</p>
        </div>
      </div>
    );
  }

  if (!isAuthorized) {
    return null; // Router will handle redirect
  }

  return <ContributeContent />;
}
