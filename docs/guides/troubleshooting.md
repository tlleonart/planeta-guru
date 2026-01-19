# Solucion de Problemas

## Problemas Comunes

### Error: Cannot find module

**Sintoma:**
```
Error: Cannot find module '@/modules/...'
```

**Solucion:**
```bash
# Limpiar cache y reinstalar
rm -rf node_modules .next
npm install
```

### Error: Clerk authentication failed

**Sintoma:**
```
ClerkError: Missing Clerk publishable key
```

**Solucion:**
1. Verificar que `.env.local` exista
2. Verificar variables:
```bash
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_xxxxx
CLERK_SECRET_KEY=sk_test_xxxxx
```
3. Reiniciar el servidor de desarrollo

### Error: API connection refused

**Sintoma:**
```
Error: connect ECONNREFUSED
```

**Solucion:**
1. Verificar `NEXT_PUBLIC_API_BASE_URL` en `.env.local`
2. Verificar que el backend este corriendo
3. Verificar conectividad de red

### Error: Invalid Platform-Key

**Sintoma:**
```
401 Unauthorized - Invalid platform key
```

**Solucion:**
Verificar `NEXT_PUBLIC_API_PLATFORM_KEY` en `.env.local`

### Error: Hydration mismatch

**Sintoma:**
```
Hydration failed because the initial UI does not match what was rendered on the server
```

**Solucion:**
1. Verificar que no haya logica condicional basada en `window` o `document` en el render inicial
2. Mover logica de cliente a `useEffect`
3. Usar `dynamic` con `ssr: false` para componentes que requieren browser APIs

```typescript
// ❌ Malo
const Component = () => {
  const width = window.innerWidth;
  return <div>{width}</div>;
};

// ✅ Bueno
const Component = () => {
  const [width, setWidth] = useState(0);

  useEffect(() => {
    setWidth(window.innerWidth);
  }, []);

  return <div>{width}</div>;
};
```

### Error: TRPCClientError

**Sintoma:**
```
TRPCClientError: Request failed with status 500
```

**Solucion:**
1. Revisar logs del servidor para ver el error real
2. Verificar que el servicio y mapper esten correctos
3. Verificar que el endpoint del backend exista

### Error: Type 'X' is not assignable to type 'Y'

**Sintoma:**
```
Type 'ProductApiModel' is not assignable to type 'Product'
```

**Solucion:**
Asegurar que el mapper transforma correctamente:

```typescript
// Verificar que el mapper retorne el tipo correcto
export function mapProduct(api: ProductApiModel): Product {
  return {
    id: api.id,
    productName: api.product_name, // snake_case -> camelCase
    // ...
  };
}
```

### Error: Build failed with tests

**Sintoma:**
```
Type error: Cannot find name 'vi'
```

**Solucion:**
Los tests deben estar excluidos del build de TypeScript:

```json
// tsconfig.json
{
  "exclude": ["node_modules", "tests"]
}
```

Y tener su propio tsconfig:

```json
// tests/tsconfig.json
{
  "extends": "../tsconfig.json",
  "compilerOptions": {
    "types": ["vitest/globals", "node"]
  },
  "include": ["./**/*.ts", "./**/*.tsx"]
}
```

### Error: dynamic with ssr: false in Server Component

**Sintoma:**
```
`ssr: false` is not allowed with `next/dynamic` in Server Components
```

**Solucion:**
Agregar `"use client"` al componente:

```typescript
"use client";

import dynamic from "next/dynamic";

const MyComponent = dynamic(() => import("./my-component"), {
  ssr: false,
});
```

### Error: Biome lint errors

**Sintoma:**
```
biome check: Found X errors
```

**Solucion:**
1. Ejecutar auto-fix:
```bash
npm run format
```

2. Para errores que no se pueden auto-arreglar, revisar el mensaje y corregir manualmente

3. Si es necesario ignorar una regla:
```typescript
// biome-ignore lint/suspicious/noExplicitAny: razon especifica
const data: any = await externalApi.call();
```

### Error: Locale not found

**Sintoma:**
```
404: This page could not be found
```

**Solucion:**
1. Verificar que la ruta incluya el locale: `/mx-es/categories` no `/categories`
2. Verificar que el locale sea valido (ej: `mx-es`, `ar-en`, etc.)

### Error: Cookies not being set

**Sintoma:**
Headers `Selected-Country` o `Selected-Language` vacios

**Solucion:**
1. Verificar que las cookies se esten leyendo correctamente:
```typescript
const cookieStore = await cookies();
console.log("Country:", cookieStore.get("selectedCountry")?.value);
console.log("Language:", cookieStore.get("selectedLanguage")?.value);
```

2. Verificar que el middleware este configurando las cookies

### Error: Image optimization

**Sintoma:**
```
Error: Invalid src prop on next/image
```

**Solucion:**
Agregar el dominio a la configuracion de Next.js:

```typescript
// next.config.ts
const config = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "api.example.com",
      },
    ],
  },
};
```

## Comandos de Diagnostico

### Verificar Estado del Proyecto

```bash
# Verificar dependencias
npm ls

# Verificar tipos
npx tsc --noEmit

# Verificar linting
npm run lint

# Verificar build
npm run build
```

### Limpiar Cache

```bash
# Limpiar cache de Next.js
rm -rf .next

# Limpiar todo y reinstalar
rm -rf node_modules .next package-lock.json
npm install
```

### Ver Logs Detallados

```bash
# Desarrollo con logs detallados
DEBUG=* npm run dev

# Build con logs detallados
npm run build --verbose
```

## Obteniendo Ayuda

1. Revisar esta documentacion
2. Revisar [CLAUDE.md](../../CLAUDE.md)
3. Buscar en issues del repositorio
4. Preguntar al equipo de desarrollo
