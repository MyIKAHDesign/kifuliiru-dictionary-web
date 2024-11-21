import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

// Define roles and protected routes (fix typo in SUPER_ADMIN)
const ROLES = {
  SUPER_ADMIN: "super_admin",
  ADMIN: "admin",
  EDITOR: "editor",
  VIEWER: "viewer",
} as const;

// Public routes that don't require authentication
const isPublicRoute = createRouteMatcher([
  "/",
  "/home(.*)",
  "/about(.*)",
  "/kifuliiru(.*)",
  "/ibufuliiru(.*)",
  "/abafuliiru(.*)",
  "/api/webhook/clerk(.*)",
  "/api/webhook/stripe(.*)",
  "/api/uploadthing(.*)",
]);

// Admin routes that require specific roles (fix space before (.*))
const isAdminRoute = createRouteMatcher([
  "/admin(.*)",
  "/dashboard(.*)",
  "/settings(.*)",
]);

// Routes that require editor role or higher
const isEditorRoute = createRouteMatcher(["/edit(.*)", "/contribute(.*)"]);

export default clerkMiddleware(async (auth, req) => {
  // Allow public routes
  if (isPublicRoute(req)) {
    return NextResponse.next();
  }

  // Protect all non-public routes
  auth.protect(); // Remove unnecessary await

  // Get user role from metadata (handle potential undefined type)
  const role: keyof typeof ROLES | undefined =
    auth.sessionClaims?.metadata?.role;

  // Handle admin routes
  if (isAdminRoute(req)) {
    if (!role || !["super_admin", "admin"].includes(role)) {
      return NextResponse.redirect(new URL("/unauthorized", req.url));
    }
  }

  // Handle editor routes
  if (isEditorRoute(req)) {
    if (!role || !["super_admin", "admin", "editor"].includes(role)) {
      return NextResponse.redirect(new URL("/unauthorized", req.url));
    }
  }

  // All other authenticated routes
  return NextResponse.next();
});

export const config = {
  matcher: [
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    "/(api|trpc)(.*)",
  ],
};
