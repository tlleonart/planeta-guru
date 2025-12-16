import {
  defaultShouldDehydrateQuery,
  QueryClient,
} from "@tanstack/react-query";
import SuperJSON from "superjson";

/**
 * Crea una instancia de QueryClient con configuración optimizada.
 * Incluye serialización con SuperJSON para hidratación RSC.
 */
export function createQueryClient(): QueryClient {
  return new QueryClient({
    defaultOptions: {
      queries: {
        // Datos considerados frescos por 30 segundos
        staleTime: 30 * 1000,
        // Reintentar solo en errores de red, no en 4xx
        retry: (failureCount, error) => {
          if (error instanceof Error && "data" in error) {
            const trpcError = error as { data?: { httpStatus?: number } };
            const status = trpcError.data?.httpStatus;
            if (status && status >= 400 && status < 500) {
              return false;
            }
          }
          return failureCount < 3;
        },
      },
      mutations: {
        retry: false,
      },
      dehydrate: {
        serializeData: SuperJSON.serialize,
        shouldDehydrateQuery: (query) =>
          defaultShouldDehydrateQuery(query) ||
          query.state.status === "pending",
      },
      hydrate: {
        deserializeData: SuperJSON.deserialize,
      },
    },
  });
}
