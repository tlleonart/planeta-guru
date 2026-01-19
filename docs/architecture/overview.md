# Vision General de la Arquitectura

## Descripcion del Sistema

Planeta Guru es una aplicacion web de comercio electronico especializada en contenido digital para el mercado latinoamericano y sudafricano. La aplicacion permite a los usuarios:

- Navegar y comprar juegos (HTML5, WebGL, claves de juego)
- Adquirir tarjetas de regalo
- Suscribirse a servicios
- Gestionar su billetera de GURUs (moneda virtual)
- Recargar GURUs mediante diversos metodos de pago

## Arquitectura de Alto Nivel

```
+------------------+     +------------------+     +------------------+
|                  |     |                  |     |                  |
|  Cliente/Browser | --> |   Next.js App    | --> |   Backend API    |
|                  |     |   (App Router)   |     |   (Laravel)      |
+------------------+     +------------------+     +------------------+
                               |
                               v
                         +------------------+
                         |                  |
                         |  Clerk Auth      |
                         |                  |
                         +------------------+
```

## Capas de la Aplicacion

### 1. Capa de Presentacion (Componentes)

```
src/app/[locale]/          # Rutas Next.js
src/modules/*/             # Componentes por modulo
src/components/ui/         # Componentes UI reutilizables
```

- **Server Components (RSC)**: ~80% de componentes, renderizado en servidor
- **Client Components**: Para interactividad, hooks, browser APIs
- **Patron Client Islands**: Componentes cliente pequenos envueltos en Server Components

### 2. Capa de API (tRPC)

```
src/app/server/routers/    # Routers tRPC
src/app/server/trpc/       # Configuracion tRPC
```

- APIs type-safe con validacion Zod
- Inyeccion automatica de contexto (auth, locale)
- Procedures publicos y protegidos

### 3. Capa de Servicios

```
src/modules/shared/services/   # Servicios compartidos
src/modules/*/services/        # Servicios especificos de modulo
```

- Extienden `BaseService`
- Encapsulan logica de negocio
- Llaman al HttpClient

### 4. Capa HTTP

```
src/modules/http/
  ├── http-client.ts       # Cliente HTTP con Axios
  ├── base-service.ts      # Clase base para servicios
  ├── types.ts             # Tipos de request/response
  └── helpers.ts           # Utilidades para cookies/headers
```

- Inyeccion automatica de headers
- Manejo de autenticacion
- Transformacion de datos

### 5. Capa de Datos (Mappers)

```
src/modules/shared/mappers/    # Mappers compartidos
src/modules/*/mappers/         # Mappers especificos
```

- Transforman snake_case (API) a camelCase (dominio)
- Tipado fuerte con modelos ApiModel y dominio

## Flujo de Request Tipico

```
1. Usuario navega a /mx-es/products/game-key/fifa-24

2. Next.js Router
   ├── Extrae locale (mx-es) → country: mx, language: es
   └── Renderiza page.tsx como Server Component

3. Server Component
   └── Llama a api.product.getBySlug({ slug: 'fifa-24' })

4. tRPC Router (product-router.ts)
   ├── Valida input con Zod
   ├── Obtiene RequestContext (auth, country, language)
   └── Llama a ProductService.getBySlug()

5. ProductService
   └── Llama a this.http.get('/products/game-key/fifa-24')

6. HttpClient
   ├── Inyecta headers: Selected-Country, Selected-Language, Authorization
   └── Hace request a NEXT_PUBLIC_API_BASE_URL

7. Respuesta del Backend
   └── Devuelve JSON con datos en snake_case

8. ProductMapper
   └── Transforma snake_case a camelCase

9. Respuesta final al componente
   └── Objeto Product tipado para renderizar
```

## Patrones Clave

### Server Components por Defecto

```typescript
// src/modules/products/game-key/game-key-page.tsx
export const GameKeyPage: FC<Props> = async ({ slug }) => {
  // Data fetching directo en el servidor
  const product = await api.product.getGameKey({ slug });

  return (
    <main>
      <ProductHeader {...product} />
      {/* Client Island para interactividad */}
      <BuyButton productId={product.id} />
    </main>
  );
};
```

### Inyeccion de Contexto

```typescript
// El contexto se inyecta automaticamente en cada request tRPC
export const createTRPCContext = async () => {
  const { userId, getToken } = await auth();
  const requestContext = await getRequestContext();

  return {
    userId,
    auth: { userId, getToken },
    requestContext, // { authToken, selectedCountry, selectedLanguage }
  };
};
```

### Servicios con BaseService

```typescript
// src/modules/shared/services/product-service.ts
class ProductService extends BaseService {
  async getBySlug(slug: string, ctx: RequestContext) {
    const response = await this.http.get<ProductApiResponse>(
      `/products/${slug}`,
      { context: ctx }
    );
    return mapProduct(response.data.product);
  }
}
```

## Consideraciones de Rendimiento

1. **Server Components**: Reducen JavaScript enviado al cliente
2. **Streaming**: Suspense boundaries para carga progresiva
3. **Caching**: Next.js cache con revalidacion
4. **Code Splitting**: Dynamic imports para modulos grandes
5. **Image Optimization**: next/image para imagenes optimizadas

## Seguridad

1. **Autenticacion**: Clerk maneja tokens JWT
2. **Autorizacion**: Procedures protegidos en tRPC
3. **Headers**: Inyeccion automatica de Platform-Key
4. **Validacion**: Zod valida todos los inputs
5. **CSRF**: Proteccion integrada en Next.js
