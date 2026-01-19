# Modulo Products

## Vision General

El modulo Products maneja todos los tipos de productos digitales en Planeta Guru:

- **Game Key**: Claves de activacion para juegos de PC
- **Game HTML**: Juegos HTML5 jugables en el navegador
- **Game WebGL**: Juegos WebGL con soporte fullscreen
- **Gift Card**: Tarjetas de regalo de diferentes plataformas
- **Subscription**: Suscripciones a servicios

## Estructura de Archivos

```
src/modules/products/
├── game-html/
│   ├── components/
│   │   └── game-html-iframe.tsx
│   └── game-html-page.tsx
├── game-key/
│   ├── components/
│   │   ├── activation-guide.tsx
│   │   ├── language-table.tsx
│   │   └── system-requirements.tsx
│   └── game-key-page.tsx
├── game-webgl/
│   ├── components/
│   │   └── game-webgl-iframe.tsx
│   └── game-webgl-page.tsx
├── gift-card/
│   ├── components/
│   │   ├── bundle-selector.tsx
│   │   └── region-info.tsx
│   └── gift-card-page.tsx
└── subscription/
    ├── components/
    │   └── payment-options.tsx
    └── subscription-page.tsx
```

## Game Key

### Descripcion

Pagina de detalle para claves de juegos de PC. Muestra informacion del juego, requisitos del sistema, idiomas soportados y guia de activacion.

### Componentes

```typescript
// src/modules/products/game-key/game-key-page.tsx
import type { FC } from "react";
import { api } from "@/app/server/server";
import { SystemRequirements } from "./components/system-requirements";
import { LanguageTable } from "./components/language-table";
import { ActivationGuide } from "./components/activation-guide";
import { BuyButton } from "@/modules/shared/components/products/buy-button";

interface GameKeyPageProps {
  slug: string;
}

export const GameKeyPage: FC<GameKeyPageProps> = async ({ slug }) => {
  const product = await api.product.getGameKey({ slug });

  return (
    <main className="container mx-auto py-8">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Columna principal */}
        <div className="lg:col-span-2 space-y-8">
          <header>
            <h1 className="text-3xl font-bold">{product.name}</h1>
            <p className="text-muted-foreground">{product.description}</p>
          </header>

          <SystemRequirements requirements={product.systemRequirements} />
          <LanguageTable languages={product.languages} />

          {product.activationGuide && (
            <ActivationGuide guide={product.activationGuide} />
          )}
        </div>

        {/* Sidebar de compra */}
        <aside className="lg:col-span-1">
          <div className="sticky top-4 p-6 border rounded-lg">
            <img
              src={product.imageUrl}
              alt={product.name}
              className="w-full rounded-lg mb-4"
            />
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-2xl font-bold">
                  ${product.basePrice}
                </span>
                {product.discountPercentage && (
                  <span className="text-green-600">
                    -{product.discountPercentage}%
                  </span>
                )}
              </div>
              <BuyButton
                productId={product.id}
                slug={product.slug}
                price={product.basePrice}
              />
            </div>
          </div>
        </aside>
      </div>
    </main>
  );
};
```

### SystemRequirements

```typescript
// src/modules/products/game-key/components/system-requirements.tsx
import type { FC } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface SystemRequirementsProps {
  requirements: SystemRequirements;
}

export const SystemRequirements: FC<SystemRequirementsProps> = ({
  requirements,
}) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Requisitos del Sistema</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <h4 className="font-semibold mb-2">Minimos</h4>
            <dl className="space-y-1 text-sm">
              <div className="flex justify-between">
                <dt className="text-muted-foreground">CPU:</dt>
                <dd>{requirements.minCpu}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-muted-foreground">RAM:</dt>
                <dd>{requirements.minRam}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-muted-foreground">GPU:</dt>
                <dd>{requirements.minGpu}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-muted-foreground">Espacio:</dt>
                <dd>{requirements.minStorage}</dd>
              </div>
            </dl>
          </div>
          <div>
            <h4 className="font-semibold mb-2">Recomendados</h4>
            <dl className="space-y-1 text-sm">
              <div className="flex justify-between">
                <dt className="text-muted-foreground">CPU:</dt>
                <dd>{requirements.recCpu}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-muted-foreground">RAM:</dt>
                <dd>{requirements.recRam}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-muted-foreground">GPU:</dt>
                <dd>{requirements.recGpu}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-muted-foreground">Espacio:</dt>
                <dd>{requirements.recStorage}</dd>
              </div>
            </dl>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
```

## Game HTML

### Descripcion

Juegos HTML5 que se ejecutan directamente en el navegador mediante un iframe.

