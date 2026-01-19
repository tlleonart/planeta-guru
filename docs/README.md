# Documentacion Planeta Guru

Bienvenido a la documentacion tecnica de Planeta Guru, una plataforma de comercio electronico de contenido digital construida con Next.js 16.

## Indice de Documentacion

### Arquitectura
- [Vision General](./architecture/overview.md) - Arquitectura del sistema y stack tecnologico
- [Estructura de Directorios](./architecture/directory-structure.md) - Organizacion del codigo
- [Flujo de Datos](./architecture/data-flow.md) - Como fluyen los datos en la aplicacion
- [Sistema de Locales](./architecture/locale-system.md) - Internacionalizacion y multi-pais

### Guias de Desarrollo
- [Inicio Rapido](./guides/quickstart.md) - Como empezar a desarrollar
- [Convenciones de Codigo](./guides/conventions.md) - Estandares y patrones
- [Creacion de Componentes](./guides/components.md) - Como crear componentes
- [Testing](./guides/testing.md) - Guia de testing con Vitest y Playwright
- [Troubleshooting](./guides/troubleshooting.md) - Solucion de problemas comunes

### API y Servicios
- [Sistema tRPC](./api/trpc.md) - APIs type-safe con tRPC
- [Servicios](./api/services.md) - Capa de servicios y HttpClient
- [Mappers](./api/mappers.md) - Transformacion de datos API a dominio

### Modulos
- [Home](./modules/home.md) - Pagina principal
- [Products](./modules/products.md) - Modulos de productos
- [Charge Gurus](./modules/charge-gurus.md) - Sistema de recarga
- [Account](./modules/account.md) - Gestion de cuenta
- [Auth](./modules/auth.md) - Autenticacion con Clerk

## Stack Tecnologico

| Tecnologia | Version | Proposito |
|------------|---------|-----------|
| Next.js | 16.0.3 | Framework React con App Router |
| React | 19.2.0 | Biblioteca UI |
| TypeScript | 5.x | Tipado estatico |
| tRPC | 11.7.1 | APIs type-safe |
| TanStack Query | 5.90.10 | Manejo de estado servidor |
| Tailwind CSS | 4.x | Estilos utility-first |
| Clerk | 6.35.2 | Autenticacion |
| Zustand | 5.0.8 | Estado global |
| nuqs | 2.8.6 | Estado en URL |
| Biome | 2.2.0 | Linting y formateo |
| Vitest | 4.0.17 | Testing unitario |
| Playwright | 1.57.0 | Testing E2E |

## Requisitos del Sistema

- Node.js 18.17 o superior
- npm 9.x o superior
- Git

## Variables de Entorno

```bash
# Clerk Authentication
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=
CLERK_SECRET_KEY=
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/auth/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/auth/sign-up

# API Backend
NEXT_PUBLIC_API_BASE_URL=
NEXT_PUBLIC_API_PLATFORM_KEY=
```

## Comandos Principales

```bash
# Desarrollo
npm run dev              # Servidor de desarrollo

# Build
npm run build            # Build de produccion
npm start                # Servidor de produccion

# Calidad de Codigo
npm run lint             # Verificar codigo con Biome
npm run format           # Formatear codigo

# Testing
npm run test             # Tests en modo watch
npm run test:run         # Ejecutar tests una vez
npm run test:coverage    # Coverage de tests
npm run test:e2e         # Tests E2E con Playwright
```

## Enlaces Rapidos

- [CLAUDE.md](../CLAUDE.md) - Guia para Claude Code
- [TESTING.md](../TESTING.md) - Plan de testing detallado
- [RETROSPECTIVA.md](../RETROSPECTIVA.md) - Analisis y correcciones
