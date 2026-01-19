# Guia de Creacion de Componentes

## Tipos de Componentes

### 1. Server Components (Por Defecto)

Los Server Components se renderizan en el servidor y no envian JavaScript al cliente.

```typescript
// src/modules/products/product-page.tsx
import type { FC } from "react";
import { api } from "@/app/server/server";

interface ProductPageProps {
  slug: string;
}

export const ProductPage: FC<ProductPageProps> = async ({ slug }) => {
  // Data fetching directo en el componente
  const product = await api.product.getBySlug({ slug });

  return (
    <main className="container mx-auto py-8">
      <h1 className="text-3xl font-bold">{product.name}</h1>
      <p className="text-muted-foreground">{product.description}</p>
    </main>
  );
};
```

**Usar cuando:**
- Solo muestra datos (sin interactividad)
- Hace data fetching
- Accede a recursos del servidor
- No necesita hooks de React (useState, useEffect)

### 2. Client Components

Los Client Components se renderizan en el cliente y pueden usar hooks de React.

```typescript
// src/modules/products/components/buy-button.tsx
"use client";

import type { FC } from "react";
import { useState } from "react";
import { Button } from "@/components/ui/button";

interface BuyButtonProps {
  productId: number;
  price: number;
}

export const BuyButton: FC<BuyButtonProps> = ({ productId, price }) => {
  const [isLoading, setIsLoading] = useState(false);

  const handleClick = async () => {
    setIsLoading(true);
    // Logica de compra
    setIsLoading(false);
  };

  return (
    <Button onClick={handleClick} disabled={isLoading}>
      {isLoading ? "Procesando..." : `Comprar por $${price}`}
    </Button>
  );
};
```

**Usar cuando:**
- Necesita interactividad (onClick, onChange)
- Usa hooks (useState, useEffect, useContext)
- Necesita browser APIs (localStorage, geolocation)
- Usa event listeners

### 3. Patron Client Islands

Combina Server Components con pequenos Client Components.

```typescript
// src/modules/products/product-card.tsx (Server Component)
import type { FC } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { FavoriteButton } from "./favorite-button"; // Client Component
import { BuyButton } from "./buy-button"; // Client Component

interface ProductCardProps {
  product: Product;
}

export const ProductCard: FC<ProductCardProps> = async ({ product }) => {
  return (
    <Card>
      <CardHeader>
        <img src={product.imageUrl} alt={product.name} />
        <h3 className="font-bold">{product.name}</h3>
      </CardHeader>
      <CardContent>
        <p>{product.description}</p>
        <div className="flex gap-2 mt-4">
          {/* Client Islands para interactividad */}
          <FavoriteButton productId={product.id} />
          <BuyButton productId={product.id} price={product.price} />
        </div>
      </CardContent>
    </Card>
  );
};
```

## Estructura de Archivos

```
src/modules/products/
├── components/
│   ├── product-card.tsx          # Server Component
│   ├── product-list.tsx          # Server Component
│   ├── buy-button.tsx            # Client Component
│   ├── favorite-button.tsx       # Client Component
│   └── product-carousel.tsx      # Client Component
├── hooks/
│   └── use-product-filters.ts    # Hook personalizado
├── types.ts                      # Tipos del modulo
└── product-page.tsx              # Pagina principal (Server)
```

## Componentes UI Base

Usar los componentes de `@/components/ui/` que estan basados en Radix UI:

```typescript
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
```

## Props y Tipos

### Definir Props con Interface

```typescript
interface ProductCardProps {
  product: Product;
  showActions?: boolean;
  onSelect?: (product: Product) => void;
}

export const ProductCard: FC<ProductCardProps> = ({
  product,
  showActions = true,
  onSelect,
}) => {
  // ...
};
```

### Extender Props HTML Nativas

```typescript
interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline";
  size?: "sm" | "md" | "lg";
}

export const Button: FC<ButtonProps> = ({
  variant = "primary",
  size = "md",
  className,
  children,
  ...props
}) => {
  return (
    <button
      className={cn(buttonVariants({ variant, size }), className)}
      {...props}
    >
      {children}
    </button>
  );
};
```

### Children y Slots

```typescript
interface CardProps {
  children: React.ReactNode;
  header?: React.ReactNode;
  footer?: React.ReactNode;
}

export const Card: FC<CardProps> = ({ children, header, footer }) => {
  return (
    <div className="rounded-lg border bg-card">
      {header && <div className="border-b p-4">{header}</div>}
      <div className="p-4">{children}</div>
      {footer && <div className="border-t p-4">{footer}</div>}
    </div>
  );
};
```