```typescript
// src/modules/products/game-html/game-html-page.tsx
"use client";

import type { FC } from "react";
import dynamic from "next/dynamic";

const GameHTMLIframe = dynamic(
  () => import("./components/game-html-iframe").then((mod) => mod.GameHTMLIframe),
  { ssr: false }
);

interface GameHTMLPageProps {
  url: string;
  title: string;
}

export const GameHTMLPage: FC<GameHTMLPageProps> = ({ url, title }) => {
  return (
    <div className="w-full h-screen">
      <GameHTMLIframe src={url} title={title} />
    </div>
  );
};
```

## Gift Card

### Descripcion

Tarjetas de regalo con multiples denominaciones (bundles) y restricciones regionales.

```typescript
// src/modules/products/gift-card/gift-card-page.tsx
import type { FC } from "react";
import { api } from "@/app/server/server";
import { BundleSelector } from "./components/bundle-selector";
import { RegionInfo } from "./components/region-info";

interface GiftCardPageProps {
  slug: string;
}

export const GiftCardPage: FC<GiftCardPageProps> = async ({ slug }) => {
  const product = await api.product.getGiftCard({ slug });

  return (
    <main className="container mx-auto py-8">
      <header className="mb-8">
        <h1 className="text-3xl font-bold">{product.name}</h1>
        <p className="text-muted-foreground">{product.description}</p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div>
          <img
            src={product.imageUrl}
            alt={product.name}
            className="w-full rounded-lg"
          />
        </div>

        <div className="space-y-6">
          <RegionInfo region={product.region} />
          <BundleSelector bundles={product.bundles} productSlug={slug} />
        </div>
      </div>
    </main>
  );
};
```

### BundleSelector

```typescript
// src/modules/products/gift-card/components/bundle-selector.tsx
"use client";

import type { FC } from "react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

interface BundleSelectorProps {
  bundles: Bundle[];
  productSlug: string;
}

export const BundleSelector: FC<BundleSelectorProps> = ({
  bundles,
  productSlug,
}) => {
  const [selectedBundle, setSelectedBundle] = useState<Bundle | null>(null);

  return (
    <div className="space-y-4">
      <h3 className="font-semibold">Selecciona una denominacion:</h3>

      <div className="grid grid-cols-2 gap-2">
        {bundles.map((bundle) => (
          <Card
            key={bundle.id}
            className={cn(
              "cursor-pointer transition-colors",
              selectedBundle?.id === bundle.id && "border-primary"
            )}
            onClick={() => setSelectedBundle(bundle)}
          >
            <CardContent className="p-4 text-center">
              <span className="text-xl font-bold">${bundle.value}</span>
              <span className="text-sm text-muted-foreground block">
                {bundle.guruPrice} GURUs
              </span>
            </CardContent>
          </Card>
        ))}
      </div>

      {selectedBundle && (
        <Button className="w-full" size="lg">
          Comprar por {selectedBundle.guruPrice} GURUs
        </Button>
      )}
    </div>
  );
};
```

## Subscription

### Descripcion

Suscripciones a servicios con diferentes planes y metodos de pago.

```typescript
// src/modules/products/subscription/subscription-page.tsx
import type { FC } from "react";
import { api } from "@/app/server/server";
import { PaymentOptions } from "./components/payment-options";

interface SubscriptionPageProps {
  slug: string;
}

export const SubscriptionPage: FC<SubscriptionPageProps> = async ({ slug }) => {
  const product = await api.product.getSubscription({ slug });

  return (
    <main className="container mx-auto py-8">
      <header className="text-center mb-8">
        <h1 className="text-3xl font-bold">{product.name}</h1>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          {product.description}
        </p>
      </header>

      <div className="max-w-4xl mx-auto">
        <PaymentOptions options={product.paymentOptions} productSlug={slug} />
      </div>
    </main>
  );
};
```

## Rutas

```typescript
// src/app/[locale]/(root)/products/game-key/[slug]/page.tsx
import { GameKeyPage } from "@/modules/products/game-key/game-key-page";

export default async function GameKeyRoute({
  params,
}: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  return <GameKeyPage slug={slug} />;
}

// src/app/[locale]/(root)/products/gift-card/[slug]/page.tsx
import { GiftCardPage } from "@/modules/products/gift-card/gift-card-page";

export default async function GiftCardRoute({
  params,
}: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  return <GiftCardPage slug={slug} />;
}
```

## API Utilizada

| Endpoint | Descripcion |
|----------|-------------|
| `api.product.getGameKey({ slug })` | Detalle de game key |
| `api.product.getGiftCard({ slug })` | Detalle de gift card |
| `api.product.getSubscription({ slug })` | Detalle de subscription |
| `api.product.getGameHTML({ slug })` | URL de game HTML |
| `api.product.getGameWebGL({ slug })` | URL de game WebGL |

## Componentes Compartidos

Los productos comparten componentes de `@/modules/shared/components/products/`:

- `ProductCard`: Card de producto para listas
- `BuyButton`: Boton de compra con modal
- `FavoriteButton`: Toggle de favorito
- `ShareButton`: Compartir producto
