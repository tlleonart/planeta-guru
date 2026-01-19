import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import createMiddleware from "next-intl/middleware";
import { routing } from "./i18n/routing";
import {
  detectCountryFromRequest,
  detectLanguageFromRequest,
} from "./lib/geo-detection";

const handleI18nRouting = createMiddleware(routing);

const isProtectedRoute = createRouteMatcher([
  "/:locale/profile(.*)",
  "/:locale/account(.*)",
]);

const apiRoutes = [/^\/api\//, /^\/trpc\//];

export default clerkMiddleware(async (auth, req) => {
  const { pathname } = req.nextUrl;

  // Handle API routes
  for (const pattern of apiRoutes) {
    if (pattern.test(pathname)) {
      if (isProtectedRoute(req)) await auth.protect();
      return;
    }
  }

  if (isProtectedRoute(req)) await auth.protect();

  // Handle i18n routing
  const response = handleI18nRouting(req) || NextResponse.next();

  // Extract locale from pathname to set cookies
  // Format: /{country}-{language}/... (e.g., /mx-es/categories, /ar-en/products)
  const localeMatch = pathname.match(/^\/([a-z]{2})-([a-z]{2})(\/|$)/i);

  if (localeMatch) {
    const country = localeMatch[1].toUpperCase(); // AR, MX, etc.
    const language = localeMatch[2].toLowerCase(); // es, en

    // Set cookies (30 days expiration)
    const expires = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);

    // Set cookies with the names expected by the app
    response.cookies.set("selectedCountry", country, {
      expires,
      path: "/",
      sameSite: "lax",
    });

    response.cookies.set("selectedLanguage", language, {
      expires,
      path: "/",
      sameSite: "lax",
    });
  } else {
    // Default values if no locale in URL - use IP-based detection
    const existingCountry = req.cookies.get("selectedCountry");
    const existingLanguage = req.cookies.get("selectedLanguage");

    if (!existingCountry || !existingLanguage) {
      const expires = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);

      if (!existingCountry) {
        // Detect country from IP/headers, fallback to AR
        const detectedCountry = detectCountryFromRequest(req);
        response.cookies.set("selectedCountry", detectedCountry, {
          expires,
          path: "/",
          sameSite: "lax",
        });
      }

      if (!existingLanguage) {
        // Detect language from Accept-Language header, fallback to es
        const detectedLanguage = detectLanguageFromRequest(req);
        response.cookies.set("selectedLanguage", detectedLanguage, {
          expires,
          path: "/",
          sameSite: "lax",
        });
      }
    }
  }

  return response;
});

export const config = {
  matcher: ["/((?!_next|_vercel|.*\\..*).*)", "/api/trpc/:path*"],
};
