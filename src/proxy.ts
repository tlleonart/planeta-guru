import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import createMiddleware from "next-intl/middleware";
import { routing } from "./i18n/routing";

const handleI18nRouting = createMiddleware(routing);

const isProtectedRoute = createRouteMatcher(["/:locale/profile(.*)"]);

const apiRoutes = [/^\/api\//, /^\/trpc\//];

export default clerkMiddleware(async (auth, req) => {
  for (const pattern of apiRoutes) {
    if (pattern.test(req.nextUrl.pathname)) {
      if (isProtectedRoute(req)) await auth.protect();
      return;
    }
  }

  if (isProtectedRoute(req)) await auth.protect();

  return handleI18nRouting(req);
});

export const config = {
  matcher: [
    "/((?!_next|_vercel|.*\\..*).*)",  
    "/api/trpc/:path*",
  ],
};