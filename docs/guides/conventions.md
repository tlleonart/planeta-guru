# Convenciones de Codigo

## Principios Generales

1. **Consistencia**: Seguir los patrones existentes en el codigo
2. **Simplicidad**: Preferir soluciones simples sobre complejas
3. **Type Safety**: Nunca usar `any`, siempre tipar correctamente
4. **Colocacion**: Mantener codigo relacionado junto

## TypeScript

### Tipos vs Interfaces

```typescript
// Usar interface para objetos que pueden ser extendidos
interface Product {
  id: number;
  name: string;
}

// Usar type para unions, intersections, o tipos utilitarios
type ProductType = "game_key" | "gift_card" | "subscription";
type ProductWithPrices = Product & { prices: Price[] };
```

### Modelos de API vs Dominio

```typescript
// Modelos de API: snake_case con sufijo ApiModel
interface ProductApiModel {
  id: number;
  product_name: string;
  base_price: number;
  created_at: string;
}

// Modelos de dominio: camelCase
interface Product {
  id: number;
  productName: string;
  basePrice: number;
  createdAt: string;
}

// Respuestas de API: sufijo ApiResponse
interface GetProductApiResponse {
  product: ProductApiModel;
}

// Parametros de query: sufijo Params
interface GetProductsParams extends PaginationParams {
  categoryId?: number;
  search?: string;
}
```

### Evitar `any`

```typescript
// ❌ Malo
const data: any = await fetchData();

// ✅ Bueno
const data: Product = await fetchData();

// ✅ Si realmente no conoces el tipo
const data: unknown = await fetchData();
if (isProduct(data)) {
  // Ahora data es Product
}
```

## Componentes React

### Server Components (Por Defecto)

```typescript
// src/modules/products/product-page.tsx
import type { FC } from "react";
import { api } from "@/app/server/server";

interface ProductPageProps {
  slug: string;
}

export const ProductPage: FC<ProductPageProps> = async ({ slug }) => {
  const product = await api.product.getBySlug({ slug });

  return (
    <main>
      <h1>{product.name}</h1>
      {/* ... */}
    </main>
  );
};
```

### Client Components (Solo Cuando Necesario)

```typescript
// src/modules/products/components/buy-button.tsx
"use client";

import type { FC } from "react";
import { useState } from "react";

interface BuyButtonProps {
  productId: number;
}

export const BuyButton: FC<BuyButtonProps> = ({ productId }) => {
  const [isLoading, setIsLoading] = useState(false);

  const handleClick = async () => {
    setIsLoading(true);
    // ...
  };

  return (
    <button onClick={handleClick} disabled={isLoading}>
      Comprar
    </button>
  );
};
```

### Patron Client Islands

```typescript
// Server Component envuelve Client Components pequenos
export const ProductCard: FC<ProductCardProps> = async ({ product }) => {
  return (
    <Card>
      <CardHeader>
        <h3>{product.name}</h3>
      </CardHeader>
      <CardContent>
        <p>{product.description}</p>
        {/* Client Island para interactividad */}
        <FavoriteButton productId={product.id} />
        <BuyButton productId={product.id} />
      </CardContent>
    </Card>
  );
};
```

## Nombrado de Archivos

| Tipo | Convencion | Ejemplo |
|------|------------|---------|
| Componentes | kebab-case.tsx | `product-card.tsx` |
| Paginas de modulo | kebab-case-page.tsx | `home-page.tsx` |
| Servicios | kebab-case-service.ts | `product-service.ts` |
| Mappers | kebab-case-mapper.ts | `product-mapper.ts` |
| Tipos | kebab-case-types.ts | `product-types.ts` |
| Hooks | camelCase.ts | `useModal.ts` |
| Stores | kebab-case-store.ts | `modal-store.ts` |
| Tests | kebab-case.test.ts | `product-mapper.test.ts` |

## Nombrado de Exports

| Tipo | Convencion | Ejemplo |
|------|------------|---------|
| Componentes | PascalCase | `export const ProductCard` |
| Hooks | camelCase con use | `export const useModal` |
| Servicios | PascalCase instance | `export const productService` |
| Funciones mapper | camelCase con map | `export function mapProduct` |
| Tipos/Interfaces | PascalCase | `export interface Product` |

## Imports

### Orden de Imports

```typescript
// 1. React/Next.js
import type { FC } from "react";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

// 2. Librerias externas
import { z } from "zod";
import { clsx } from "clsx";

// 3. Imports internos con alias @/
import { api } from "@/app/server/server";
import { Button } from "@/components/ui/button";

// 4. Imports relativos
import { ProductCard } from "./product-card";
import type { ProductCardProps } from "./types";
```

### Usar Path Aliases

```typescript
// ✅ Bueno
import { ProductService } from "@/modules/shared/services/product-service";

// ❌ Evitar imports relativos profundos
import { ProductService } from "../../../shared/services/product-service";
```

## Estilos con Tailwind

### Clases Utilitarias

