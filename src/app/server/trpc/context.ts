import { RequestContext } from "@/modules/http";
import { auth } from "@clerk/nextjs/server";
import { cookies } from "next/headers";
import { cache } from "react";

export interface TRPCContext {
  headers: Headers;
  requestContext: RequestContext;
  userId: string | null;
  clerkAuth: Awaited<ReturnType<typeof auth>>;
}

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
    selectedCountry: cookieStore.get("selectedCountry")?.value,
    selectedLanguage: cookieStore.get("selectedLanguage")?.value,
    authToken: authToken || undefined,
    msisdn: cookieStore.get("msisdn")?.value,
  };

  return {
    headers: opts.headers,
    requestContext,
    userId: clerkAuth.userId,
    clerkAuth,
  };
}

export type Context = TRPCContext;
