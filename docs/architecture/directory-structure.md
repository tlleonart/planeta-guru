# Estructura de Directorios

## Vista General

```
planeta-guru/
├── docs/                      # Documentacion del proyecto
├── messages/                  # Archivos de traduccion i18n
│   ├── en.json               # Traducciones en ingles
│   └── es.json               # Traducciones en espanol
├── public/                    # Assets estaticos
├── src/
│   ├── app/                  # Next.js App Router
│   ├── components/           # Componentes UI compartidos
│   └── modules/              # Modulos por feature
├── tests/                    # Tests unitarios y E2E
├── .env.local                # Variables de entorno locales
├── biome.json                # Configuracion de Biome
├── next.config.ts            # Configuracion de Next.js
├── package.json              # Dependencias y scripts
├── playwright.config.ts      # Configuracion de Playwright
├── tailwind.config.ts        # Configuracion de Tailwind
├── tsconfig.json             # Configuracion de TypeScript
└── vitest.config.ts          # Configuracion de Vitest
```

## Directorio `/src/app`

```
src/app/
├── [locale]/                  # Rutas con locale dinamico
│   ├── (auth)/               # Grupo de rutas de autenticacion
│   │   └── auth/
│   │       ├── complete-subscription/
│   │       ├── sign-in/[[...sign-in]]/
│   │       └── sign-up/[[...sign-up]]/
│   ├── (root)/               # Grupo de rutas principales
│   │   ├── account/
│   │   ├── categories/
│   │   │   └── [id]/
│   │   ├── charge-gurus/
│   │   │   └── payments/[...pack]/
│   │   ├── faq/
│   │   ├── help/
│   │   ├── home/
│   │   ├── landings/vgl/
│   │   ├── privacy/
│   │   ├── products/
│   │   │   ├── game-html/[slug]/
│   │   │   ├── game-key/[slug]/
│   │   │   ├── games-view/[slug]/
│   │   │   ├── gift-card/[slug]/
│   │   │   └── subscription/[slug]/
│   │   ├── profile/
│   │   │   ├── downloads/
│   │   │   └── favorites/
│   │   ├── search/[query]/
│   │   └── welcome/
│   ├── layout.tsx            # Layout con providers
│   └── page.tsx              # Redirect a home
├── api/
│   └── trpc/[trpc]/          # Handler de tRPC
├── server/                    # Codigo server-side
│   ├── routers/              # Routers tRPC
│   ├── server.ts             # Caller de API server-side
│   └── trpc/                 # Configuracion tRPC
├── globals.css               # Estilos globales
├── layout.tsx                # Root layout
└── not-found.tsx             # Pagina 404
```

## Directorio `/src/modules`

Cada modulo contiene codigo relacionado a una feature especifica.

```
src/modules/
├── account/                   # Modulo de cuenta de usuario
│   ├── components/
│   ├── services/
│   └── account-page.tsx
│
├── auth/                      # Modulo de autenticacion
│   ├── components/
│   ├── complete-subscription-page.tsx
│   ├── sign-in-page.tsx
│   └── sign-up-page.tsx
│
├── categories/                # Modulo de categorias
│   ├── components/
│   ├── categories-page.tsx
│   └── category-page.tsx
│
├── charge-gurus/              # Modulo de recarga de GURUs
│   ├── actions/              # Server Actions
│   ├── components/
│   ├── services/
│   ├── charge-gurus-page.tsx
│   └── payment-detail-page.tsx
│
├── faq/                       # Modulo de FAQ
│   ├── components/
│   └── faq-page.tsx
│
├── help/                      # Modulo de ayuda
│   └── help-page.tsx
│
├── home/                      # Modulo de pagina principal
│   ├── components/
│   └── home-page.tsx
│
├── http/                      # Cliente HTTP y utilidades
│   ├── base-service.ts
│   ├── helpers.ts
│   ├── http-client.ts
│   ├── trpc-client.ts
│   └── types.ts
│
├── landings/                  # Landing pages
│   └── vodacom/
│
├── privacy/                   # Modulo de privacidad
│   └── privacy-page.tsx
│
├── products/                  # Modulos de productos
│   ├── game-html/
│   ├── game-key/
│   ├── game-webgl/
│   ├── gift-card/
│   └── subscription/
│
├── profile/                   # Modulo de perfil
│   ├── components/
│   ├── downloads-page.tsx
│   ├── favorites-page.tsx
│   └── profile-page.tsx
│
├── search/                    # Modulo de busqueda
│   ├── components/
│   └── search-page.tsx
│
└── shared/                    # Codigo compartido
    ├── components/
    │   ├── layout/           # Header, Footer, Sidebar
    │   ├── modals/           # Sistema de modales
    │   ├── products/         # Cards de productos
    │   └── ui/               # Componentes UI base
    ├── hooks/
    ├── mappers/              # Transformadores API → Dominio
    ├── services/             # Servicios compartidos
    ├── stores/               # Stores de Zustand
    ├── types/                # Tipos TypeScript
    └── utils/                # Utilidades
```

## Directorio `/src/components`

Componentes UI primitivos reutilizables (basados en Radix UI).

```
src/components/
└── ui/
    ├── button.tsx
    ├── card.tsx
    ├── dialog.tsx
    ├── dropdown-menu.tsx
    ├── form.tsx
    ├── input.tsx
    ├── label.tsx
    └── ... otros componentes UI
```

## Directorio `/tests`

```
tests/
├── e2e/                       # Tests End-to-End con Playwright
│   ├── charge-gurus.spec.ts
│   └── navigation.spec.ts
├── mocks/                     # Mocks para MSW
│   ├── handlers.ts
│   └── server.ts
├── unit/                      # Tests unitarios con Vitest
│   └── mappers/
│       ├── legals-mapper.test.ts
│       ├── pack-mapper.test.ts
│       └── wallet-mapper.test.ts
├── setup.ts                   # Setup de tests
└── tsconfig.json              # Config TS para tests
```

## Convenciones de Nombrado

### Archivos

| Tipo | Convencion | Ejemplo |
|------|------------|---------|
| Componentes | kebab-case | `product-card.tsx` |
| Paginas modulo | kebab-case + page | `home-page.tsx` |
| Servicios | kebab-case + service | `product-service.ts` |
| Mappers | kebab-case + mapper | `product-mapper.ts` |
| Tipos | kebab-case + types | `product-types.ts` |
| Hooks | camelCase | `useModal.ts` |
| Stores | kebab-case + store | `modal-store.ts` |
| Tests | kebab-case + test | `product-mapper.test.ts` |

### Exports

| Tipo | Convencion | Ejemplo |
|------|------------|---------|
| Componentes | PascalCase | `ProductCard` |
| Hooks | camelCase con use | `useModal` |
| Servicios | PascalCase | `ProductService` |
| Funciones mapper | camelCase con map | `mapProduct` |
| Tipos/Interfaces | PascalCase | `Product`, `ProductApiModel` |
| Constantes | SCREAMING_SNAKE | `API_BASE_URL` |