```typescript
// ✅ Bueno: clases utilitarias directas
<div className="flex items-center gap-4 p-4 bg-gray-100 rounded-lg">

// ✅ Con condiciones: usar clsx o cn
<div className={cn(
  "flex items-center gap-4 p-4 rounded-lg",
  isActive && "bg-blue-100",
  isDisabled && "opacity-50 cursor-not-allowed"
)}>
```

### Evitar Estilos Inline

```typescript
// ❌ Malo
<div style={{ display: "flex", padding: "1rem" }}>

// ✅ Bueno
<div className="flex p-4">
```

## Servicios

### Extender BaseService

```typescript
// src/modules/shared/services/product-service.ts
import { BaseService } from "@/modules/http/base-service";

class ProductService extends BaseService {
  async getBySlug(slug: string, ctx: RequestContext) {
    const response = await this.http.get<GetProductApiResponse>(
      `/products/${slug}`,
      { context: ctx }
    );
    return mapProduct(response.data.product);
  }

  async list(params: GetProductsParams, ctx: RequestContext) {
    const queryParams = this.buildQueryParams(params);
    const response = await this.http.get<GetProductsApiResponse>(
      `/products?${queryParams}`,
      { context: ctx }
    );
    return {
      products: response.data.products.map(mapProduct),
      pagination: this.mapPagination(response.data.pagination),
    };
  }
}

export const productService = new ProductService();
```

## tRPC Routers

### Estructura de Procedures

```typescript
// src/app/server/routers/product-router.ts
import { z } from "zod";
import { createTRPCRouter, publicProcedure, protectedProcedure } from "../trpc/trpc";

export const productRouter = createTRPCRouter({
  // Procedure publico
  getBySlug: publicProcedure
    .input(z.object({ slug: z.string() }))
    .query(async ({ input, ctx }) => {
      return productService.getBySlug(input.slug, ctx.requestContext);
    }),

  // Procedure protegido (requiere autenticacion)
  addToFavorites: protectedProcedure
    .input(z.object({ productId: z.number() }))
    .mutation(async ({ input, ctx }) => {
      return favoritesService.add(input.productId, ctx.requestContext);
    }),
});
```

## Mappers

### Transformacion API → Dominio

```typescript
// src/modules/shared/mappers/product-mapper.ts
import type { Product, ProductApiModel } from "../types/product-types";

export function mapProduct(api: ProductApiModel): Product {
  return {
    id: api.id,
    name: api.name,
    slug: api.slug,
    productType: api.product_type,
    basePrice: api.base_price,
    discountPercentage: api.discount_percentage,
    createdAt: api.created_at,
  };
}

export function mapProductList(apiList: ProductApiModel[]): Product[] {
  return apiList.map(mapProduct);
}
```

## Manejo de Errores

### En Servicios

```typescript
async getBySlug(slug: string, ctx: RequestContext) {
  try {
    const response = await this.http.get<GetProductApiResponse>(
      `/products/${slug}`,
      { context: ctx }
    );
    return mapProduct(response.data.product);
  } catch (error) {
    if (axios.isAxiosError(error) && error.response?.status === 404) {
      throw new TRPCError({
        code: "NOT_FOUND",
        message: `Product not found: ${slug}`,
      });
    }
    throw error;
  }
}
```

### En Componentes

```typescript
// Server Component
export const ProductPage: FC<Props> = async ({ slug }) => {
  const product = await api.product.getBySlug({ slug });

  if (!product) {
    notFound();
  }

  return <ProductContent product={product} />;
};

// Client Component
export const ProductList: FC = () => {
  const { data, error, isLoading } = trpc.product.list.useQuery();

  if (isLoading) return <ProductListSkeleton />;
  if (error) return <ErrorMessage message={error.message} />;

  return <ProductGrid products={data.products} />;
};
```

## Comentarios

### Usar JSDoc para Funciones Publicas

```typescript
/**
 * Obtiene un producto por su slug
 * @param slug - Identificador unico del producto
 * @param ctx - Contexto de la request con auth y locale
 * @returns Producto mapeado al modelo de dominio
 * @throws TRPCError si el producto no existe
 */
async getBySlug(slug: string, ctx: RequestContext): Promise<Product> {
  // ...
}
```

### Evitar Comentarios Obvios

```typescript
// ❌ Malo
// Incrementa el contador
counter++;

// ✅ Bueno (sin comentario, es obvio)
counter++;

// ✅ Bueno (explica el por que, no el que)
// Incrementamos antes de la llamada API para evitar race conditions
counter++;
```

## Biome Linting

### Ejecutar Antes de Commit

```bash
npm run lint
```

### Formatear Codigo

```bash
npm run format
```

### Ignorar Reglas (Usar con Moderacion)

```typescript
// biome-ignore lint/suspicious/noExplicitAny: API externa no tipada
const response: any = await externalApi.call();

// biome-ignore lint/a11y/useKeyWithClickEvents: maneja keyboard en parent
<div onClick={handleClick}>
```
