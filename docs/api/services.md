# Capa de Servicios

## Vision General

Los servicios en Planeta Guru encapsulan la logica de negocio y la comunicacion con el backend API. Todos los servicios extienden la clase `BaseService`.

## Arquitectura

```
tRPC Router
     |
     v
  Service (extiende BaseService)
     |
     v
HttpClient (Axios)
     |
     v
Backend API (Laravel)
```

## BaseService

### Definicion

```typescript
// src/modules/http/base-service.ts
import { HttpClient } from "./http-client";
import type { Pagination, PaginationApiModel } from "./types";

export abstract class BaseService {
  protected http: HttpClient;

  constructor() {
    this.http = new HttpClient();
  }

  protected mapPagination(api: PaginationApiModel): Pagination {
    return {
      currentPage: api.current_page,
      perPage: api.per_page,
      totalPages: api.total_pages,
      total: api.total,
    };
  }

  protected buildQueryParams(params: Record<string, unknown>): string {
    const searchParams = new URLSearchParams();

    for (const [key, value] of Object.entries(params)) {
      if (value !== undefined && value !== null) {
        // Convertir camelCase a snake_case
        const snakeKey = key.replace(/[A-Z]/g, (m) => `_${m.toLowerCase()}`);
        searchParams.append(snakeKey, String(value));
      }
    }

    return searchParams.toString();
  }

  protected buildPaginationParams(page: number, limit: number): string {
    return this.buildQueryParams({ page, perPage: limit });
  }

  protected buildSortParams(sortBy?: string, sortOrder?: string): string {
    if (!sortBy) return "";
    return this.buildQueryParams({ sortBy, sortOrder: sortOrder || "asc" });
  }
}
```

## HttpClient

### Definicion

```typescript
// src/modules/http/http-client.ts
import axios, { type AxiosInstance } from "axios";
import type { RequestContext, RequestOptions, HttpResponse } from "./types";

export class HttpClient {
  private client: AxiosInstance;

  constructor() {
    this.client = axios.create({
      baseURL: process.env.NEXT_PUBLIC_API_BASE_URL,
    });
  }

  private buildHeaders(context?: RequestContext): Record<string, string> {
    const headers: Record<string, string> = {
      "Content-Type": "application/json",
      "Platform-Key": process.env.NEXT_PUBLIC_API_PLATFORM_KEY || "",
    };

    if (context?.selectedCountry) {
      headers["Selected-Country"] = context.selectedCountry;
    }

    if (context?.selectedLanguage) {
      headers["Selected-Language"] = context.selectedLanguage;
    }

    if (context?.authToken) {
      headers["Authorization"] = `Bearer ${context.authToken}`;
    }

    if (context?.msisdn) {
      headers["X-MSISDN"] = context.msisdn;
    }

    return headers;
  }

  async get<T>(url: string, options?: RequestOptions): Promise<HttpResponse<T>> {
    const headers = this.buildHeaders(options?.context);
    return this.client.get(url, { headers, ...options?.next });
  }

  async post<T>(
    url: string,
    data: unknown,
    options?: RequestOptions
  ): Promise<HttpResponse<T>> {
    const headers = this.buildHeaders(options?.context);
    return this.client.post(url, data, { headers, ...options?.next });
  }

  async put<T>(
    url: string,
    data: unknown,
    options?: RequestOptions
  ): Promise<HttpResponse<T>> {
    const headers = this.buildHeaders(options?.context);
    return this.client.put(url, data, { headers, ...options?.next });
  }

  async delete<T>(url: string, options?: RequestOptions): Promise<HttpResponse<T>> {
    const headers = this.buildHeaders(options?.context);
    return this.client.delete(url, { headers, ...options?.next });
  }
}
```

## Creacion de un Servicio

### Paso 1: Definir Tipos

```typescript
// src/modules/shared/types/product-types.ts

// Modelo de API (snake_case)
export interface ProductApiModel {
  id: number;
  name: string;
  slug: string;
  product_type: string;
  base_price: number;
  discount_percentage: number | null;
  image_url: string;
  description: string;
  created_at: string;
}

// Modelo de dominio (camelCase)
export interface Product {
  id: number;
  name: string;
  slug: string;
  productType: string;
  basePrice: number;
  discountPercentage: number | null;
  imageUrl: string;
  description: string;
  createdAt: string;
}

// Respuesta de API
export interface GetProductApiResponse {
  product: ProductApiModel;
}

export interface GetProductsApiResponse {
  products: ProductApiModel[];
  pagination: PaginationApiModel;
}

// Parametros de query
export interface GetProductsParams {
  page?: number;
  limit?: number;
  categoryId?: number;
  search?: string;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
}
```

### Paso 2: Crear Mapper

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
    imageUrl: api.image_url,
    description: api.description,
    createdAt: api.created_at,
  };
}

export function mapProductList(apiList: ProductApiModel[]): Product[] {
  return apiList.map(mapProduct);
}
```

### Paso 3: Implementar Servicio

```typescript
// src/modules/shared/services/product-service.ts
import { BaseService } from "@/modules/http/base-service";
import type { RequestContext } from "@/modules/http/types";
import type {
  Product,
  GetProductApiResponse,
  GetProductsApiResponse,
  GetProductsParams,
} from "../types/product-types";
import { mapProduct, mapProductList } from "../mappers/product-mapper";

class ProductService extends BaseService {
  async getBySlug(slug: string, ctx: RequestContext): Promise<Product> {
    const response = await this.http.get<GetProductApiResponse>(
      `/api/v1/products/${slug}`,
      { context: ctx }
    );
    return mapProduct(response.data.product);
  }

