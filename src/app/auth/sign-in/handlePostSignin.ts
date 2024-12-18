// app/auth/signin/handlePostSignin.ts
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";

export async function handlePostSignin(
  router: AppRouterInstance,
  redirectUrl?: string | null
) {
  const supabase = createClientComponentClient();

  try {
    // Get the current session
    const {
      data: { session },
    } = await supabase.auth.getSession();
    if (!session?.user?.id) {
      throw new Error("No session found after signin");
    }

    // Get the user's profile and role
    const { data: profile, error: profileError } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", session.user.id)
      .single();

    if (profileError) {
      throw profileError;
    }

    // Handle navigation based on context and role
    if (redirectUrl?.includes("/contribute")) {
      // For contribute page redirects, check role
      if (profile?.role === "super_admin" || profile?.role === "editor") {
        router.push("/contribute");
      } else {
        // If not authorized, send to quiz
        router.push("/quiz");
      }
    } else if (profile?.role === "super_admin") {
      // Super admins go to admin dashboard by default
      router.push("/admin");
    } else if (profile?.role === "editor") {
      // Editors go to contributor dashboard by default
      router.push("/contribute");
    } else {
      // Default navigation for other roles
      router.push("/");
    }
  } catch (error) {
    console.error("Error during post-signin navigation:", error);
    // Fallback to home page if something goes wrong
    router.push("/");
  }
}
