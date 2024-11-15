import { authMiddleware } from "@clerk/nextjs";

export default authMiddleware({
  publicRoutes: [
    "/",
    "/home",
    "/browse",
    "/word",
    "/about",
    "/search",
    "/kifuliiru",
    "/ibufuliiru",
    "/abafuliiru",
    "/word/(.*)",
  ],
});

export const config = {
  matcher: ["/((?!.+\\.[\\w]+$|_next).*)", "/", "/(api|trpc)(.*)"],
};
