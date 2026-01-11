# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Planeta Guru is a Next.js 16 application built with the App Router, featuring:
- Multi-locale support (21 Latin American countries + South Africa, en/es languages)
- Clerk authentication
- tRPC API layer with TanStack Query
- Tailwind CSS 4 for styling
- Biome for linting and formatting

**Migration Context**: This project (`planeta-guru`) is a modernized migration from the legacy version (`planeta_guru_v3`). The migration is in progress. When implementing features, do not reference the legacy codebase structure unless specifically requested.

## Development Commands

```bash
# Development
npm run dev              # Start Next.js dev server on http://localhost:3000

# Build & Production
npm run build            # Create production build with standalone output
npm start                # Start production server

# Code Quality
npm run lint             # Run Biome linter (checks code)
npm run format           # Format code with Biome
```

Note: This project uses Biome instead of ESLint/Prettier. Always run `npm run lint` before committing.

## Architecture

### Module-Based Structure

The codebase uses a feature-based module organization under `src/modules/`:

```
src/modules/
├── auth/              # Authentication flows (sign-in, sign-up, subscription)
├── categories/        # Category browsing
├── charge-gurus/      # Guru charging functionality
├── help/              # Help pages
├── home/              # Home page components
├── http/              # HTTP client and base service
├── landings/          # Landing pages (vodacom, etc.)
├── profile/           # User profile, downloads, favorites
├── search/            # Search functionality
└── shared/            # Shared types, services, mappers, components
```

Each module contains its own components, hooks, and logic. Routes are defined in `src/app/[locale]/` and consume these modules.

### Layered Architecture

The app follows a strict layered architecture for API communication:

```
Component (RSC/Client)
    ↓
tRPC Router (validation, auth)
    ↓
Service Layer (business logic)
    ↓
HttpClient (auto-injects headers)
    ↓
External API (Laravel backend)
    ↓
Mapper (snake_case → camelCase)
    ↓
Typed Response (domain models)
```

#### Key Principles:

1. **Request Context Flow**: All API calls require `RequestContext` containing:
   - `authToken` (from Clerk)
   - `selectedCountry` (from cookie)
   - `selectedLanguage` (from cookie)
   - `msisdn` (from cookie, optional)

2. **Type Conventions**:
   - Domain models: camelCase (e.g., `Product`, `userId`)
   - API models: snake_case with `ApiModel` suffix (e.g., `ProductApiModel`, `user_id`)
   - API responses: `ApiResponse` suffix
   - Query params: `Params` suffix, extend `PaginationParams`
   - Request DTOs: `Dto` suffix

3. **Service Pattern**: All services extend `BaseService` and get access to:
   - `this.http` - HttpClient instance
   - `this.mapPagination()` - Convert API pagination to domain
   - `this.buildQueryParams()` - Convert camelCase params to snake_case
   - `this.buildPaginationParams()` - Build pagination params
   - `this.buildSortParams()` - Build sorting params

### Adding New API Endpoints

See the comprehensive guide at [src/modules/shared/services/README.md](src/modules/shared/services/README.md) for step-by-step instructions. The process involves:

1. Define types in `src/modules/shared/types/[domain]-types.ts`
2. Create mappers in a service folder (e.g., `src/modules/[domain]/services/[domain]-mapper.ts`)
3. Create service extending `BaseService` (e.g., `src/modules/[domain]/services/[domain]-service.ts`)
4. Export from service index
5. Create tRPC router in `src/app/server/routers/[domain]-router.ts`
6. Register router in `src/app/server/routers/index.ts`
7. Use in components via `api.[domain].[method]()` (RSC) or `trpc.[domain].[method].useQuery()` (client)

### Internationalization

The app uses `next-intl` with route-based locales:

- **Locale format**: `{country}-{language}` (e.g., `mx-es`, `ar-en`)
- **Default locale**: `mx-es` (Mexico, Spanish)
- **Supported locales**: 42 total (21 countries × 2 languages)
- **Messages**: JSON files in `/messages/` (`en.json`, `es.json`)
- **Routing**: All pages are under `src/app/[locale]/`

Two route groups exist:
- `(auth)` - Authentication pages with minimal layout
- `(root)` - Main app pages with full navigation/footer

### Authentication

Uses Clerk with middleware protection:
- Auth state managed via Clerk's `auth()` helper
- Token automatically injected into API requests via tRPC context
- Protected procedures in tRPC validate userId from Clerk
- Sign-in/sign-up pages at `/auth/sign-in` and `/auth/sign-up`

### tRPC Setup

**Server-side (RSC)**:
```typescript
import { api } from '@/app/server/trpc/server';

const data = await api.product.getAll();
```

**Client-side**:
```typescript
'use client';
import { trpc } from '@/modules/http/trpc-client';

const { data, isLoading } = trpc.product.getAll.useQuery();
```

tRPC context (`src/app/server/trpc/context.ts`) automatically injects:
- Request context with country/language/auth from cookies
- Clerk auth object
- User ID if authenticated

### Path Aliases

- `@/*` → `src/*`
- `@/public*` → `public/*`

## Environment Variables

Required in `.env.local`:

```bash
# Clerk
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=
CLERK_SECRET_KEY=
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/auth/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/auth/sign-up

# API
NEXT_PUBLIC_API_BASE_URL=       # Backend API URL
NEXT_PUBLIC_API_PLATFORM_KEY=    # Platform authentication key
```

## Important Conventions

1. **Server vs Client Components**:
   - Use RSC by default
   - Only add `'use client'` when needed (hooks, interactivity, browser APIs)
   - Prefer server-side data fetching with Suspense

2. **Data Fetching**:
   - RSC: Use `api.[router].[method]()`
   - Client: Use `trpc.[router].[method].useQuery()` or `.useMutation()`
   - Always handle loading/error states
   - Use Suspense boundaries for RSC

3. **Type Safety**:
   - Never use `any`
   - Import types from `@/modules/shared/types`
   - Let tRPC infer types from routers

4. **Styling**:
   - Tailwind CSS 4 (new @import syntax in CSS files)
   - Use utility classes, avoid inline styles
   - Component library: Radix UI primitives + custom styling

5. **File Organization**:
   - Components in module folders or `components/` subdirectories
   - Keep related code together (colocation)
   - Shared utilities in `src/modules/shared/`

## Component Writing Conventions

### Components Outside `app/` Directory

Components outside the app directory use arrow function syntax with FC type:

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

### Components Inside `app/` Directory

Page components (`page.tsx`) use traditional function syntax and **ONLY render the corresponding module component**:

```typescript
// src/app/[locale]/(root)/home/page.tsx
export default function Home() {
  return <HomePage />;
}
```

The actual page logic resides in the module (e.g., `src/modules/home/home-page.tsx`).

## Tech Stack

- **Next.js 16**: https://nextjs.org/docs
- **Zustand**: https://zustand.docs.pmnd.rs/ (state management)
- **tRPC**: https://trpc.io/docs (type-safe APIs)
- **Tailwind CSS 4**: Utility-first styling
- **Clerk**: https://clerk.com/docs/nextjs/getting-started/quickstart (authentication)
- **Next Intl**: https://next-intl.dev/docs/getting-started (i18n)
- **Biome**: Code formatter and linter (replaces ESLint/Prettier)
