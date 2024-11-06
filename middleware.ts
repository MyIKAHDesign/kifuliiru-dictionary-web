// middleware.ts
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Define protected routes that require authentication
const protectedRoutes = [
  "/dashboard",
  "/contribute",
  "/admin",
  "/profile",
  "/edit",
];

// Define public routes that should always be accessible
const publicRoutes = [
  "/",
  "/browse",
  "/word",
  "/about",
  "/auth/login",
  "/auth/register",
  "/search",
  "/kifuliiru",
  "/ibufuliiru",
  "/abafuliiru",
];

export function middleware(request: NextRequest) {
  // Get the pathname of the request
  const { pathname } = request.nextUrl;

  // Get the user's authentication token from cookies
  const session = request.cookies.get("session")?.value;

  // Check if the current path starts with any protected route prefix
  const isProtectedRoute = protectedRoutes.some((route) =>
    pathname.startsWith(route)
  );

  // Check if the current path starts with any public route prefix
  const isPublicRoute =
    publicRoutes.some((route) => pathname.startsWith(route)) ||
    pathname.startsWith("/auth/");

  // Special handling for word entries to make them public
  const isWordEntry = pathname.startsWith("/word/");

  // Redirect logic
  if (isProtectedRoute && !session) {
    // Store the original URL to redirect back after login
    const url = new URL("/auth/login", request.url);
    url.searchParams.set("redirect", pathname);
    return NextResponse.redirect(url);
  }

  if (session && pathname.startsWith("/auth/")) {
    // Redirect to dashboard if trying to access auth routes while logged in
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  // Allow access to public routes and word entries
  if (isPublicRoute || isWordEntry) {
    return NextResponse.next();
  }

  // For any other routes, check for authentication
  if (!session && !isPublicRoute) {
    const url = new URL("/auth/login", request.url);
    url.searchParams.set("redirect", pathname);
    return NextResponse.redirect(url);
  }

  // Continue with the request if none of the above conditions are met
  return NextResponse.next();
}

// Configure which routes to run middleware on
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder files
     */
    "/((?!api|_next/static|_next/image|favicon.ico|public).*)",
  ],
};
