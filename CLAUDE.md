# CLAUDE.md

Este archivo proporciona orientación a Claude Code (claude.ai/code) al trabajar con código en este repositorio.

## Visión General del Proyecto

Planeta Guru es una aplicación Next.js 16 construida con App Router, que incluye:
- Soporte multi-locale (21 países latinoamericanos + Sudáfrica, idiomas en/es)
- Autenticación con Clerk
- Capa API con tRPC y TanStack Query
- Estilos con Tailwind CSS 4
- Linting y formateo con Biome

**Contexto de Migración**: Este proyecto (`planeta-guru`) es una migración modernizada desde la versión legacy (`planeta_guru_v3`). **La migración está COMPLETA**. Todos los módulos principales han sido migrados siguiendo patrones modernos de Next.js 16.

## Módulos Migrados

### ✅ Productos (Fase A)
- **Game HTML** (`/products/game-html/[slug]`) - Juegos HTML5 con iframe y controles fullscreen
- **Game Key** (`/products/game-key/[slug]`) - Claves de juegos con requisitos de sistema y tablas de idiomas
- **Games View/WebGL** (`/products/games-view/[slug]`) - Juegos WebGL con soporte fullscreen
- **Gift Card** (`/products/gift-card/[slug]`) - Tarjetas regalo con múltiples bundles y exclusividad regional
- **Subscription** (`/products/subscription/[slug]`) - Suscripciones con múltiples opciones de pago
- **Combo** (`/products/combo/[slug]`) - Productos combo con pago directo vía MercadoPago (no usa gurus)

### ✅ Charge Gurus (Fase B)
- **Payments** (`/charge-gurus`) - Lista de packs de gurús con card de suscripción
- **Payment Detail** (`/charge-gurus/payments/[...pack]`) - Selección de método de pago y procesamiento con MercadoPago

### ✅ Info Pages (Fase C)
- **FAQ** (`/faq`) - Preguntas frecuentes con acordeón interactivo
- **Privacy** (`/privacy`) - Política de privacidad formateada
- **Welcome** (`/welcome`) - Página de bienvenida (reutiliza Help)

### ✅ Account (Fase D)
- **Account** (`/account`) - Perfil de usuario con suscripción telco y wallet

## Comandos de Desarrollo

```bash
# Desarrollo
npm run dev              # Inicia servidor de desarrollo Next.js en http://localhost:3000

# Build y Producción
npm run build            # Crea build de producción con output standalone
npm start                # Inicia servidor de producción

# Calidad de Código
npm run lint             # Ejecuta Biome linter (verifica código)
npm run format           # Formatea código con Biome
```

**Nota**: Este proyecto usa Biome en lugar de ESLint/Prettier. Siempre ejecutar `npm run lint` antes de commitear.

## Arquitectura

### Estructura Basada en Módulos

El codebase usa organización de módulos por features bajo `src/modules/`:

```
src/modules/
├── account/           # Módulo de cuenta con suscripción telco
├── auth/              # Flujos de autenticación (sign-in, sign-up, subscription)
├── categories/        # Navegación de categorías
├── charge-gurus/      # Funcionalidad de recarga de gurús y pagos
├── faq/               # Preguntas frecuentes
├── help/              # Páginas de ayuda
├── home/              # Componentes de página principal
├── http/              # Cliente HTTP y servicio base
├── landings/          # Landing pages (vodacom, etc.)
├── privacy/           # Política de privacidad
├── products/          # Módulos de productos (game-html, game-key, webgl, gift-card, subscription, combo)
├── profile/           # Perfil de usuario, descargas, favoritos
├── search/            # Funcionalidad de búsqueda
└── shared/            # Tipos, servicios, mappers, componentes compartidos
```

Cada módulo contiene sus propios componentes, hooks y lógica. Las rutas se definen en `src/app/[locale]/` y consumen estos módulos.

### ⚠️ IMPORTANTE: Sistema de Enrutado con Locale

**CAMBIO CRÍTICO EN LA MIGRACIÓN**: El nuevo proyecto implementa un sistema de enrutado basado en país e idioma que **afecta directamente las llamadas a la API**.

#### Formato de Locale

- **Formato**: `{country}-{language}` (ej: `mx-es`, `ar-en`, `za-en`)
- **Locale por defecto**: `mx-es` (México, Español)
- **Locales soportados**: 42 totales (21 países × 2 idiomas)

#### Países Soportados