## Estilos con Tailwind

### Clases Condicionales

```typescript
import { cn } from "@/lib/utils";

interface AlertProps {
  variant: "info" | "warning" | "error" | "success";
  children: React.ReactNode;
}

export const Alert: FC<AlertProps> = ({ variant, children }) => {
  return (
    <div
      className={cn(
        "rounded-lg p-4 text-sm",
        variant === "info" && "bg-blue-100 text-blue-800",
        variant === "warning" && "bg-yellow-100 text-yellow-800",
        variant === "error" && "bg-red-100 text-red-800",
        variant === "success" && "bg-green-100 text-green-800"
      )}
    >
      {children}
    </div>
  );
};
```

### Class Variance Authority (CVA)

```typescript
import { cva, type VariantProps } from "class-variance-authority";

const buttonVariants = cva(
  "inline-flex items-center justify-center rounded-md font-medium transition-colors",
  {
    variants: {
      variant: {
        primary: "bg-primary text-primary-foreground hover:bg-primary/90",
        secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80",
        outline: "border border-input bg-background hover:bg-accent",
      },
      size: {
        sm: "h-8 px-3 text-sm",
        md: "h-10 px-4",
        lg: "h-12 px-6 text-lg",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "md",
    },
  }
);

interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {}

export const Button: FC<ButtonProps> = ({
  variant,
  size,
  className,
  ...props
}) => {
  return (
    <button
      className={cn(buttonVariants({ variant, size }), className)}
      {...props}
    />
  );
};
```

## Hooks Personalizados

### Extraer Logica a Hooks

```typescript
// src/modules/products/hooks/use-product-purchase.ts
"use client";

import { useState } from "react";
import { trpc } from "@/modules/http/trpc-client";

interface UsePurchaseOptions {
  onSuccess?: () => void;
  onError?: (error: Error) => void;
}

export function useProductPurchase(options?: UsePurchaseOptions) {
  const [isPurchasing, setIsPurchasing] = useState(false);

  const purchaseMutation = trpc.product.purchase.useMutation({
    onSuccess: () => {
      setIsPurchasing(false);
      options?.onSuccess?.();
    },
    onError: (error) => {
      setIsPurchasing(false);
      options?.onError?.(error);
    },
  });

  const purchase = (productId: number) => {
    setIsPurchasing(true);
    purchaseMutation.mutate({ productId });
  };

  return {
    purchase,
    isPurchasing,
    error: purchaseMutation.error,
  };
}
```

## Data Fetching

### En Server Components

```typescript
// Directo con api caller
export const ProductPage: FC<Props> = async ({ slug }) => {
  const product = await api.product.getBySlug({ slug });
  return <ProductContent product={product} />;
};
```

### En Client Components

```typescript
"use client";

import { trpc } from "@/modules/http/trpc-client";

export const ProductList: FC = () => {
  const { data, isLoading, error } = trpc.product.list.useQuery({
    page: 1,
    limit: 10,
  });

  if (isLoading) return <ProductListSkeleton />;
  if (error) return <ErrorMessage error={error} />;

  return (
    <div className="grid grid-cols-3 gap-4">
      {data?.products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
};
```

## Accesibilidad

### Semantica HTML

```typescript
// ❌ Malo
<div onClick={handleClick}>Click me</div>

// ✅ Bueno
<button onClick={handleClick}>Click me</button>
```

### Labels y ARIA

```typescript
<Input
  id="email"
  type="email"
  aria-label="Email address"
  aria-describedby="email-hint"
/>
<p id="email-hint" className="text-sm text-muted-foreground">
  We'll never share your email
</p>
```

### Focus Management

```typescript
const dialogRef = useRef<HTMLDialogElement>(null);

useEffect(() => {
  if (isOpen) {
    dialogRef.current?.focus();
  }
}, [isOpen]);
```

## Testing

### data-testid para Tests

```typescript
<Card data-testid="product-card">
  <CardHeader>
    <h3 data-testid="product-name">{product.name}</h3>
  </CardHeader>
  <CardContent>
    <Button data-testid="buy-button">Comprar</Button>
  </CardContent>
</Card>
```

### Ejemplo de Test

```typescript
// tests/unit/components/product-card.test.tsx
import { render, screen } from "@testing-library/react";
import { ProductCard } from "@/modules/products/components/product-card";

describe("ProductCard", () => {
  it("should render product name", () => {
    render(<ProductCard product={mockProduct} />);

    expect(screen.getByTestId("product-name")).toHaveTextContent("FIFA 24");
  });
});
```
