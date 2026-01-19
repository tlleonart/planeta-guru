# Guia de Inicio Rapido

## Requisitos Previos

- Node.js 18.17 o superior
- npm 9.x o superior
- Git
- Un editor de codigo (recomendado: VS Code)

## Instalacion

### 1. Clonar el Repositorio

```bash
git clone <repository-url>
cd planeta-guru
```

### 2. Instalar Dependencias

```bash
npm install
```

### 3. Configurar Variables de Entorno

Crear archivo `.env.local` en la raiz del proyecto:

```bash
# Clerk Authentication
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_xxxxx
CLERK_SECRET_KEY=sk_test_xxxxx
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/auth/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/auth/sign-up

# API Backend
NEXT_PUBLIC_API_BASE_URL=https://api.example.com
NEXT_PUBLIC_API_PLATFORM_KEY=your-platform-key
```

> Solicitar las credenciales reales al equipo de desarrollo.

### 4. Iniciar el Servidor de Desarrollo

```bash
npm run dev
```

La aplicacion estara disponible en `http://localhost:3000`.

El navegador redirigira automaticamente a `http://localhost:3000/mx-es` (locale por defecto).

## Estructura del Proyecto

```
planeta-guru/
├── src/
│   ├── app/           # Rutas Next.js (App Router)
│   ├── components/    # Componentes UI primitivos
│   └── modules/       # Modulos por feature
├── tests/             # Tests (Vitest + Playwright)
├── docs/              # Documentacion
└── messages/          # Traducciones i18n
```

## Comandos Principales

| Comando | Descripcion |
|---------|-------------|
| `npm run dev` | Inicia servidor de desarrollo |
| `npm run build` | Crea build de produccion |
| `npm run lint` | Verifica codigo con Biome |
| `npm run format` | Formatea codigo |
| `npm run test` | Ejecuta tests en modo watch |
| `npm run test:run` | Ejecuta tests una vez |
| `npm run test:e2e` | Ejecuta tests E2E |

## Flujo de Trabajo Tipico

### 1. Crear una Nueva Feature

1. Crear modulo en `src/modules/mi-feature/`
2. Crear componentes en `src/modules/mi-feature/components/`
3. Crear ruta en `src/app/[locale]/(root)/mi-feature/page.tsx`
4. Crear router tRPC si necesita API en `src/app/server/routers/`

### 2. Agregar un Nuevo Endpoint de API

1. Definir tipos en `src/modules/shared/types/`
2. Crear mapper en `src/modules/shared/mappers/`
3. Crear o extender servicio en `src/modules/shared/services/`
4. Agregar procedure en router tRPC

### 3. Crear un Componente

```typescript
// src/modules/mi-feature/components/mi-componente.tsx
import type { FC } from "react";

interface MiComponenteProps {
  title: string;
}

export const MiComponente: FC<MiComponenteProps> = ({ title }) => {
  return (
    <div className="p-4">
      <h1>{title}</h1>
    </div>
  );
};
```

## Verificacion de Codigo

Antes de hacer commit, siempre ejecutar:

```bash
# Verificar linting
npm run lint

# Ejecutar tests
npm run test:run

# Verificar build
npm run build
```

## Recursos Adicionales

- [CLAUDE.md](../../CLAUDE.md) - Guia completa para desarrollo
- [Arquitectura](../architecture/overview.md) - Vision general del sistema
- [Convenciones](./conventions.md) - Estandares de codigo
- [Testing](./testing.md) - Guia de testing

## Solucion de Problemas Comunes

### Error: Cannot find module

```bash
# Limpiar cache y reinstalar
rm -rf node_modules .next
npm install
```

### Error: Clerk authentication

Verificar que las variables `NEXT_PUBLIC_CLERK_*` y `CLERK_SECRET_KEY` esten configuradas correctamente.

### Error: API connection

Verificar que `NEXT_PUBLIC_API_BASE_URL` apunte al backend correcto y que `NEXT_PUBLIC_API_PLATFORM_KEY` sea valido.

### Error de build con tests

Los tests estan excluidos del build de TypeScript. Si ves errores de tipos en tests, verificar que `tests/tsconfig.json` exista.
