// import { Database } from "@/app/lib/types/supabase";
// import { createMiddlewareClient } from "@supabase/auth-helpers-nextjs";
// import { NextResponse } from "next/server";
// import type { NextRequest } from "next/server";

// // Define roles using an enum for better type safety
// enum Role {
//   SUPER_ADMIN = "super_admin",
//   ADMIN = "admin",
//   EDITOR = "editor",
//   VIEWER = "viewer",
// }

// // Public routes that don't require authentication
// const publicRoutes: string[] = [
//   "/",
//   "/auth/(.*)", // All auth routes
//   "/dictionary", // Public dictionary access
//   "/numbers", // Public numbers access
//   "/about",
//   "/kifuliiru",
//   "/ibufuliiru",
//   "/abafuliiru",
//   "/api/public/(.*)",
// ];

// // Protected routes configuration
// const protectedRoutes = {
//   admin: ["/admin/(.*)", "/dashboard/(.*)", "/settings/(.*)", "/users/(.*)"],
//   editor: ["/contribute/(.*)", "/edit/(.*)", "/submissions/(.*)"],
//   viewer: ["/profile/(.*)", "/saved/(.*)", "/history/(.*)"],
// };

// // Helper function to check if URL matches any pattern
// const matchesPattern = (url: string, patterns: string[]): boolean => {
//   return patterns.some((pattern) => {
//     const regexPattern = pattern.replace(/\*/g, ".*");
//     const regex = new RegExp(`^${regexPattern}$`);
//     return regex.test(url);
//   });
// };

// // Helper function to check if user has required role
// const hasRequiredRole = (
//   userRole: Role | undefined,
//   requiredRole: Role
// ): boolean => {
//   if (!userRole) return false;

//   const roleHierarchy = {
//     [Role.SUPER_ADMIN]: 4,
//     [Role.ADMIN]: 3,
//     [Role.EDITOR]: 2,
//     [Role.VIEWER]: 1,
//   };

//   return roleHierarchy[userRole] >= roleHierarchy[requiredRole];
// };

// export async function middleware(request: NextRequest) {
//   try {
//     const supabase = createMiddlewareClient<Database>({
//       req: request,
//       res: NextResponse.next(),
//     });
//     const url = request.nextUrl.pathname;

//     // Allow public routes
//     if (matchesPattern(url, publicRoutes)) {
//       return NextResponse.next();
//     }

//     // Check session
//     const {
//       data: { session },
//       error,
//     } = await supabase.auth.getSession();

//     // Redirect to login if no session on protected routes
//     if (!session || error) {
//       const loginUrl = new URL("/auth/sign-in", request.url);
//       loginUrl.searchParams.set("redirect_url", url);
//       return NextResponse.redirect(loginUrl);
//     }

//     // Get user's role from profile
//     const { data: profile } = await supabase
//       .from("profiles")
//       .select("role, quiz_completed")
//       .eq("id", session.user.id)
//       .single();

//     const userRole = profile?.role as Role;

//     // Check admin routes
//     if (matchesPattern(url, protectedRoutes.admin)) {
//       if (!hasRequiredRole(userRole, Role.ADMIN)) {
//         return NextResponse.redirect(new URL("/unauthorized", request.url));
//       }
//     }

//     // Check editor routes
//     if (matchesPattern(url, protectedRoutes.editor)) {
//       if (!hasRequiredRole(userRole, Role.EDITOR)) {
//         return NextResponse.redirect(new URL("/unauthorized", request.url));
//       }

//       // Additional quiz check for contribute routes
//       if (url.startsWith("/contribute") && !profile?.quiz_completed) {
//         return NextResponse.redirect(new URL("/quiz", request.url));
//       }
//     }

//     // Check viewer routes
//     if (matchesPattern(url, protectedRoutes.viewer)) {
//       if (!hasRequiredRole(userRole, Role.VIEWER)) {
//         return NextResponse.redirect(new URL("/unauthorized", request.url));
//       }
//     }

//     // Add user info to request headers
//     const requestHeaders = new Headers(request.headers);
//     requestHeaders.set("x-user-id", session.user.id);
//     requestHeaders.set("x-user-role", userRole || "");

//     return NextResponse.next({
//       request: {
//         headers: requestHeaders,
//       },
//     });
//   } catch (error) {
//     console.error("Middleware error:", error);
//     return NextResponse.redirect(new URL("/error", request.url));
//   }
// }

// // Update the matcher configuration to exclude unnecessary paths
// export const config = {
//   matcher: [
//     /*
//      * Match all paths except:
//      * - api routes that start with /api/public
//      * - Next.js internal routes
//      * - Public assets
//      */
//     "/((?!api/public|_next/static|_next/image|favicon.ico|assets/).*)",
//   ],
// };

import { Database } from "@/app/lib/types/supabase";
import { createMiddlewareClient } from "@supabase/auth-helpers-nextjs";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const publicRoutes: string[] = [
  "/",
  "/auth/(.*)",
  "/dictionary",
  "/numbers",
  "/about",
  "/kifuliiru",
  "/ibufuliiru",
  "/abafuliiru",
  "/api/public/(.*)",
];

const matchesPattern = (url: string, patterns: string[]): boolean => {
  return patterns.some((pattern) => {
    const regexPattern = pattern.replace(/\*/g, ".*");
    const regex = new RegExp(`^${regexPattern}$`);
    return regex.test(url);
  });
};

export async function middleware(request: NextRequest) {
  try {
    const supabase = createMiddlewareClient<Database>({
      req: request,
      res: NextResponse.next(),
    });

    const url = request.nextUrl.pathname;

    if (matchesPattern(url, publicRoutes)) {
      return NextResponse.next();
    }

    const {
      data: { session },
      error,
    } = await supabase.auth.getSession();

    if (!session || error) {
      const loginUrl = new URL("/auth/sign-in", request.url);
      loginUrl.searchParams.set("redirect_url", url);
      return NextResponse.redirect(loginUrl);
    }

    const requestHeaders = new Headers(request.headers);
    requestHeaders.set("x-user-id", session.user.id);

    return NextResponse.next({
      request: {
        headers: requestHeaders,
      },
    });
  } catch (error) {
    console.error("Middleware error:", error);
    return NextResponse.redirect(new URL("/error", request.url));
  }
}

export const config = {
  matcher: ["/((?!api/public|_next/static|_next/image|favicon.ico|assets/).*)"],
};