```
América Latina (21 países):
- mx (México), ar (Argentina), cl (Chile), co (Colombia), pe (Perú)
- ec (Ecuador), ve (Venezuela), bo (Bolivia), py (Paraguay), uy (Uruguay)
- cr (Costa Rica), pa (Panamá), gt (Guatemala), hn (Honduras), sv (El Salvador)
- ni (Nicaragua), do (República Dominicana), cu (Cuba), pr (Puerto Rico)
- ht (Haití), jm (Jamaica)

África:
- za (Sudáfrica)
```

#### Idiomas

- `es`: Español
- `en`: Inglés

#### Estructura de Rutas

```
TODAS las rutas públicas DEBEN incluir el locale:

✅ Correcto:
/mx-es
/mx-es/categories
/ar-en/profile
/za-en/help

❌ Incorrecto:
/
/categories
/profile
```

#### Flujo de Locale a Headers de API

**CRÍTICO**: El sistema extrae país e idioma de la URL y los convierte en headers de API a través del siguiente flujo:

```
URL: /ar-es/categories
        ↓
   proxy.ts (extrae locale de URL)
        ↓
   Cookies: selectedCountry=AR, selectedLanguage=es
        ↓
   tRPC Context (lee cookies)
        ↓
   HttpClient (inyecta headers)
        ↓
   Headers enviados al backend:
     - Selected-Country: AR
     - Selected-Language: es
     - Platform-Key: [valor de env]
     - Authorization: [token de Clerk si está autenticado]
```

#### Proxy.ts - Extracción de Locale

El archivo `src/proxy.ts` es responsable de:
1. Manejar el routing de i18n con next-intl
2. **Extraer país/idioma de la URL** y setear cookies
3. Proteger rutas que requieren autenticación

```typescript
// src/proxy.ts - Extracción de locale
const localeMatch = pathname.match(/^\/([a-z]{2})-([a-z]{2})(\/|$)/i);
if (localeMatch) {
  const country = localeMatch[1].toUpperCase(); // AR, MX, etc.
  const language = localeMatch[2].toLowerCase(); // es, en

  response.cookies.set("selectedCountry", country, { ... });
  response.cookies.set("selectedLanguage", language, { ... });
}
```

**IMPORTANTE**: Sin esta extracción en proxy.ts, las cookies no se setean y las llamadas a la API usan valores por defecto (MX/es), causando que productos específicos de otros países no aparezcan.

**Estos headers son OBLIGATORIOS** para que el backend Laravel devuelva:
- Contenido en el idioma correcto
- Precios en la moneda del país
- Productos disponibles para ese país
- Configuraciones específicas del país

#### Configuración de Mensajes i18n

- **Archivos de mensajes**: `/messages/` (`en.json`, `es.json`)
- **Todas las páginas** están bajo `src/app/[locale]/`
- **Grupos de rutas**:
  - `(auth)`: Páginas de autenticación con layout mínimo
  - `(root)`: Páginas principales de la app con navegación/footer completos

### Arquitectura en Capas

La app sigue una arquitectura estricta en capas para comunicación con la API:

```
Componente (RSC/Client)
    ↓
tRPC Router (validación, auth)
    ↓
Capa de Servicio (lógica de negocio)
    ↓
HttpClient (inyecta headers automáticamente)
    ↓
API Externa (backend Laravel)
    ↓
Mapper (snake_case → camelCase)
    ↓
Respuesta Tipada (modelos de dominio)
```

#### Principios Clave:

1. **Flujo de Request Context**: Todas las llamadas a la API requieren `RequestContext` que contiene:
   - `authToken` (de Clerk) - Opcional, solo para usuarios autenticados
   - `selectedCountry` (de cookie, extraído del locale de URL) - **OBLIGATORIO**
   - `selectedLanguage` (de cookie, extraído del locale de URL) - **OBLIGATORIO**
   - `msisdn` (de cookie, opcional) - Para operadores móviles

2. **Convenciones de Tipos**:
   - Modelos de dominio: camelCase (ej: `Product`, `userId`)
   - Modelos de API: snake_case con sufijo `ApiModel` (ej: `ProductApiModel`, `user_id`)
   - Respuestas de API: sufijo `ApiResponse`
   - Parámetros de query: sufijo `Params`, extienden `PaginationParams`
   - DTOs de request: sufijo `Dto`

