"use client";

import { createTRPCReact } from "@trpc/react-query";
import type { inferRouterInputs, inferRouterOutputs } from "@trpc/server";
import type { AppRouter } from "@/app/server/routers";

/**
 * Cliente tRPC para usar en Client Components.
 *
 * @example
 * const { data } = trpc.wallet.getWallet.useQuery();
 */
export const trpc = createTRPCReact<AppRouter>();

/**
 * Tipos de inferencia para inputs y outputs de los routers.
 * Útil para tipar props de componentes.
 *
 * @example
 * type WalletOutput = RouterOutputs['wallet']['getWallet'];
 */
export type RouterInputs = inferRouterInputs<AppRouter>;
export type RouterOutputs = inferRouterOutputs<AppRouter>;
