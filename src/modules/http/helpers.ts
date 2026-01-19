import { auth } from "@clerk/nextjs/server";
import { cookies } from "next/headers";
import { cache } from "react";
import type { RequestContext } from "./types";

/**
 * Obtiene el contexto de la request para llamadas a la API
 *
 * @example
 * // En cualquiero Server Component
 *
 * const context = await getRequestContext()
 * const users = await userService.getUsers({}, context)
 */
export const getRequestContext = cache(async (): Promise<RequestContext> => {
  const [cookieStore, authResult] = await Promise.all([cookies(), auth()]);

  const authToken = authResult.userId ? await authResult.getToken() : null;

  return {
    selectedCountry: cookieStore.get("selectedCountry")?.value || undefined,
    selectedLanguage: cookieStore.get("selectedLanguage")?.value || undefined,
    authToken: authToken || undefined,
    msisdn: cookieStore.get("msisdn")?.value || undefined,
  };
});

/**
 * Versión de getRequestContext que solo obtiene datos de cookies, sin auth.
 */
export const getPublicRequestContext = cache(
  async (): Promise<RequestContext> => {
    const cookiesStore = await cookies();

    return {
      selectedCountry: cookiesStore.get("selectedCountry")?.value || undefined,
      selectedLanguage:
        cookiesStore.get("selectedLanguage")?.value || undefined,
      msisdn: cookiesStore.get("msisdn")?.value || undefined,
    };
  },
);
