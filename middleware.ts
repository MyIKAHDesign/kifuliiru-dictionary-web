import { Database } from "@/app/lib/supabase";
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
