import { Database } from "@/app/lib/types/supabase";
import { createMiddlewareClient } from "@supabase/auth-helpers-nextjs";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Define roles using an enum for better type safety
enum Role {
  SUPER_ADMIN = "super_admin",
  ADMIN = "admin",
  EDITOR = "editor",
  VIEWER = "viewer",
}

// Public routes that don't require authentication
const publicRoutes: string[] = [
  "/",
  "/login(.*)",
  "/register(.*)",
  "/home(.*)",
  "/about(.*)",
  "/kifuliiru(.*)",
  "/ibufuliiru(.*)",
  "/abafuliiru(.*)",
  "/api/public(.*)",
  "/auth/callback(.*)", // Add auth callback to public routes
  "/dictionary(.*)", // Make dictionary accessible without auth
];

// Admin routes that require admin or super_admin roles
const adminRoutes: string[] = ["/admin(.*)", "/dashboard(.*)", "/settings(.*)"];

// Routes that require editor role or higher
const editorRoutes: string[] = ["/edit(.*)", "/contribute(.*)"];

// Helper function to check if URL matches any pattern
const matchesPattern = (url: string, patterns: string[]): boolean => {
  return patterns.some((pattern) => {
    const regexPattern = pattern.replace(/\*/g, ".*");
    const regex = new RegExp(`^${regexPattern}$`);
    return regex.test(url);
  });
};

// Helper function to check if a role has sufficient permissions
const hasRequiredRole = (
  userRole: Role | undefined,
  requiredRoles: Role[]
): boolean => {
  if (!userRole) return false;

  const roleHierarchy = {
    [Role.SUPER_ADMIN]: 4,
    [Role.ADMIN]: 3,
    [Role.EDITOR]: 2,
    [Role.VIEWER]: 1,
  };

  const userRoleLevel = roleHierarchy[userRole];
  const requiredRoleLevel = Math.min(
    ...requiredRoles.map((role) => roleHierarchy[role])
  );

  return userRoleLevel >= requiredRoleLevel;
};

export async function middleware(request: NextRequest) {
  try {
    // Create a response to modify
    const response = NextResponse.next();

    // Create a Supabase client configured to use cookies
    const supabase = createMiddlewareClient<Database>({
      req: request,
      res: response,
    });

    // Get the current path
    const url = request.nextUrl.pathname;

    // Handle CORS preflight requests
    if (request.method === "OPTIONS") {
      return NextResponse.json({}, { status: 200 });
    }

    // Handle auth callback route
    if (url.includes("/auth/callback")) {
      const requestUrl = new URL(request.url);
      const code = requestUrl.searchParams.get("code");

      if (code) {
        // Exchange the code for a session
        await supabase.auth.exchangeCodeForSession(code);
        // Redirect to dictionary page after successful sign in
        return NextResponse.redirect(new URL("/dictionary", requestUrl.origin));
      }
    }

    // Allow public routes
    if (matchesPattern(url, publicRoutes)) {
      return response;
    }

    // Refresh session if it exists
    const {
      data: { session },
      error,
    } = await supabase.auth.getSession();

    // Handle no session for protected routes
    if ((!session || error) && !matchesPattern(url, publicRoutes)) {
      const loginUrl = new URL("/login", request.url);
      loginUrl.searchParams.set("redirect_url", url);
      return NextResponse.redirect(loginUrl);
    }

    if (session?.user) {
      // Get user's role and quiz completion status from Supabase profile
      const { data: profile, error: profileError } = await supabase
        .from("profiles")
        .select("role, quiz_completed")
        .eq("id", session.user.id)
        .single();

      if (profileError) {
        console.error("Error fetching user profile:", profileError);
        return NextResponse.redirect(new URL("/error", request.url));
      }

      const userRole = profile?.role as Role | undefined;
      const quizCompleted = profile?.quiz_completed as boolean;

      // Handle admin routes
      if (matchesPattern(url, adminRoutes)) {
        if (!hasRequiredRole(userRole, [Role.ADMIN, Role.SUPER_ADMIN])) {
          return NextResponse.redirect(new URL("/unauthorized", request.url));
        }
      }

      // Handle editor routes
      if (matchesPattern(url, editorRoutes)) {
        if (
          !hasRequiredRole(userRole, [
            Role.EDITOR,
            Role.ADMIN,
            Role.SUPER_ADMIN,
          ])
        ) {
          return NextResponse.redirect(new URL("/unauthorized", request.url));
        }

        // Additional check for contribute route: verify quiz completion
        if (url.startsWith("/contribute") && !quizCompleted) {
          return NextResponse.redirect(new URL("/quiz", request.url));
        }
      }

      // Add user information to request headers
      const requestHeaders = new Headers(request.headers);
      requestHeaders.set("x-user-id", session.user.id);
      requestHeaders.set("x-user-email", session.user.email || "");

      // Add authenticated user's role to headers if available
      if (userRole) {
        requestHeaders.set("x-user-role", userRole);
      }

      // Create a new response with the modified headers
      return NextResponse.next({
        request: {
          headers: requestHeaders,
        },
      });
    }

    return response;
  } catch (e) {
    // Handle any errors that occur during middleware execution
    console.error("Middleware error:", e);
    return NextResponse.redirect(new URL("/error", request.url));
  }
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public files (public folder)
     */
    "/((?!_next/static|_next/image|favicon.ico|public/|assets/).*)",
  ],
};
