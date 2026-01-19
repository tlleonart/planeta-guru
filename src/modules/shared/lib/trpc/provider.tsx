"use client";

import { QueryClientProvider } from "@tanstack/react-query";
import { httpBatchStreamLink, loggerLink } from "@trpc/react-query";
import { useState } from "react";
import SuperJSON from "superjson";
import { trpc } from "./client";
import { createQueryClient } from "./query-client";

/**
 * Singleton del QueryClient para el cliente.
 * Evita recrear en cada render.
 */
let clientQueryClientSingleton:
  | ReturnType<typeof createQueryClient>
  | undefined;

function getQueryClient() {
  if (typeof window === "undefined") {
    return createQueryClient();
  }

  clientQueryClientSingleton ??= createQueryClient();
  return clientQueryClientSingleton;
}

/**
 * Obtiene la URL base para las llamadas tRPC.
 */
function getBaseUrl(): string {
  if (typeof window !== "undefined") {
    return window.location.origin;
  }

  if (process.env.VERCEL_URL) {
    return `https://${process.env.VERCEL_URL}`;
  }

  return `http://localhost:${process.env.PORT ?? 3000}`;
}

interface TRPCProviderProps {
  children: React.ReactNode;
}

/**
 * Provider de tRPC para Client Components.
 * Envuelve la aplicación para habilitar el uso de hooks tRPC.
 *
 * @example
 * // En el layout principal
 * <TRPCProvider>
 *   {children}
 * </TRPCProvider>
 */
export function TRPCProvider({ children }: TRPCProviderProps) {
  const queryClient = getQueryClient();

  const [trpcClient] = useState(() =>
    trpc.createClient({
      links: [
        loggerLink({
          enabled: (op) =>
            process.env.NODE_ENV === "development" ||
            (op.direction === "down" && op.result instanceof Error),
        }),
        httpBatchStreamLink({
          transformer: SuperJSON,
          url: `${getBaseUrl()}/api/trpc`,
          headers: () => {
            const headers = new Headers();
            headers.set("x-trpc-source", "nextjs-react");
            return headers;
          },
        }),
      ],
    }),
  );

  return (
    <trpc.Provider client={trpcClient} queryClient={queryClient}>
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    </trpc.Provider>
  );
}
