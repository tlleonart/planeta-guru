# Flujo de Datos

## Vision General

Este documento describe como fluyen los datos en la aplicacion Planeta Guru, desde la interaccion del usuario hasta la respuesta del backend.

## Diagrama de Flujo General

```
+-------------------+
|   Browser/User    |
+-------------------+
         |
         | 1. Request HTTP
         v
+-------------------+
|  Next.js Router   |
|   (App Router)    |
+-------------------+
         |
         | 2. Extrae locale, renderiza page.tsx
         v
+-------------------+
| Server Component  |
|    (RSC)          |
+-------------------+
         |
         | 3. api.router.method()
         v
+-------------------+
|   tRPC Router     |
+-------------------+
         |
         | 4. Valida input, obtiene contexto
         v
+-------------------+
|    Service        |
|   (BaseService)   |
+-------------------+
         |
         | 5. this.http.get/post()
         v
+-------------------+
|   HttpClient      |
|    (Axios)        |
+-------------------+
         |
         | 6. Request con headers
         v
+-------------------+
|   Backend API     |
|    (Laravel)      |
+-------------------+
         |
         | 7. Response JSON (snake_case)
         v
+-------------------+
|     Mapper        |
+-------------------+
         |
         | 8. Transforma a dominio (camelCase)
         v
+-------------------+
|  Response Final   |
|   (Tipada)        |
+-------------------+
```

## Flujo Detallado: Server Component

### Ejemplo: Obtener Producto por Slug

```typescript
// 1. Usuario navega a /mx-es/products/game-key/fifa-24

// 2. Next.js renderiza el page.tsx
// src/app/[locale]/(root)/products/game-key/[slug]/page.tsx
export default async function GameKeyRoute({
  params,
}: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  return <GameKeyPage slug={slug} />;
}

// 3. Server Component llama a la API
// src/modules/products/game-key/game-key-page.tsx
export const GameKeyPage: FC<Props> = async ({ slug }) => {
  const product = await api.product.getGameKey({ slug });
  return <ProductContent product={product} />;
};
```

### Flujo Interno tRPC → Service → HTTP

```typescript
// 4. tRPC Router valida y obtiene contexto
// src/app/server/routers/product-router.ts
export const productRouter = createTRPCRouter({
  getGameKey: publicProcedure
    .input(z.object({ slug: z.string() }))
    .query(async ({ input, ctx }) => {
      // ctx.requestContext tiene country, language, authToken
      return productService.getGameKey(input.slug, ctx.requestContext);
    }),
});

// 5. Service llama a HttpClient
// src/modules/shared/services/product-service.ts
class ProductService extends BaseService {
  async getGameKey(slug: string, ctx: RequestContext) {
    const response = await this.http.get<GameKeyApiResponse>(
      `/products/game-key/${slug}`,
      { context: ctx }
    );
    return mapGameKey(response.data.product);
  }
}

// 6. HttpClient construye request con headers
// src/modules/http/http-client.ts
async get<T>(url: string, options?: RequestOptions): Promise<HttpResponse<T>> {
  const headers = this.buildHeaders(options?.context);
  // Headers: Selected-Country, Selected-Language, Authorization, Platform-Key

  const response = await this.client.get(url, { headers, ...options });
  return response;
}

// 7. Backend responde con JSON
{
  "product": {
    "id": 123,
    "name": "FIFA 24",
    "product_type": "game_key",
    "base_price": 1000,
    "discount_percentage": 10,
    "system_requirements": { ... }
  }
}

// 8. Mapper transforma a dominio
function mapGameKey(api: GameKeyApiModel): GameKey {
  return {
    id: api.id,
    name: api.name,
    productType: api.product_type,
    basePrice: api.base_price,
    discountPercentage: api.discount_percentage,
    systemRequirements: mapSystemRequirements(api.system_requirements),
  };
}
```

## Flujo Detallado: Client Component

### Ejemplo: Favorito Toggle

```typescript
// 1. Usuario hace click en boton de favorito

// 2. Client Component usa hook de tRPC
"use client";

export const FavoriteButton: FC<Props> = ({ productId, initialIsFavorite }) => {
  const utils = trpc.useUtils();

  const toggleFavorite = trpc.favorites.toggle.useMutation({
    onSuccess: () => {
      utils.favorites.list.invalidate();
    },
  });

  const handleClick = () => {
    toggleFavorite.mutate({ productId });
  };

  return (
    <Button onClick={handleClick} disabled={toggleFavorite.isPending}>
      {/* ... */}
    </Button>
  );
};

// 3. tRPC Mutation (protegida)
// src/app/server/routers/favorites-router.ts
export const favoritesRouter = createTRPCRouter({
  toggle: protectedProcedure
    .input(z.object({ productId: z.number() }))
    .mutation(async ({ input, ctx }) => {
      // ctx.userId esta disponible por protectedProcedure
      return favoritesService.toggle(input.productId, ctx.requestContext);
    }),
});

// 4. Service hace POST al backend
class FavoritesService extends BaseService {
  async toggle(productId: number, ctx: RequestContext) {
    const response = await this.http.post<ToggleFavoriteResponse>(
      "/favorites/toggle",
      { product_id: productId },
      { context: ctx }
    );
    return response.data;
  }
}
```