3. **Patrón de Servicio**: Todos los servicios extienden `BaseService` y obtienen acceso a:
   - `this.http` - Instancia de HttpClient
   - `this.mapPagination()` - Convertir paginación de API a dominio
   - `this.buildQueryParams()` - Convertir params camelCase a snake_case
   - `this.buildPaginationParams()` - Construir params de paginación
   - `this.buildSortParams()` - Construir params de ordenamiento

### Agregar Nuevos Endpoints de API

Ver la guía completa en [src/modules/shared/services/README.md](src/modules/shared/services/README.md) para instrucciones paso a paso. El proceso involucra:

1. Definir tipos en `src/modules/shared/types/[domain]-types.ts`
2. Crear mappers en carpeta de servicio (ej: `src/modules/[domain]/services/[domain]-mapper.ts`)
3. Crear servicio extendiendo `BaseService` (ej: `src/modules/[domain]/services/[domain]-service.ts`)
4. Exportar desde índice del servicio
5. Crear router tRPC en `src/app/server/routers/[domain]-router.ts`
6. Registrar router en `src/app/server/routers/index.ts`
7. Usar en componentes vía `api.[domain].[method]()` (RSC) o `trpc.[domain].[method].useQuery()` (client)

### Autenticación

Usa Clerk con protección por middleware:
- Estado de auth gestionado vía helper `auth()` de Clerk
- Token inyectado automáticamente en requests de API vía contexto tRPC
- Procedures protegidos en tRPC validan userId de Clerk
- Páginas de sign-in/sign-up en `/auth/sign-in` y `/auth/sign-up`

### Configuración de tRPC

**Server-side (RSC)**:
```typescript
import { api } from '@/app/server/server';

const data = await api.product.getBySlug({ slug: 'example' });
```

**Client-side**:
```typescript
'use client';
import { trpc } from '@/modules/http/trpc-client';

const { data, isLoading } = trpc.product.getBySlug.useQuery({ slug: 'example' });
```

El contexto de tRPC (`src/app/server/trpc/context.ts`) inyecta automáticamente:
- Request context con country/language/auth desde cookies:
  - `selectedCountry` (cookie) → `Selected-Country` (header)
  - `selectedLanguage` (cookie) → `Selected-Language` (header)
- Objeto auth de Clerk
- User ID si está autenticado

**Nota**: Las cookies son seteadas por `proxy.ts` al extraer el locale de la URL.

### Aliases de Path

- `@/*` → `src/*`
- `@/public*` → `public/*`

## Variables de Entorno

Requeridas en `.env.local`:

```bash
# Clerk
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=
CLERK_SECRET_KEY=
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/auth/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/auth/sign-up

# API
NEXT_PUBLIC_BASE_API_URL=       # URL del backend API
PLATFORM_KEY=                   # Clave de autenticación de plataforma
```

## Convenciones Importantes

1. **Server vs Client Components**:
   - Usar RSC por defecto (~80% de componentes)
   - Solo agregar `'use client'` cuando sea necesario (hooks, interactividad, browser APIs)
   - Preferir data fetching server-side con Suspense
   - Patrón Client Islands: Server Component envuelve pequeños Client Components

2. **Data Fetching**:
   - RSC: Usar `api.[router].[method]()`
   - Client: Usar `trpc.[router].[method].useQuery()` o `.useMutation()`
   - Siempre manejar estados de loading/error
   - Usar boundaries de Suspense para RSC

3. **Type Safety**:
   - Nunca usar `any`
   - Importar tipos desde `@/modules/shared/types`
   - Dejar que tRPC infiera tipos desde routers

4. **Styling**:
   - Tailwind CSS 4 (nueva sintaxis @import en archivos CSS)
   - Usar clases utilitarias, evitar estilos inline
   - Librería de componentes: Radix UI primitives + estilos custom

5. **Organización de Archivos**:
   - Componentes en carpetas de módulos o subdirectorios `components/`
   - Mantener código relacionado junto (colocation)
   - Utilidades compartidas en `src/modules/shared/`

## Convenciones de Escritura de Componentes

### Componentes Fuera del Directorio `app/`

Los componentes fuera del directorio app usan sintaxis de arrow function con tipo FC:

```typescript
interface ComponentProps {
  title: string;
  description?: string;
}

export const Component: FC<ComponentProps> = ({ title, description }) => {
  return (
    <div>
      <h1>{title}</h1>
      {description && <p>{description}</p>}
    </div>
  );
};
```

### Componentes Dentro del Directorio `app/`