  async list(
    params: GetProductsParams,
    ctx: RequestContext
  ): Promise<{ products: Product[]; pagination: Pagination }> {
    const queryParams = this.buildQueryParams(params);
    const response = await this.http.get<GetProductsApiResponse>(
      `/api/v1/products?${queryParams}`,
      { context: ctx }
    );

    return {
      products: mapProductList(response.data.products),
      pagination: this.mapPagination(response.data.pagination),
    };
  }

  async getByCategory(
    categoryId: number,
    params: GetProductsParams,
    ctx: RequestContext
  ): Promise<{ products: Product[]; pagination: Pagination }> {
    const queryParams = this.buildQueryParams({
      ...params,
      categoryId,
    });
    const response = await this.http.get<GetProductsApiResponse>(
      `/api/v1/products?${queryParams}`,
      { context: ctx }
    );

    return {
      products: mapProductList(response.data.products),
      pagination: this.mapPagination(response.data.pagination),
    };
  }
}

export const productService = new ProductService();
```

### Paso 4: Crear Router tRPC

```typescript
// src/app/server/routers/product-router.ts
import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "../trpc/trpc";
import { productService } from "@/modules/shared/services/product-service";

export const productRouter = createTRPCRouter({
  getBySlug: publicProcedure
    .input(z.object({ slug: z.string() }))
    .query(async ({ input, ctx }) => {
      return productService.getBySlug(input.slug, ctx.requestContext);
    }),

  list: publicProcedure
    .input(
      z.object({
        page: z.number().optional(),
        limit: z.number().optional(),
        categoryId: z.number().optional(),
        search: z.string().optional(),
      })
    )
    .query(async ({ input, ctx }) => {
      return productService.list(input, ctx.requestContext);
    }),
});
```

### Paso 5: Registrar Router

```typescript
// src/app/server/routers/index.ts
import { productRouter } from "./product-router";

export const appRouter = createTRPCRouter({
  product: productRouter,
  // ... otros routers
});
```

## Servicios Existentes

### ProductService

```typescript
// Metodos disponibles
productService.getBySlug(slug, ctx)
productService.getGameKey(slug, ctx)
productService.getGiftCard(slug, ctx)
productService.getSubscription(slug, ctx)
productService.getGameWebGL(slug, ctx)
productService.list(params, ctx)
productService.getByCategory(categoryId, params, ctx)
productService.search(query, params, ctx)
```

### WalletService

```typescript
// Metodos disponibles
walletService.getWallet(ctx)
walletService.getHistory(params, ctx)
walletService.getBalance(ctx)
```

### PacksService

```typescript
// Metodos disponibles
packsService.list(ctx)
packsService.getById(id, ctx)
packsService.getPaymentMethods(ctx)
```

### FavoritesService

```typescript
// Metodos disponibles
favoritesService.list(params, ctx)
favoritesService.add(productId, ctx)
favoritesService.remove(productId, ctx)
favoritesService.toggle(productId, ctx)
```

### LegalsService

```typescript
// Metodos disponibles
legalsService.getLegalsUrls(ctx)
legalsService.getPrivacy(ctx)
legalsService.getTerms(ctx)
```

### CategoriesService

```typescript
// Metodos disponibles
categoriesService.list(ctx)
categoriesService.getById(id, ctx)
categoriesService.getProducts(id, params, ctx)
```

## Manejo de Errores

### En Servicios

```typescript
import { TRPCError } from "@trpc/server";
import axios from "axios";

class ProductService extends BaseService {
  async getBySlug(slug: string, ctx: RequestContext): Promise<Product> {
    try {
      const response = await this.http.get<GetProductApiResponse>(
        `/api/v1/products/${slug}`,
        { context: ctx }
      );
      return mapProduct(response.data.product);
    } catch (error) {
      if (axios.isAxiosError(error)) {
        if (error.response?.status === 404) {
          throw new TRPCError({
            code: "NOT_FOUND",
            message: `Product not found: ${slug}`,
          });
        }
        if (error.response?.status === 401) {
          throw new TRPCError({
            code: "UNAUTHORIZED",
            message: "Authentication required",
          });
        }
      }
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Failed to fetch product",
        cause: error,
      });
    }
  }
}
```

## Caching

### Con Next.js Fetch Cache

```typescript
async getBySlug(slug: string, ctx: RequestContext): Promise<Product> {
  const response = await this.http.get<GetProductApiResponse>(
    `/api/v1/products/${slug}`,
    {
      context: ctx,
      next: { revalidate: 3600 }, // Cache por 1 hora
    }
  );
  return mapProduct(response.data.product);
}
```

### Sin Cache

```typescript
async getWallet(ctx: RequestContext): Promise<Wallet> {
  const response = await this.http.get<GetWalletApiResponse>(
    "/api/v1/wallet",
    {
      context: ctx,
      next: { revalidate: 0 }, // Sin cache
    }
  );
  return mapWallet(response.data.wallet);
}
```

## Testing de Servicios

```typescript
// tests/unit/services/product-service.test.ts
import { describe, expect, it, vi } from "vitest";
import { productService } from "@/modules/shared/services/product-service";

describe("ProductService", () => {
  const mockContext = {
    selectedCountry: "mx",
    selectedLanguage: "es",
    authToken: null,
  };

  it("should get product by slug", async () => {
    const product = await productService.getBySlug("test-product", mockContext);

    expect(product).toBeDefined();
    expect(product.slug).toBe("test-product");
  });

  it("should list products with pagination", async () => {
    const result = await productService.list(
      { page: 1, limit: 10 },
      mockContext
    );

    expect(result.products).toBeInstanceOf(Array);
    expect(result.pagination).toBeDefined();
    expect(result.pagination.currentPage).toBe(1);
  });
});
```
