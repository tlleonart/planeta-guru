# Sistema tRPC

## Vision General

Planeta Guru utiliza tRPC para crear APIs type-safe entre el cliente y el servidor. tRPC permite:

- Type-safety end-to-end sin generacion de codigo
- Validacion automatica con Zod
- Integracion con TanStack Query
- Inyeccion automatica de contexto

## Arquitectura

```
Cliente (Browser)
       |
       v
  trpc-client.ts  ────────────────────────┐
       |                                   |
       v                                   |
TanStack Query                             |
       |                                   |
       v                                   |
   /api/trpc/[trpc]  <────────────────────┘
       |
       v
  tRPC Router
       |
       v
   Context (auth, requestContext)
       |
       v
    Service
       |
       v
  HttpClient → Backend API
```

## Configuracion

### Definicion de tRPC

```typescript
// src/app/server/trpc/trpc.ts
import { TRPCError, initTRPC } from "@trpc/server";
import superjson from "superjson";
import { ZodError } from "zod";
import type { TRPCContext } from "./context";

const t = initTRPC.context<TRPCContext>().create({
  transformer: superjson,
  errorFormatter({ shape, error }) {
    return {
      ...shape,
      data: {
        ...shape.data,
        zodError:
          error.cause instanceof ZodError ? error.cause.flatten() : null,
      },
    };
  },
});

export const createTRPCRouter = t.router;
export const publicProcedure = t.procedure;

// Procedure protegido que requiere autenticacion
export const protectedProcedure = t.procedure.use(({ ctx, next }) => {
  if (!ctx.userId) {
    throw new TRPCError({ code: "UNAUTHORIZED" });
  }
  return next({
    ctx: {
      ...ctx,
      userId: ctx.userId,
    },
  });
});
```

### Contexto tRPC

```typescript
// src/app/server/trpc/context.ts
import { auth } from "@clerk/nextjs/server";
import { getRequestContext } from "@/modules/http/helpers";

export interface TRPCContext {
  userId: string | null;
  auth: ReturnType<typeof auth>;
  requestContext: RequestContext;
}

export const createTRPCContext = async (): Promise<TRPCContext> => {
  const { userId, getToken } = await auth();
  const requestContext = await getRequestContext();

  return {
    userId,
    auth: { userId, getToken },
    requestContext,
  };
};
```

## Routers

### Estructura de Router

```typescript
// src/app/server/routers/product-router.ts
import { z } from "zod";
import { createTRPCRouter, publicProcedure, protectedProcedure } from "../trpc/trpc";
import { productService } from "@/modules/shared/services/product-service";

export const productRouter = createTRPCRouter({
  // Query publica
  getBySlug: publicProcedure
    .input(z.object({
      slug: z.string(),
    }))
    .query(async ({ input, ctx }) => {
      return productService.getBySlug(input.slug, ctx.requestContext);
    }),

  // Query con paginacion
  list: publicProcedure
    .input(z.object({
      page: z.number().default(1),
      limit: z.number().default(10),
      categoryId: z.number().optional(),
      search: z.string().optional(),
    }))
    .query(async ({ input, ctx }) => {
      return productService.list(input, ctx.requestContext);
    }),

  // Mutation protegida
  addToFavorites: protectedProcedure
    .input(z.object({
      productId: z.number(),
    }))
    .mutation(async ({ input, ctx }) => {
      return favoritesService.add(
        ctx.userId,
        input.productId,
        ctx.requestContext
      );
    }),
});
```

### Registro de Routers

```typescript
// src/app/server/routers/index.ts
import { createTRPCRouter } from "../trpc/trpc";
import { productRouter } from "./product-router";
import { categoriesRouter } from "./categories-router";
import { walletRouter } from "./wallet-router";
import { favoritesRouter } from "./favorites-router";
import { packsRouter } from "./packs-router";
import { legalsRouter } from "./legals-router";

export const appRouter = createTRPCRouter({
  product: productRouter,
  categories: categoriesRouter,
  wallet: walletRouter,
  favorites: favoritesRouter,
  packs: packsRouter,
  legals: legalsRouter,
});

export type AppRouter = typeof appRouter;
```

## Uso en Server Components

```typescript
// src/modules/products/product-page.tsx
import { api } from "@/app/server/server";

export const ProductPage: FC<Props> = async ({ slug }) => {
  // Llamada directa al router (RSC)
  const product = await api.product.getBySlug({ slug });

  return (
    <div>
      <h1>{product.name}</h1>
      <p>{product.description}</p>
    </div>
  );
};
```

### Server Caller

```typescript
// src/app/server/server.ts
import "server-only";
import { cache } from "react";
import { createTRPCContext } from "./trpc/context";
import { appRouter } from "./routers";
import { createCallerFactory } from "@trpc/server";

const createCaller = createCallerFactory(appRouter);

export const api = cache(async () => {
  const ctx = await createTRPCContext();
  return createCaller(ctx);
})();
```

## Uso en Client Components

### Configuracion del Cliente

```typescript
// src/modules/http/trpc-client.ts
"use client";

import { createTRPCReact } from "@trpc/react-query";
import type { AppRouter } from "@/app/server/routers";

export const trpc = createTRPCReact<AppRouter>();
```

### Provider

```typescript
// src/app/[locale]/layout.tsx
import { TRPCProvider } from "./providers";

export default function Layout({ children }) {
  return (
    <html>
      <body>
        <TRPCProvider>
          {children}
        </TRPCProvider>
      </body>
    </html>
  );
}
```

### Queries

```typescript
"use client";

import { trpc } from "@/modules/http/trpc-client";

export const ProductList: FC = () => {
  const { data, isLoading, error } = trpc.product.list.useQuery({
    page: 1,
    limit: 10,
  });

  if (isLoading) return <Loading />;
  if (error) return <Error message={error.message} />;

  return (
    <div>
      {data.products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
};
```

