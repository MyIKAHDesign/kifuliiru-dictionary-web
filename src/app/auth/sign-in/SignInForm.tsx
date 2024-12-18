"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { Mail, Loader2, AlertCircle, ArrowRight } from "lucide-react";

import { Button } from "@/app/components/ui/button";
import { Input } from "@/app/components/ui/input";
import { Alert, AlertDescription } from "@/app/components/ui/alert";
import { useToast } from "@/app/components/ui/use-toast";

// Define UserRole as a const array for better type inference
const USER_ROLES = ["super_admin", "admin", "editor", "viewer"] as const;
type UserRole = (typeof USER_ROLES)[number];

// Define editor-level roles
const EDITOR_ROLES: UserRole[] = ["editor", "admin", "super_admin"];

interface AuthError extends Error {
  status?: number;
  message: string;
}

export function SignInForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { toast } = useToast();
  const supabase = createClientComponentClient();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const isEditorRole = (role: UserRole): boolean => {
    return EDITOR_ROLES.includes(role);
  };

  // Handle role-based navigation
  const handleRoleNavigation = async (userId: string): Promise<string> => {
    try {
      const { data: profile, error: profileError } = await supabase
        .from("profiles")
        .select("role, quiz_completed")
        .eq("id", userId)
        .single();

      if (profileError) {
        console.error("Error fetching user profile:", profileError);
        throw profileError;
      }

      // Ensure role is valid
      const userRole = profile?.role as UserRole;
      if (!USER_ROLES.includes(userRole)) {
        console.error("Invalid user role:", userRole);
        throw new Error("Invalid user role");
      }

      const quizCompleted = profile?.quiz_completed ?? false;

      // Get the redirect URL from search params
      const redirectUrl = searchParams.get("redirect");

      // If there's a specific redirect URL and it's not the contribute page, use it
      if (redirectUrl && !redirectUrl.includes("/contribute")) {
        return redirectUrl;
      }

      // Handle contribute page redirect with role checks
      if (redirectUrl?.includes("/contribute")) {
        if (!isEditorRole(userRole)) {
          return "/unauthorized";
        }
        if (userRole === "editor" && !quizCompleted) {
          return "/quiz";
        }
        return "/contribute";
      }

      // Default role-based navigation
      switch (userRole) {
        case "super_admin":
          return "/admin";
        case "admin":
          return "/dashboard";
        case "editor":
          return quizCompleted ? "/contribute" : "/quiz";
        default:
          return "/";
      }
    } catch (error) {
      console.error("Error in role navigation:", error);
      return "/";
    }
  };

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const { data: signInData, error: signInError } =
        await supabase.auth.signInWithPassword({
          email,
          password,
        });

      if (signInError) {
        console.error("Sign in error:", signInError);
        throw signInError;
      }

      if (!signInData.user) {
        throw new Error("No user data received");
      }

      // Get the appropriate navigation path based on user role
      const navigationPath = await handleRoleNavigation(signInData.user.id);

      toast({
        title: "Welcome back!",
        description: "You have successfully signed in.",
        duration: 3000,
      });

      router.push(navigationPath);
      router.refresh();
    } catch (error) {
      console.error("Authentication error:", error);
      const authError = error as AuthError;

      // Handle specific error cases
      if (authError.status === 400) {
        setError("Invalid email or password");
      } else if (authError.status === 429) {
        setError("Too many attempts. Please try again later");
      } else {
        setError(authError.message || "An error occurred during sign in");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleSocialLogin = async (provider: "google" | "facebook") => {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider,
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
          queryParams: {
            access_type: "offline",
            prompt: "consent",
          },
        },
      });

      if (error) {
        console.error(`${provider} login error:`, error);
        throw error;
      }
    } catch (error) {
      console.error(`Social login error (${provider}):`, error);
      const authError = error as AuthError;
      setError(authError.message || `Failed to sign in with ${provider}`);
    }
  };

  return (
    <div className="space-y-6">
      {/* Social Login Buttons */}
      <div className="grid gap-4">
        <Button
          variant="outline"
          onClick={() => handleSocialLogin("google")}
          className="relative h-12 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-750 transition-all duration-200"
          disabled={loading}
        >
          <div className="absolute left-4 top-1/2 -translate-y-1/2">
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="#FBBC05"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
              />
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
              />
            </svg>
          </div>
          <span className="flex items-center gap-2">
            Continue with Google
            <ArrowRight className="h-4 w-4 opacity-70" />
          </span>
        </Button>

        <Button
          variant="outline"
          onClick={() => handleSocialLogin("facebook")}
          className="relative h-12 bg-[#1877F2] text-white hover:bg-[#1864F2] transition-all duration-200"
          disabled={loading}
        >
          <div className="absolute left-4 top-1/2 -translate-y-1/2">
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M9.945 22v-8.834H7V9.485h2.945V6.54c0-3.043 1.926-4.54 4.64-4.54 1.3 0 2.418.097 2.744.14v3.18h-1.883c-1.476 0-1.82.703-1.82 1.732v2.433h3.68l-.736 3.68h-2.944L13.685 22"></path>
            </svg>
          </div>
          <span className="flex items-center gap-2">
            Continue with Facebook
            <ArrowRight className="h-4 w-4 opacity-70" />
          </span>
        </Button>
      </div>

      {/* Divider */}
      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-gray-200 dark:border-gray-700" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-white dark:bg-gray-900 px-2 text-gray-500 dark:text-gray-400">
            Or continue with email
          </span>
        </div>
      </div>

      {/* Error Alert */}
      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {/* Email/Password Form */}
      <form onSubmit={handleSignIn} className="space-y-4">
        <div className="space-y-2">
          <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
            Email
          </label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 dark:text-gray-400" />
            <Input
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="pl-10 h-11"
              required
            />
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
              Password
            </label>
            <a
              href="/auth/reset-password"
              className="text-sm font-medium text-orange-600 hover:text-orange-700 dark:text-orange-400 dark:hover:text-orange-300 transition-colors"
            >
              Forgot password?
            </a>
          </div>
          <Input
            type="password"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="h-11"
            required
          />
        </div>

        <Button
          type="submit"
          className="w-full h-11 bg-gradient-to-r from-orange-600 to-orange-500 hover:from-orange-700 hover:to-orange-600 text-white transition-all duration-200"
          disabled={loading}
        >
          {loading ? (
            <span className="flex items-center gap-2">
              <Loader2 className="h-4 w-4 animate-spin" />
              Signing in...
            </span>
          ) : (
            <span className="flex items-center gap-2">
              Sign in
              <ArrowRight className="h-4 w-4" />
            </span>
          )}
        </Button>

        <p className="text-center text-sm text-gray-500 dark:text-gray-400">
          Don&apos;t have an account?{" "}
          <a
            href="/auth/sign-up"
            className="font-medium text-orange-600 hover:text-orange-700 dark:text-orange-400 dark:hover:text-orange-300"
          >
            Sign up
          </a>
        </p>
      </form>
    </div>
  );
}
