# Guía: Agregar Nuevos Servicios

Esta guía explica paso a paso cómo agregar nuevos servicios a la arquitectura del proyecto, desde la definición de tipos hasta la integración con tRPC.

## Índice

1. [Arquitectura General](#arquitectura-general)
2. [Paso 1: Definir Tipos](#paso-1-definir-tipos)
3. [Paso 2: Crear Mappers](#paso-2-crear-mappers)
4. [Paso 3: Crear el Servicio](#paso-3-crear-el-servicio)
5. [Paso 4: Exportar el Servicio](#paso-4-exportar-el-servicio)
6. [Paso 5: Crear el Router tRPC](#paso-5-crear-el-router-trpc)
7. [Paso 6: Registrar en App Router](#paso-6-registrar-en-app-router)
8. [Paso 7: Uso en Componentes](#paso-7-uso-en-componentes)
9. [Ejemplo Completo: OrderService](#ejemplo-completo-orderservice)
10. [Checklist](#checklist)
11. [Troubleshooting](#troubleshooting)

---

## Arquitectura General

### Estructura de Carpetas

```
src/
├── types/
│   ├── api.types.ts            # Tipos genéricos (Pagination, etc.)
│   ├── index.ts                # Exportaciones centralizadas
│   └── [domain].types.ts       # Tipos del dominio específico
├── lib/
│   ├── http/
│   │   ├── client.ts           # HTTP Client
│   │   ├── types.ts            # Tipos del cliente
│   │   └── index.ts            # Exportaciones
│   └── mappers/
│       └── pagination.mapper.ts # Mapper genérico de paginación
├── services/
│   ├── base.service.ts         # Servicio base abstracto
│   ├── index.ts                # Exportaciones centralizadas
│   └── [domain]/
│       ├── [domain].service.ts # Lógica del servicio
│       └── [domain].mapper.ts  # Transformación de datos
└── server/
    └── trpc/
        ├── context.ts          # Contexto tRPC
        ├── trpc.ts             # Configuración tRPC
        ├── server.ts           # Server caller para RSC
        └── routers/
            ├── index.ts        # App router
            └── [domain].router.ts
```

### Flujo de Datos

```
┌─────────────────────────────────────────────────────────────────┐
│                         CLIENT                                   │
│  ┌─────────────────┐    ┌─────────────────┐                     │
│  │ Server Component │    │ Client Component│                     │
│  │ await api.x.y() │    │ trpc.x.y.useQuery│                    │
│  └────────┬────────┘    └────────┬────────┘                     │
└───────────┼──────────────────────┼──────────────────────────────┘
            │                      │
            ▼                      ▼
┌─────────────────────────────────────────────────────────────────┐
│                       tRPC LAYER                                 │
│  ┌─────────────────────────────────────────────────────────┐    │
│  │                    tRPC Router                           │    │
│  │  - Valida input con Zod                                  │    │
│  │  - Inyecta ctx.requestContext                            │    │
│  │  - Maneja auth (publicProcedure/protectedProcedure)      │    │
│  └────────────────────────┬────────────────────────────────┘    │
└───────────────────────────┼─────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────────┐
│                      SERVICE LAYER                               │
│  ┌─────────────────────────────────────────────────────────┐    │
│  │                    Domain Service                        │    │
│  │  - Lógica de negocio                                     │    │
│  │  - Usa helpers de BaseService                            │    │
│  │  - Llama a HttpClient                                    │    │
│  └────────────────────────┬────────────────────────────────┘    │
└───────────────────────────┼─────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────────┐
│                       HTTP LAYER                                 │
│  ┌─────────────────────────────────────────────────────────┐    │
│  │                     HttpClient                           │    │
│  │  - Inyecta headers automáticamente:                      │    │
│  │    • Platform-Key (siempre)                              │    │
│  │    • Authorization (si auth)                             │    │
│  │    • Selected-Country (si cookie)                        │    │
│  │    • Selected-Language (si cookie)                       │    │
│  │    • Msisdn (si cookie)                                  │    │
│  └────────────────────────┬────────────────────────────────┘    │
└───────────────────────────┼─────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────────┐
│                      EXTERNAL API                                │
│  ┌─────────────────────────────────────────────────────────┐    │
│  │              Backend (Laravel/etc.)                      │    │
│  │  - Responde con snake_case                               │    │
│  │  - Incluye pagination en respuestas listadas             │    │
│  └────────────────────────┬────────────────────────────────┘    │
└───────────────────────────┼─────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────────┐
│                      MAPPER LAYER                                │
│  ┌─────────────────────────────────────────────────────────┐    │
│  │                   Domain Mapper                          │    │
│  │  - Transforma snake_case → camelCase                     │    │
│  │  - Usa mapPagination() para paginación                   │    │
│  │  - Retorna tipos del dominio                             │    │
│  └────────────────────────┬────────────────────────────────┘    │
└───────────────────────────┼─────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────────┐
│                    TYPED RESPONSE                                │
│  ┌─────────────────────────────────────────────────────────┐    │
│  │  { items: DomainModel[], pagination: Pagination }        │    │
│  └─────────────────────────────────────────────────────────┘    │
└─────────────────────────────────────────────────────────────────┘
```

---

## Paso 1: Definir Tipos

### 1.1 Revisar tipos base disponibles

Antes de crear tipos específicos, revisa `src/types/api.types.ts` que contiene tipos genéricos reutilizables:

```typescript
// src/types/api.types.ts (YA EXISTE - NO MODIFICAR)

// Paginación de la API (snake_case)
export interface ApiPagination {
  total: number;
  per_page: number;
  current_page: number;
  last_page: number;
  from: number | null;
  to: number | null;
}

// Paginación del dominio (camelCase)
export interface Pagination {
  total: number;
  perPage: number;
  currentPage: number;
  lastPage: number;
  from: number | null;
  to: number | null;
}

// Respuesta paginada genérica
export interface PaginatedResponse<T> {
  items: T[];
  pagination: Pagination;
}

// Parámetros de paginación
export interface PaginationParams {
  page?: number;
  perPage?: number;
}

// Parámetros de ordenamiento
export interface SortParams {
  orderBy?: string;
  order?: 'asc' | 'desc';
}
```

### 1.2 Crear archivo de tipos del dominio

Ubicación: `src/types/[domain]-types.ts`

```typescript
// src/types/order.types.ts

import type {
  ApiPagination,
  PaginatedResponse,
  PaginationParams,
  SortParams,
} from './api.types';

/**
 * ==============================================================================
 * DOMAIN MODELS (camelCase - uso interno)
 * ==============================================================================
 */

export interface Order {
  id: number;
  userId: string;
  status: OrderStatus;
  totalAmount: number;
  currency: string;
  items: OrderItem[];
  shippingAddress: Address | null;
  createdAt: string;
  updatedAt: string;
}

export interface OrderItem {
  id: number;
  orderId: number;
  productId: number;
  productName: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
}

export interface Address {
  street: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
}

export type OrderStatus = 
  | 'pending' 
  | 'confirmed' 
  | 'processing' 
  | 'shipped' 
  | 'delivered' 
  | 'cancelled';

/**
 * ==============================================================================
 * API MODELS (snake_case - del backend)
 * ==============================================================================
 */

export interface OrderApiModel {
  id: number;
  user_id: string;
  status: string;
  total_amount: number;
  currency: string;
  items: OrderItemApiModel[];
  shipping_address: AddressApiModel | null;
  created_at: string;
  updated_at: string;
}

export interface OrderItemApiModel {
  id: number;
  order_id: number;
  product_id: number;
  product_name: string;
  quantity: number;
  unit_price: number;
  total_price: number;
}

export interface AddressApiModel {
  street: string;
  city: string;
  state: string;
  zip_code: string;
  country: string;
}

/**
 * ==============================================================================
 * API RESPONSES
 * ==============================================================================
 */

export interface GetOrdersApiResponse {
  orders: OrderApiModel[];
  pagination: ApiPagination;
}

export interface GetOrderByIdApiResponse {
  order: OrderApiModel;
}

export interface CreateOrderApiResponse {
  order: OrderApiModel;
}

/**
 * ==============================================================================
 * QUERY PARAMS (extendiendo tipos base)
 * ==============================================================================
 */

export interface GetOrdersParams extends PaginationParams, SortParams {
  status?: OrderStatus;
  fromDate?: string;
  toDate?: string;
}

/**
 * ==============================================================================
 * REQUEST DTOs
 * ==============================================================================
 */

export interface CreateOrderDto {
  items: Array<{
    productId: number;
    quantity: number;
  }>;
  shippingAddress?: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
}

export interface UpdateOrderStatusDto {
  status: OrderStatus;
}

/**
 * ==============================================================================
 * RESPONSE WRAPPERS (usando genéricos)
 * ==============================================================================
 */

export type PaginatedOrders = PaginatedResponse<Order>;
```

### 1.3 Convenciones de Nomenclatura

| Tipo | Sufijo | Ejemplo | Uso |
|------|--------|---------|-----|
| Modelo de dominio | (ninguno) | `Order` | Uso en toda la app |
| Modelo de API | `ApiModel` | `OrderApiModel` | Representa respuesta raw |
| Respuesta de API | `ApiResponse` | `GetOrdersApiResponse` | Estructura completa del endpoint |
| Parámetros de query | `Params` | `GetOrdersParams` | Filtros y paginación |
| DTO de request | `Dto` | `CreateOrderDto` | Datos para enviar al backend |
| Respuesta paginada | `Paginated[X]` | `PaginatedOrders` | Alias de `PaginatedResponse<X>` |

---

## Paso 2: Crear Mappers

### 2.1 Crear archivo de mappers

Ubicación: `src/services/[domain]/[domain].mapper.ts`

```typescript
// src/services/order/order.mapper.ts

import type {
  Order,
  OrderItem,
  Address,
  OrderStatus,
  OrderApiModel,
  OrderItemApiModel,
  AddressApiModel,
  CreateOrderDto,
} from '@/types/order.types';

/**
 * ==============================================================================
 * RESPONSE MAPPERS (API → Domain)
 * ==============================================================================
 */

function mapOrderStatus(status: string): OrderStatus {
  const validStatuses: OrderStatus[] = [
    'pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled'
  ];
  return validStatuses.includes(status as OrderStatus) 
    ? (status as OrderStatus) 
    : 'pending';
}

export function mapAddress(api: AddressApiModel): Address {
  return {
    street: api.street,
    city: api.city,
    state: api.state,
    zipCode: api.zip_code,
    country: api.country,
  };
}

export function mapOrderItem(api: OrderItemApiModel): OrderItem {
  return {
    id: api.id,
    orderId: api.order_id,
    productId: api.product_id,
    productName: api.product_name,
    quantity: api.quantity,
    unitPrice: api.unit_price,
    totalPrice: api.total_price,
  };
}

export function mapOrder(api: OrderApiModel): Order {
  return {
    id: api.id,
    userId: api.user_id,
    status: mapOrderStatus(api.status),
    totalAmount: api.total_amount,
    currency: api.currency,
    items: api.items.map(mapOrderItem),
    shippingAddress: api.shipping_address 
      ? mapAddress(api.shipping_address) 
      : null,
    createdAt: api.created_at,
    updatedAt: api.updated_at,
  };
}

/**
 * ==============================================================================
 * REQUEST MAPPERS (Domain → API)
 * ==============================================================================
 */

export function mapCreateOrderRequest(dto: CreateOrderDto): {
  items: Array<{ product_id: number; quantity: number }>;
  shipping_address?: {
    street: string;
    city: string;
    state: string;
    zip_code: string;
    country: string;
  };
} {
  return {
    items: dto.items.map((item) => ({
      product_id: item.productId,
      quantity: item.quantity,
    })),
    shipping_address: dto.shippingAddress
      ? {
          street: dto.shippingAddress.street,
          city: dto.shippingAddress.city,
          state: dto.shippingAddress.state,
          zip_code: dto.shippingAddress.zipCode,
          country: dto.shippingAddress.country,
        }
      : undefined,
  };
}
```

### 2.2 Principios de los Mappers

1. **Funciones puras**: Sin efectos secundarios, solo transformación
2. **Una responsabilidad**: Cada función mapea una entidad
3. **Composición**: Mappers de entidades anidadas se componen
4. **Null safety**: Manejar valores null/undefined explícitamente
5. **Validación de enums**: Convertir strings a tipos específicos con fallback

---

## Paso 3: Crear el Servicio

### 3.1 Crear archivo del servicio

Ubicación: `src/services/[domain]/[domain].service.ts`

```typescript
// src/services/order/order.service.ts

import { BaseService } from '../base.service';
import type { RequestContext } from '@/lib/http';
import type {
  Order,
  PaginatedOrders,
  GetOrdersParams,
  CreateOrderDto,
  UpdateOrderStatusDto,
  GetOrdersApiResponse,
  GetOrderByIdApiResponse,
  CreateOrderApiResponse,
} from '@/types/order.types';
import { mapOrder, mapCreateOrderRequest } from './order.mapper';

/**
 * Servicio para gestión de órdenes.
 *
 * Endpoints:
 * - GET /orders - Lista de órdenes del usuario
 * - GET /orders/:id - Detalle de orden
 * - POST /orders - Crear orden
 * - PATCH /orders/:id/status - Actualizar estado
 * - DELETE /orders/:id - Cancelar orden
 */
class OrderService extends BaseService {
  private readonly basePath = '/orders';

  // ==========================================================================
  // QUERIES
  // ==========================================================================

  /**
   * Obtiene las órdenes del usuario con filtros y paginación.
   */
  async getOrders(
    params: GetOrdersParams = {},
    context: RequestContext
  ): Promise<PaginatedOrders> {
    const response = await this.http.get<GetOrdersApiResponse>(
      this.basePath,
      {
        params: {
          ...this.buildQueryParams(params),
          status: params.status,
          from_date: params.fromDate,
          to_date: params.toDate,
        },
        context,
      }
    );

    return {
      items: response.data.orders.map(mapOrder),
      pagination: this.mapPagination(response.data.pagination),
    };
  }

  /**
   * Obtiene una orden por ID.
   */
  async getOrderById(
    id: number,
    context: RequestContext
  ): Promise<Order> {
    const response = await this.http.get<GetOrderByIdApiResponse>(
      `${this.basePath}/${id}`,
      { context }
    );

    return mapOrder(response.data.order);
  }

  // ==========================================================================
  // MUTATIONS
  // ==========================================================================

  /**
   * Crea una nueva orden.
   */
  async createOrder(
    data: CreateOrderDto,
    context: RequestContext
  ): Promise<Order> {
    const requestBody = mapCreateOrderRequest(data);

    const response = await this.http.post<CreateOrderApiResponse>(
      this.basePath,
      requestBody,
      { context }
    );

    return mapOrder(response.data.order);
  }

  /**
   * Actualiza el estado de una orden.
   */
  async updateOrderStatus(
    id: number,
    data: UpdateOrderStatusDto,
    context: RequestContext
  ): Promise<Order> {
    const response = await this.http.patch<GetOrderByIdApiResponse>(
      `${this.basePath}/${id}/status`,
      { status: data.status },
      { context }
    );

    return mapOrder(response.data.order);
  }

  /**
   * Cancela una orden.
   */
  async cancelOrder(
    id: number,
    context: RequestContext
  ): Promise<void> {
    await this.http.delete(`${this.basePath}/${id}`, { context });
  }
}

// Exportar instancia singleton
export const orderService = new OrderService();
```

### 3.2 Helpers disponibles en BaseService

```typescript
// Heredados de BaseService:

// Transforma paginación API → dominio
this.mapPagination(apiPagination)

// Construye params de paginación (camelCase → snake_case)
this.buildPaginationParams({ page, perPage })
// → { page, per_page }

// Construye params de ordenamiento
this.buildSortParams({ orderBy, order })
// → { order_by, order }

// Construye ambos combinados
this.buildQueryParams({ page, perPage, orderBy, order })
// → { page, per_page, order_by, order }
```

---

## Paso 4: Exportar el Servicio

### 4.1 Actualizar índice de servicios

Ubicación: `src/services/index.ts`

```typescript
// src/services/index.ts

// Base
export * from './base.service';

// Servicios existentes
export * from './wallet/wallet.service';
export * from './wallet/wallet.mapper';
export * from './legals/legals.service';
export * from './legals/legals.mapper';
export * from './product/product.service';
export * from './product/product.mapper';

// NUEVO: Order
export * from './order/order.service';
export * from './order/order.mapper';
```

### 4.2 Actualizar índice de tipos

Ubicación: `src/types/index.ts`

```typescript
// src/types/index.ts

export * from './api.types';
export * from './wallet.types';
export * from './legals.types';
export * from './product.types';

// NUEVO
export * from './order.types';
```

---

## Paso 5: Crear el Router tRPC

### 5.1 Crear archivo del router

Ubicación: `src/server/routers/[domain].router.ts`

```typescript
// src/server/routers/order.router.ts

import { z } from 'zod';
import { router, protectedProcedure } from '../trpc';
import { orderService } from '@/services';

/**
 * Schemas de validación
 */
const orderStatusSchema = z.enum([
  'pending',
  'confirmed',
  'processing',
  'shipped',
  'delivered',
  'cancelled',
]);

const paginationSchema = z.object({
  page: z.number().min(1).default(1),
  perPage: z.number().min(1).max(100).default(20),
});

const getOrdersSchema = paginationSchema.extend({
  orderBy: z.enum(['created_at', 'updated_at', 'total_amount']).optional(),
  order: z.enum(['asc', 'desc']).default('desc'),
  status: orderStatusSchema.optional(),
  fromDate: z.string().optional(),
  toDate: z.string().optional(),
});

const createOrderSchema = z.object({
  items: z.array(
    z.object({
      productId: z.number().positive(),
      quantity: z.number().positive(),
    })
  ).min(1),
  shippingAddress: z.object({
    street: z.string().min(1),
    city: z.string().min(1),
    state: z.string().min(1),
    zipCode: z.string().min(1),
    country: z.string().min(1),
  }).optional(),
});

/**
 * Router de Orders.
 * Todos los endpoints requieren autenticación.
 */
export const orderRouter = router({
  // ==========================================================================
  // QUERIES
  // ==========================================================================

  /**
   * Lista órdenes del usuario.
   */
  getOrders: protectedProcedure
    .input(getOrdersSchema.optional())
    .query(async ({ input, ctx }) => {
      return orderService.getOrders(input ?? {}, ctx.requestContext);
    }),

  /**
   * Obtiene una orden por ID.
   */
  getById: protectedProcedure
    .input(z.object({ id: z.number().positive() }))
    .query(async ({ input, ctx }) => {
      return orderService.getOrderById(input.id, ctx.requestContext);
    }),

  // ==========================================================================
  // MUTATIONS
  // ==========================================================================

  /**
   * Crea una nueva orden.
   */
  create: protectedProcedure
    .input(createOrderSchema)
    .mutation(async ({ input, ctx }) => {
      return orderService.createOrder(input, ctx.requestContext);
    }),

  /**
   * Actualiza el estado de una orden.
   */
  updateStatus: protectedProcedure
    .input(
      z.object({
        id: z.number().positive(),
        status: orderStatusSchema,
      })
    )
    .mutation(async ({ input, ctx }) => {
      return orderService.updateOrderStatus(
        input.id,
        { status: input.status },
        ctx.requestContext
      );
    }),

  /**
   * Cancela una orden.
   */
  cancel: protectedProcedure
    .input(z.object({ id: z.number().positive() }))
    .mutation(async ({ input, ctx }) => {
      await orderService.cancelOrder(input.id, ctx.requestContext);
      return { success: true, cancelledId: input.id };
    }),
});

export type OrderRouter = typeof orderRouter;
```

### 5.2 Cuándo usar publicProcedure vs protectedProcedure

| Tipo | Uso | Ejemplo |
|------|-----|---------|
| `publicProcedure` | Datos públicos, sin auth | Listado de productos, categorías |
| `protectedProcedure` | Requiere usuario autenticado | Órdenes, favoritos, wallet |

---

## Paso 6: Registrar en App Router

### 6.1 Actualizar el router principal

Ubicación: `src/server/trpc/routers/index.ts`

```typescript
// src/server/trpc/routers/index.ts

import { router, createCallerFactory } from '../trpc';
import { walletRouter } from './wallet.router';
import { legalsRouter } from './legals.router';
import { productRouter } from './product.router';
import { orderRouter } from './order.router';  // ← NUEVO

export const appRouter = router({
  wallet: walletRouter,
  legals: legalsRouter,
  product: productRouter,
  order: orderRouter,  // ← NUEVO
});

export type AppRouter = typeof appRouter;

export const createCaller = createCallerFactory(appRouter);
```

### 6.2 Verificar tipos

```bash
pnpm tsc --noEmit
```

---

## Paso 7: Uso en Componentes

### 7.1 En Server Components

```typescript
// src/app/[locale]/orders/page.tsx

import { Suspense } from 'react';
import { api } from '@/server/trpc/server';
import { OrderList } from './components/order-list';
import { OrderListSkeleton } from './components/order-list-skeleton';

interface OrdersPageProps {
  searchParams: Promise<{
    page?: string;
    status?: string;
  }>;
}

async function OrderListServer({ searchParams }: OrdersPageProps) {
  const params = await searchParams;

  const { items: orders, pagination } = await api.order.getOrders({
    page: Number(params.page) || 1,
    status: params.status as 'pending' | 'confirmed' | undefined,
  });

  return <OrderList orders={orders} pagination={pagination} />;
}

export default function OrdersPage(props: OrdersPageProps) {
  return (
    <main className="container mx-auto py-8">
      <h1 className="text-2xl font-bold mb-6">Mis Órdenes</h1>
      
      <Suspense fallback={<OrderListSkeleton />}>
        <OrderListServer searchParams={props.searchParams} />
      </Suspense>
    </main>
  );
}
```

### 7.2 En Client Components

```typescript
// src/components/orders/order-list-client.tsx

'use client';

import { useState } from 'react';
import { trpc } from '@/lib/trpc/client';
import type { OrderStatus } from '@/types/order.types';

export function OrderListClient() {
  const [status, setStatus] = useState<OrderStatus | undefined>();
  const [page, setPage] = useState(1);

  const { data, isLoading, isError, error } = trpc.order.getOrders.useQuery({
    page,
    perPage: 10,
    status,
  });

  if (isLoading) return <div>Cargando...</div>;
  if (isError) return <div>Error: {error.message}</div>;

  return (
    <div>
      {/* Filtros */}
      <select 
        value={status ?? ''} 
        onChange={(e) => setStatus(e.target.value as OrderStatus || undefined)}
      >
        <option value="">Todos</option>
        <option value="pending">Pendientes</option>
        <option value="confirmed">Confirmados</option>
      </select>

      {/* Lista */}
      {data?.items.map((order) => (
        <div key={order.id}>
          <p>Orden #{order.id}</p>
          <p>Total: {order.totalAmount}</p>
          <p>Estado: {order.status}</p>
        </div>
      ))}

      {/* Paginación */}
      <button 
        onClick={() => setPage((p) => Math.max(1, p - 1))}
        disabled={page === 1}
      >
        Anterior
      </button>
      <span>Página {page} de {data?.pagination.lastPage}</span>
      <button 
        onClick={() => setPage((p) => p + 1)}
        disabled={page >= (data?.pagination.lastPage ?? 1)}
      >
        Siguiente
      </button>
    </div>
  );
}
```

### 7.3 Mutations en Client Components

```typescript
// src/components/orders/create-order-button.tsx

'use client';

import { trpc } from '@/lib/trpc/client';
import { toast } from 'sonner';

interface CreateOrderButtonProps {
  items: Array<{ productId: number; quantity: number }>;
}

export function CreateOrderButton({ items }: CreateOrderButtonProps) {
  const utils = trpc.useUtils();

  const createOrder = trpc.order.create.useMutation({
    onSuccess: (newOrder) => {
      // Invalidar cache de órdenes
      utils.order.getOrders.invalidate();
      toast.success(`Orden #${newOrder.id} creada`);
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  return (
    <button
      onClick={() => createOrder.mutate({ items })}
      disabled={createOrder.isPending}
    >
      {createOrder.isPending ? 'Creando...' : 'Crear Orden'}
    </button>
  );
}
```

---

## Ejemplo Completo: OrderService

### Archivos creados

```
src/
├── types/
│   ├── index.ts              ✅ Actualizado
│   └── order.types.ts        ✅ Creado
├── services/
│   ├── index.ts              ✅ Actualizado
│   └── order/
│       ├── order.service.ts  ✅ Creado
│       └── order.mapper.ts   ✅ Creado
└── server/
    └── trpc/
        └── routers/
            ├── index.ts      ✅ Actualizado
            └── order.router.ts ✅ Creado
```

---

## Checklist

### Tipos
- [ ] Crear `src/types/[domain].types.ts`
- [ ] Importar tipos base de `api.types.ts` (`ApiPagination`, `PaginatedResponse`, etc.)
- [ ] Definir modelos de dominio (camelCase)
- [ ] Definir modelos de API (snake_case con sufijo `ApiModel`)
- [ ] Definir respuestas de API (sufijo `ApiResponse`)
- [ ] Definir DTOs de request (sufijo `Dto`)
- [ ] Definir params de query (sufijo `Params`, extendiendo `PaginationParams`)
- [ ] Definir wrappers de respuesta usando `PaginatedResponse<T>`
- [ ] Actualizar `src/types/index.ts`

### Mapper
- [ ] Crear `src/services/[domain]/[domain].mapper.ts`
- [ ] Implementar mappers de respuesta (API → Domain)
- [ ] Implementar mappers de request (Domain → API) si hay mutations
- [ ] Manejar null/undefined correctamente
- [ ] Validar enums con fallbacks

### Servicio
- [ ] Crear `src/services/[domain]/[domain].service.ts`
- [ ] Extender `BaseService`
- [ ] Definir `basePath` privado
- [ ] Implementar queries usando `this.http.get()`
- [ ] Implementar mutations usando `this.http.post/patch/delete()`
- [ ] Usar `this.buildPaginationParams()` o `this.buildQueryParams()`
- [ ] Usar `this.mapPagination()` para respuestas paginadas
- [ ] Aplicar mappers a todas las respuestas
- [ ] Pasar `context` a todas las llamadas
- [ ] Documentar con JSDoc
- [ ] Actualizar `src/services/index.ts`

### Router tRPC
- [ ] Crear `src/server/trpc/routers/[domain].router.ts`
- [ ] Definir schemas Zod para inputs
- [ ] Usar `publicProcedure` o `protectedProcedure` según corresponda
- [ ] Pasar `ctx.requestContext` a los servicios
- [ ] Exportar tipo del router
- [ ] Actualizar `src/server/trpc/routers/index.ts`

### Verificación
- [ ] Ejecutar `pnpm tsc --noEmit` sin errores
- [ ] Probar query desde Server Component
- [ ] Probar query desde Client Component
- [ ] Probar mutations si aplica

---

## Troubleshooting

### "Cannot find module '@/services'"

**Causa**: Servicio no exportado en el índice.
**Solución**: Verificar `src/services/index.ts`.

### "Type 'X' is not assignable to type 'Y'"

**Causa**: Mismatch entre tipos API y dominio.
**Solución**: Revisar mapper, verificar todos los campos mapeados.

### Error 404 en llamadas

**Causa**: Path incorrecto.
**Solución**:
1. Verificar `basePath` en el servicio
2. Verificar `API_BASE_URL` en `.env.local`
3. Agregar logs en `HttpClient`:

```typescript
if (process.env.NODE_ENV === 'development') {
  console.log('[HttpClient]', { url, method });
}
```

### "UNAUTHORIZED" en protectedProcedure

**Causa**: Usuario no autenticado.
**Solución**:
1. Verificar login
2. Verificar configuración de Clerk
3. Verificar que el contexto tiene `authToken`

### Datos no se actualizan después de mutation

**Causa**: Cache no invalidado.
**Solución**:

```typescript
const utils = trpc.useUtils();

const mutation = trpc.order.create.useMutation({
  onSuccess: () => {
    utils.order.getOrders.invalidate();
  },
});
```

### Paginación no funciona

**Causa**: Params no transformados a snake_case.
**Solución**: Usar `this.buildPaginationParams()`:

```typescript
// ❌ Incorrecto
params: { page, perPage }

// ✅ Correcto
params: this.buildPaginationParams({ page, perPage })
// Resultado: { page, per_page }
```

---

## Recursos

- [tRPC Documentation](https://trpc.io/docs)
- [Zod Documentation](https://zod.dev)
- [TanStack Query](https://tanstack.com/query/latest)
- [Next.js App Router](https://nextjs.org/docs/app)