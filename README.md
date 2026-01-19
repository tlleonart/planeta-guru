# Planeta Guru

Plataforma de juegos y entretenimiento digital para Latinoamérica y Sudáfrica.

## Stack Tecnológico

- **Next.js 16** - App Router con Server Components
- **React 19** - Server Components y Client Islands
- **TypeScript** - Type safety
- **Tailwind CSS 4** - Estilos utility-first
- **tRPC** - APIs type-safe
- **Clerk** - Autenticación
- **next-intl** - Internacionalización (21 países, 2 idiomas)
- **Biome** - Linting y formateo

## Requisitos

- Node.js 20+
- npm 10+

## Instalación

```bash
# Instalar dependencias
npm install

# Configurar variables de entorno
cp .env.example .env.local
# Editar .env.local con tus credenciales
```

## Variables de Entorno

```bash
# Clerk
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=
CLERK_SECRET_KEY=

# API
NEXT_PUBLIC_BASE_API_URL=
PLATFORM_KEY=
```

## Desarrollo

```bash
# Servidor de desarrollo
npm run dev

# Linting
npm run lint

# Formateo
npm run format
```

## Build y Deploy

```bash
# Build de producción
npm run build

# Servidor de producción
npm start
```

### Deploy con Cloud Build

```bash
gcloud builds submit --config=cloudbuild.yaml
```

## Estructura del Proyecto

```
src/
├── app/                    # Next.js App Router
│   ├── [locale]/          # Rutas con locale
│   │   ├── (auth)/        # Páginas de autenticación
│   │   └── (root)/        # Páginas principales
│   ├── api/               # API routes
│   └── server/            # tRPC server
├── modules/               # Módulos por feature
│   ├── home/             # Página principal
│   ├── products/         # Productos (juegos, gift cards, etc.)
│   ├── charge-gurus/     # Recarga de gurús
│   ├── profile/          # Perfil de usuario
│   └── shared/           # Componentes y utilidades compartidas
├── i18n/                 # Configuración de internacionalización
└── proxy.ts              # Middleware de Next.js 16
```

## Documentación

- [CLAUDE.md](./CLAUDE.md) - Guía completa para desarrollo
- [docs/](./docs/) - Documentación detallada por módulo

## Licencia

Privado - Todos los derechos reservados
