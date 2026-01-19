import "server-only";

import { createHydrationHelpers } from "@trpc/react-query/rsc";
import { headers } from "next/headers";
import { cache } from "react";
import { createQueryClient } from "@/modules/shared/lib/trpc/query-client";
import { type AppRouter, createCaller } from "./routers";
import { createTRPCContext } from "./trpc/context";

/**
 * Crea el contexto de forma cacheada para Server Components.
 * Se ejecuta una sola vez por request.
 */
const createContext = cache(async () => {
  const heads = new Headers(await headers());
  heads.set("x-trpc-source", "rsc");

  return createTRPCContext({ headers: heads });
});

/**
 * QueryClient cacheado para el request actual.
 */
const getQueryClient = cache(createQueryClient);

/**
 * Caller para usar tRPC directamente en Server Components.
 */
const caller = createCaller(createContext);

/**
 * Helpers para hidratación de datos en RSC.
 *
 * @example
 * // En un Server Component
 * const data = await api.wallet.getWallet();
 *
 * // Para hidratar en cliente
 * <HydrateClient>
 *   <ClientComponent />
 * </HydrateClient>
 */
export const { trpc: api, HydrateClient } = createHydrationHelpers<AppRouter>(
  caller,
  getQueryClient,
);
