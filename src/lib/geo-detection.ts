import type { NextRequest } from "next/server";

/**
 * Supported country codes that map to available locales
 */
const SUPPORTED_COUNTRIES = new Set([
  "AR", // Argentina
  "MX", // Mexico
  "ZA", // South Africa
  "BO", // Bolivia
  "BR", // Brazil
  "CL", // Chile
  "CO", // Colombia
  "CR", // Costa Rica
  "CU", // Cuba
  "EC", // Ecuador
  "SV", // El Salvador
  "GT", // Guatemala
  "HT", // Haiti
  "HN", // Honduras
  "NI", // Nicaragua
  "PA", // Panama
  "PY", // Paraguay
  "PE", // Peru
  "DO", // Dominican Republic
  "UY", // Uruguay
  "VE", // Venezuela
]);

/**
 * Default country code when detection fails or country is not supported
 */
const DEFAULT_COUNTRY = "AR";

/**
 * Detects the user's country from request headers
 *
 * Priority:
 * 1. Vercel geo header (x-vercel-ip-country)
 * 2. Cloudflare geo header (CF-IPCountry)
 * 3. Accept-Language header (extract country from locale)
 * 4. Fallback to Argentina (AR)
 */
export function detectCountryFromRequest(request: NextRequest): string {
  // 1. Check Vercel's geo header
  const vercelCountry = request.headers.get("x-vercel-ip-country");
  if (vercelCountry && SUPPORTED_COUNTRIES.has(vercelCountry.toUpperCase())) {
    return vercelCountry.toUpperCase();
  }

  // 2. Check Cloudflare's geo header
  const cfCountry = request.headers.get("cf-ipcountry");
  if (cfCountry && SUPPORTED_COUNTRIES.has(cfCountry.toUpperCase())) {
    return cfCountry.toUpperCase();
  }

  // 3. Try to extract country from Accept-Language header
  const acceptLanguage = request.headers.get("accept-language");
  if (acceptLanguage) {
    // Parse Accept-Language to find country codes
    // Format examples: "es-AR,es;q=0.9,en;q=0.8" or "es-MX,es;q=0.9"
    const localeMatch = acceptLanguage.match(/[a-z]{2}-([A-Z]{2})/i);
    if (localeMatch) {
      const country = localeMatch[1].toUpperCase();
      if (SUPPORTED_COUNTRIES.has(country)) {
        return country;
      }
    }
  }

  // 4. Fallback to default country (Argentina)
  return DEFAULT_COUNTRY;
}

/**
 * Detects the user's preferred language from request headers
 *
 * Priority:
 * 1. Accept-Language header language preference
 * 2. Fallback to Spanish (es)
 */
export function detectLanguageFromRequest(request: NextRequest): string {
  const acceptLanguage = request.headers.get("accept-language");

  if (acceptLanguage) {
    // Check if English is preferred
    const languages = acceptLanguage.toLowerCase();
    if (languages.startsWith("en") || languages.includes(",en")) {
      return "en";
    }
  }

  // Default to Spanish
  return "es";
}

/**
 * Builds a locale string from detected country and language
 */
export function buildLocaleFromRequest(request: NextRequest): string {
  const country = detectCountryFromRequest(request);
  const language = detectLanguageFromRequest(request);

  return `${country.toLowerCase()}-${language.toLowerCase()}`;
}
