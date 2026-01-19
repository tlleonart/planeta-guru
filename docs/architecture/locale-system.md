# Sistema de Locales e Internacionalizacion

## Vision General

Planeta Guru soporta 42 locales diferentes, combinando 21 paises con 2 idiomas (espanol e ingles). El sistema de locales es fundamental para la aplicacion ya que afecta:

- Las rutas de navegacion
- Los headers enviados al backend
- El contenido mostrado al usuario
- Los precios y monedas
- La disponibilidad de productos

## Formato de Locale

```
{country}-{language}
```

Ejemplos:
- `mx-es` - Mexico, Espanol
- `mx-en` - Mexico, Ingles
- `ar-es` - Argentina, Espanol
- `za-en` - Sudafrica, Ingles

## Paises Soportados

### America Latina (21 paises)

| Codigo | Pais |
|--------|------|
| `mx` | Mexico |
| `ar` | Argentina |
| `cl` | Chile |
| `co` | Colombia |
| `pe` | Peru |
| `ec` | Ecuador |
| `ve` | Venezuela |
| `bo` | Bolivia |
| `py` | Paraguay |
| `uy` | Uruguay |
| `cr` | Costa Rica |
| `pa` | Panama |
| `gt` | Guatemala |
| `hn` | Honduras |
| `sv` | El Salvador |
| `ni` | Nicaragua |
| `do` | Republica Dominicana |
| `cu` | Cuba |
| `pr` | Puerto Rico |
| `ht` | Haiti |
| `jm` | Jamaica |

### Africa

| Codigo | Pais |
|--------|------|
| `za` | Sudafrica |

## Idiomas Soportados

| Codigo | Idioma |
|--------|--------|
| `es` | Espanol |
| `en` | Ingles |

## Configuracion de Next-Intl

### Archivo de Configuracion

```typescript
// src/i18n/request.ts
import { getRequestConfig } from "next-intl/server";

export default getRequestConfig(async ({ requestLocale }) => {
  const locale = await requestLocale;

  // Extraer idioma del locale (mx-es -> es)
  const [, language] = locale?.split("-") || ["mx", "es"];

  return {
    locale: locale || "mx-es",
    messages: (await import(`../../messages/${language || "es"}.json`)).default,
  };
});
```

### Archivos de Mensajes

```
messages/
├── en.json    # Traducciones en ingles
└── es.json    # Traducciones en espanol
```

Estructura de mensajes:

```json
{
  "common": {
    "loading": "Cargando...",
    "error": "Error",
    "retry": "Reintentar"
  },
  "home": {
    "title": "Bienvenido a Planeta Guru",
    "featured": "Destacados"
  },
  "products": {
    "buy": "Comprar",
    "addToCart": "Agregar al carrito"
  }
}
```

## Estructura de Rutas

Todas las rutas publicas DEBEN incluir el locale:

```
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

### Middleware de Locale

```typescript
// middleware.ts
import createMiddleware from "next-intl/middleware";
import { routing } from "./i18n/routing";

export default createMiddleware(routing);

export const config = {
  matcher: ["/((?!api|_next|.*\\..*).*)"],
};
```

## Impacto en el Backend API

### Headers Automaticos

El sistema extrae automaticamente el pais y el idioma del locale de la URL y los envia como headers en TODAS las llamadas al backend:

```typescript
// Ejemplo de URL: /mx-es/categories
// Headers enviados:
{
  "Selected-Country": "mx",
  "Selected-Language": "es",
  "Platform-Key": "[valor de env]",
  "Authorization": "[token de Clerk si autenticado]"
}
```

### Implementacion en HttpClient

```typescript
// src/modules/http/http-client.ts
private buildHeaders(context: RequestContext): Record<string, string> {
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    "Platform-Key": process.env.NEXT_PUBLIC_API_PLATFORM_KEY || "",
  };

  if (context.selectedCountry) {
    headers["Selected-Country"] = context.selectedCountry;
  }

  if (context.selectedLanguage) {
    headers["Selected-Language"] = context.selectedLanguage;
  }

  if (context.authToken) {
    headers["Authorization"] = `Bearer ${context.authToken}`;
  }

  return headers;
}
```

## Cookies de Locale

Las preferencias de locale se almacenan en cookies:

```typescript
// Nombres de cookies
selectedCountry    // ej: "mx"
selectedLanguage   // ej: "es"
```

### Lectura de Cookies

```typescript
// src/modules/http/helpers.ts
export async function getRequestContext(): Promise<RequestContext> {
  const cookieStore = await cookies();
  const { getToken } = await auth();

  return {
    authToken: await getToken(),
    selectedCountry: cookieStore.get("selectedCountry")?.value,
    selectedLanguage: cookieStore.get("selectedLanguage")?.value,
  };
}
```

## Cambio de Locale

### Componente LocaleSwitcher

El usuario puede cambiar el locale a traves del componente `LocaleSwitcher` en el header:

```typescript
"use client";

import { useRouter, usePathname } from "@/i18n/navigation";

export const LocaleSwitcher: FC = () => {
  const router = useRouter();
  const pathname = usePathname();

  const handleLocaleChange = (newLocale: string) => {
    router.replace(pathname, { locale: newLocale });
  };

  return (
    // UI del selector de locale
  );
};
```

## Uso en Componentes

### Server Components

```typescript
import { getTranslations } from "next-intl/server";

export const ProductCard: FC<Props> = async ({ product }) => {
  const t = await getTranslations("products");

  return (
    <Card>
      <h3>{product.name}</h3>
      <Button>{t("buy")}</Button>
    </Card>
  );
};
```

### Client Components

```typescript
"use client";

import { useTranslations } from "next-intl";

export const ProductCard: FC<Props> = ({ product }) => {
  const t = useTranslations("products");

  return (
    <Card>
      <h3>{product.name}</h3>
      <Button>{t("buy")}</Button>
    </Card>
  );
};
```

## Efectos en el Backend

El backend Laravel utiliza los headers para:

1. **Contenido traducido**: Devuelve nombres, descripciones, etc. en el idioma seleccionado
2. **Precios localizados**: Muestra precios en la moneda del pais
3. **Disponibilidad de productos**: Filtra productos disponibles en el pais
4. **Configuraciones de pais**: Aplica reglas especificas del pais (impuestos, metodos de pago, etc.)

## Locale por Defecto

Si no se especifica locale, el sistema redirige a `mx-es` (Mexico, Espanol):

```typescript
// src/i18n/routing.ts
export const routing = defineRouting({
  locales: SUPPORTED_LOCALES,
  defaultLocale: "mx-es",
});
```

## Testing con Locales

Para tests E2E, es importante probar multiples locales:

```typescript
// playwright.config.ts
projects: [
  {
    name: "Mexico Spanish",
    use: { baseURL: "http://localhost:3000/mx-es" },
  },
  {
    name: "Mexico English",
    use: { baseURL: "http://localhost:3000/mx-en" },
  },
  {
    name: "South Africa English",
    use: { baseURL: "http://localhost:3000/za-en" },
  },
],
```