## RequestContext

El RequestContext es fundamental para todas las llamadas al backend:

```typescript
interface RequestContext {
  authToken?: string;        // Token JWT de Clerk
  selectedCountry?: string;  // Codigo de pais (mx, ar, za, etc.)
  selectedLanguage?: string; // Codigo de idioma (es, en)
  msisdn?: string;           // Numero de telefono (para telcos)
}
```

### Obtencion del Contexto

```typescript
// src/modules/http/helpers.ts
export async function getRequestContext(): Promise<RequestContext> {
  const cookieStore = await cookies();
  const { getToken } = await auth();

  return {
    authToken: await getToken(),
    selectedCountry: cookieStore.get("selectedCountry")?.value,
    selectedLanguage: cookieStore.get("selectedLanguage")?.value,
    msisdn: cookieStore.get("msisdn")?.value,
  };
}

// Usado en el contexto tRPC
// src/app/server/trpc/context.ts
export const createTRPCContext = async () => {
  const { userId, getToken } = await auth();
  const requestContext = await getRequestContext();

  return {
    userId,
    auth: { userId, getToken },
    requestContext,
  };
};
```

## Tipos de Datos

### Modelos de API (snake_case)

```typescript
// src/modules/shared/types/product-types.ts
interface ProductApiModel {
  id: number;
  name: string;
  product_type: string;
  base_price: number;
  discount_percentage: number;
  created_at: string;
}
```

### Modelos de Dominio (camelCase)

```typescript
interface Product {
  id: number;
  name: string;
  productType: string;
  basePrice: number;
  discountPercentage: number;
  createdAt: string;
}
```

### Mappers

```typescript
// src/modules/shared/mappers/product-mapper.ts
export function mapProduct(api: ProductApiModel): Product {
  return {
    id: api.id,
    name: api.name,
    productType: api.product_type,
    basePrice: api.base_price,
    discountPercentage: api.discount_percentage,
    createdAt: api.created_at,
  };
}
```

## Manejo de Errores

### En Servicios

```typescript
class ProductService extends BaseService {
  async getBySlug(slug: string, ctx: RequestContext) {
    try {
      const response = await this.http.get<ProductApiResponse>(
        `/products/${slug}`,
        { context: ctx }
      );
      return mapProduct(response.data.product);
    } catch (error) {
      if (axios.isAxiosError(error) && error.response?.status === 404) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Product not found",
        });
      }
      throw error;
    }
  }
}
```

### En Componentes

```typescript
// Server Component
export const ProductPage: FC<Props> = async ({ slug }) => {
  try {
    const product = await api.product.getBySlug({ slug });
    return <ProductContent product={product} />;
  } catch (error) {
    notFound(); // Next.js 404
  }
};

// Client Component
export const ProductList: FC = () => {
  const { data, error, isLoading } = trpc.product.list.useQuery();

  if (isLoading) return <Loading />;
  if (error) return <Error message={error.message} />;
  return <List items={data} />;
};
```

## Caching y Revalidacion

### Next.js Cache

```typescript
// Configurar revalidacion en el fetch
const response = await this.http.get<ProductApiResponse>(url, {
  context: ctx,
  next: { revalidate: 3600 }, // Cache por 1 hora
});
```

### Invalidacion con TanStack Query

```typescript
const utils = trpc.useUtils();

// Invalidar cache especifico
utils.product.getBySlug.invalidate({ slug: "fifa-24" });

// Invalidar todos los productos
utils.product.invalidate();
```

## Estado Global con Zustand

Para estado que necesita ser compartido entre componentes:

```typescript
// src/modules/shared/stores/modal-store.ts
interface ModalStore {
  activeModal: string | null;
  modalProps: Record<string, unknown>;
  openModal: (modal: string, props?: Record<string, unknown>) => void;
  closeModal: () => void;
}

export const useModalStore = create<ModalStore>((set) => ({
  activeModal: null,
  modalProps: {},
  openModal: (modal, props = {}) => set({ activeModal: modal, modalProps: props }),
  closeModal: () => set({ activeModal: null, modalProps: {} }),
}));
```

## URL State con nuqs

Para estado que debe sincronizarse con la URL:

```typescript
"use client";
import { useQueryState, parseAsString } from "nuqs";

export const useSearchParams = () => {
  const [query, setQuery] = useQueryState(
    "q",
    parseAsString.withDefault("").withOptions({ clearOnDefault: true })
  );

  const [page, setPage] = useQueryState(
    "page",
    parseAsInteger.withDefault(1).withOptions({ clearOnDefault: true })
  );

  return { query, setQuery, page, setPage };
};
```
