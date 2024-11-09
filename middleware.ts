import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const protectedRoutes = [
  "/dashboard",
  "/contribute",
  "/admin",
  "/profile",
  "/edit",
];
const publicRoutes = [
  "/",
  "/home",
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
  const { pathname } = request.nextUrl;
  const session = request.cookies.get("session")?.value;
  const isProtectedRoute = protectedRoutes.some((route) =>
    pathname.startsWith(route)
  );
  const isPublicRoute =
    publicRoutes.some((route) => pathname.startsWith(route)) ||
    pathname.startsWith("/auth/");
  const isWordEntry = pathname.startsWith("/word/");

  if (isProtectedRoute && !session) {
    const url = new URL("/auth/login", request.url);
    url.searchParams.set("redirect", pathname);
    return NextResponse.redirect(url);
  }

  if (session && pathname.startsWith("/auth/")) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  if (isPublicRoute || isWordEntry) {
    return NextResponse.next();
  }

  if (!session && !isPublicRoute) {
    const url = new URL("/auth/login", request.url);
    url.searchParams.set("redirect", pathname);
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico|public).*)"],
};
