import { auth } from "@clerk/nextjs/server";
import { cookies } from "next/headers";
import { cache } from "react";
import type { RequestContext } from "@/modules/http";

export interface TRPCContext {
  headers: Headers;
  requestContext: RequestContext;
  userId: string | null;
  clerkAuth: Awaited<ReturnType<typeof auth>>;
}

const defaultRequestContext: RequestContext = {
  selectedCountry: "AR",
  selectedLanguage: "es",
  authToken: undefined,
  msisdn: undefined,
};

const getCacheAuthData = cache(async () => {
  const [cookieStore, clerkAuth] = await Promise.all([cookies(), auth()]);

  const authToken = clerkAuth.userId ? await clerkAuth.getToken() : null;

  return {
    cookieStore,
    authToken,
    clerkAuth,
  };
});

export async function createTRPCContext(opts: {
  headers: Headers;
}): Promise<TRPCContext> {
  const { cookieStore, authToken, clerkAuth } = await getCacheAuthData();

  const requestContext: RequestContext = {
    selectedCountry:
      cookieStore.get("selectedCountry")?.value ??
      defaultRequestContext.selectedCountry,
    selectedLanguage:
      cookieStore.get("selectedLanguage")?.value ??
      defaultRequestContext.selectedLanguage,
    authToken: authToken || defaultRequestContext.authToken,
    msisdn: cookieStore.get("msisdn")?.value ?? defaultRequestContext.msisdn,
  };

  return {
    headers: opts.headers,
    requestContext,
    userId: clerkAuth.userId,
    clerkAuth,
  };
}

export type Context = TRPCContext;