Los componentes de página (`page.tsx`) usan sintaxis de función tradicional y **SOLO renderizan el componente de módulo correspondiente**:

```typescript
// src/app/[locale]/(root)/home/page.tsx
export default function HomeRoute() {
  return <HomePage />;
}
```

La lógica real de la página reside en el módulo (ej: `src/modules/home/home-page.tsx`).

## Stack Tecnológico

- **Next.js 16**: https://nextjs.org/docs
- **React 19**: Server Components y Client Islands
- **Zustand**: https://zustand.docs.pmnd.rs/ (gestión de estado)
- **tRPC**: https://trpc.io/docs (APIs type-safe)
- **Zod**: Validación de schemas
- **Tailwind CSS 4**: Estilos utility-first
- **Clerk**: https://clerk.com/docs/nextjs/getting-started/quickstart (autenticación)
- **Next Intl**: https://next-intl.dev/docs/getting-started (i18n)
- **nuqs**: URL state management con Next.js App Router
- **Radix UI**: Componentes UI primitivos accesibles
- **Biome**: Formateador de código y linter (reemplaza ESLint/Prettier)

## Patrones de Implementación

### Server Components con Client Islands

```typescript
// Server Component (default)
export const ProductPage: FC = async ({ slug }) => {
  const product = await api.product.getBySlug({ slug });

  return (
    <main>
      <ProductHeader {...product} />
      {/* Client Island para interactividad */}
      <ProductInteractions
        productId={product.id}
        initialIsFavorite={product.isFavorite}
      />
    </main>
  );
};
```

### URL State Management con nuqs

```typescript
'use client';
import { useQueryState, parseAsBoolean } from 'nuqs';

export const useModal = () => {
  const [isOpen, setIsOpen] = useQueryState(
    'modal',
    parseAsBoolean.withDefault(false).withOptions({ clearOnDefault: true })
  );

  return { isOpen, open: () => setIsOpen(true), close: () => setIsOpen(false) };
};
```

### Server Actions

```typescript
'use server';

export const gurusPaymentAction = async (paymentMethod: PaymentMethod) => {
  const headersList = await headers();
  const { userId, getToken } = await auth();

  // Procesar pago...
  return response;
};
```

## Módulo Combo

El módulo Combo (`src/modules/products/combo/`) implementa productos tipo combo que se pagan directamente con MercadoPago (no utilizan gurus como moneda intermedia).

### Estructura del Módulo Combo

```
src/modules/products/combo/
├── combo-page.tsx              # Página principal (Server Component)
├── components/
│   ├── combo-banner.tsx        # Banner responsivo con imagen desktop/mobile
│   ├── combo-buy-button.tsx    # Botón de compra (Client Component)
│   ├── combo-bundles-card.tsx  # Card de bundle individual (Client Component)
│   ├── combo-bundles-grid.tsx  # Grid de bundles (Server Component)
│   ├── combo-card.tsx          # Card principal del producto (Server Component)
│   ├── combo-container.tsx     # Container con variantes banner/info
│   └── combo-skeleton.tsx      # Skeleton de carga
└── index.ts                    # Exports del módulo
```

### Flujo de Pago Combo

1. Usuario hace clic en ComboBuyButton
2. Si no está autenticado → Modal de autenticación
3. Si está autenticado → Abre ComboSummaryModal con datos del bundle
4. Usuario confirma → `comboPaymentAction` llama a `/payments/transactions/combo`
5. API retorna URL de MercadoPago → Redirección para completar pago

### Server Action para Combo

```typescript
// src/app/actions.ts
export const comboPaymentAction = async (paymentMethod: ComboPaymentMethod) => {
  // Llama a POST /payments/transactions/combo
  // Retorna { url: string } para redirección a MercadoPago
};
```

## Funcionalidades Implementadas

### Selector de País/Idioma
El header incluye un selector de país e idioma (`HeaderLanguageSelector`) implementado como un panel lateral (Sheet) que permite:
- Visualizar y seleccionar entre todos los países soportados con sus banderas
- Cambiar el idioma (Español/Inglés) en la parte inferior del panel
- Navegación automática al nuevo locale al seleccionar país o idioma

El componente usa el paquete `country-flag-icons` para mostrar las banderas de cada país.

## Testing

Para testing, consultar [TESTING.md](./TESTING.md) que contiene:
- Plan de testing completo por módulo
- Casos de prueba específicos
- Checklist de funcionalidades
- Instrucciones para testing manual y automatizado