### Mutations

```typescript
"use client";

import { trpc } from "@/modules/http/trpc-client";

export const FavoriteButton: FC<Props> = ({ productId }) => {
  const utils = trpc.useUtils();

  const addFavorite = trpc.favorites.add.useMutation({
    onSuccess: () => {
      // Invalidar cache de favoritos
      utils.favorites.list.invalidate();
    },
  });

  return (
    <Button
      onClick={() => addFavorite.mutate({ productId })}
      disabled={addFavorite.isPending}
    >
      {addFavorite.isPending ? "..." : "Agregar"}
    </Button>
  );
};
```

### Prefetching

```typescript
"use client";

import { trpc } from "@/modules/http/trpc-client";

export const ProductLink: FC<Props> = ({ slug }) => {
  const utils = trpc.useUtils();

  const handleHover = () => {
    // Prefetch al hacer hover
    utils.product.getBySlug.prefetch({ slug });
  };

  return (
    <Link href={`/products/${slug}`} onMouseEnter={handleHover}>
      Ver producto
    </Link>
  );
};
```

## Validacion con Zod

### Schemas de Input

```typescript
import { z } from "zod";

// Schema para crear producto
const createProductSchema = z.object({
  name: z.string().min(1, "Name is required"),
  price: z.number().positive("Price must be positive"),
  categoryId: z.number().int(),
  description: z.string().optional(),
});

// Schema para filtros de busqueda
const productFiltersSchema = z.object({
  page: z.number().int().positive().default(1),
  limit: z.number().int().min(1).max(100).default(10),
  categoryId: z.number().optional(),
  minPrice: z.number().optional(),
  maxPrice: z.number().optional(),
  search: z.string().optional(),
  sortBy: z.enum(["name", "price", "date"]).optional(),
  sortOrder: z.enum(["asc", "desc"]).optional(),
});
```

### Uso en Procedures

```typescript
export const productRouter = createTRPCRouter({
  create: protectedProcedure
    .input(createProductSchema)
    .mutation(async ({ input, ctx }) => {
      // input esta validado y tipado
      return productService.create(input, ctx.requestContext);
    }),

  list: publicProcedure
    .input(productFiltersSchema)
    .query(async ({ input, ctx }) => {
      // input tiene defaults aplicados
      return productService.list(input, ctx.requestContext);
    }),
});
```

## Manejo de Errores

### Errores tRPC

```typescript
import { TRPCError } from "@trpc/server";

export const productRouter = createTRPCRouter({
  getBySlug: publicProcedure
    .input(z.object({ slug: z.string() }))
    .query(async ({ input, ctx }) => {
      const product = await productService.getBySlug(
        input.slug,
        ctx.requestContext
      );

      if (!product) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: `Product not found: ${input.slug}`,
        });
      }

      return product;
    }),
});
```

### Codigos de Error

| Codigo | HTTP | Descripcion |
|--------|------|-------------|
| BAD_REQUEST | 400 | Input invalido |
| UNAUTHORIZED | 401 | No autenticado |
| FORBIDDEN | 403 | Sin permisos |
| NOT_FOUND | 404 | Recurso no existe |
| CONFLICT | 409 | Conflicto de datos |
| INTERNAL_SERVER_ERROR | 500 | Error del servidor |

### Manejo en Cliente

```typescript
const { error } = trpc.product.getBySlug.useQuery({ slug });

if (error) {
  if (error.data?.code === "NOT_FOUND") {
    return <NotFound />;
  }
  if (error.data?.code === "UNAUTHORIZED") {
    return <Login />;
  }
  return <Error message={error.message} />;
}
```

## Optimistic Updates

```typescript
"use client";

export const FavoriteButton: FC<Props> = ({ productId, isFavorite }) => {
  const utils = trpc.useUtils();

  const toggleFavorite = trpc.favorites.toggle.useMutation({
    onMutate: async ({ productId }) => {
      // Cancelar queries pendientes
      await utils.favorites.list.cancel();

      // Snapshot del estado actual
      const previousData = utils.favorites.list.getData();

      // Optimistic update
      utils.favorites.list.setData(undefined, (old) => {
        if (!old) return old;
        // Toggle favorito
        return {
          ...old,
          items: old.items.map((item) =>
            item.id === productId
              ? { ...item, isFavorite: !item.isFavorite }
              : item
          ),
        };
      });

      return { previousData };
    },
    onError: (err, variables, context) => {
      // Rollback en caso de error
      if (context?.previousData) {
        utils.favorites.list.setData(undefined, context.previousData);
      }
    },
    onSettled: () => {
      // Refetch para asegurar datos correctos
      utils.favorites.list.invalidate();
    },
  });

  return (
    <Button onClick={() => toggleFavorite.mutate({ productId })}>
      {isFavorite ? "Quitar" : "Agregar"}
    </Button>
  );
};
```

## Testing de Routers

```typescript
// tests/unit/routers/product-router.test.ts
import { describe, expect, it, vi } from "vitest";
import { productRouter } from "@/app/server/routers/product-router";
import { createTRPCContext } from "@/app/server/trpc/context";

describe("productRouter", () => {
  const mockContext = {
    userId: null,
    auth: { userId: null, getToken: vi.fn() },
    requestContext: {
      selectedCountry: "mx",
      selectedLanguage: "es",
    },
  };

  it("should get product by slug", async () => {
    const caller = productRouter.createCaller(mockContext);

    const result = await caller.getBySlug({ slug: "test-product" });

    expect(result).toBeDefined();
    expect(result.slug).toBe("test-product");
  });
});
```
