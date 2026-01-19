# Modulo Home

## Vision General

El modulo Home es la pagina principal de Planeta Guru. Muestra contenido destacado, categorias, productos populares y banners promocionales.

## Estructura de Archivos

```
src/modules/home/
├── components/
│   ├── ad-banner-card.tsx        # Card de banner publicitario
│   ├── ad-banner-wrapper.tsx     # Wrapper para banners
│   ├── categories-grid.tsx       # Grid de categorias
│   ├── main-carousel.tsx         # Carousel principal
│   └── product-row.tsx           # Fila de productos horizontal
└── home-page.tsx                 # Pagina principal
```

## Componentes

### HomePage

Componente principal que orquesta todos los elementos de la pagina de inicio.

```typescript
// src/modules/home/home-page.tsx
import type { FC } from "react";
import { MainCarousel } from "./components/main-carousel";
import { CategoriesGrid } from "./components/categories-grid";
import { ProductRow } from "./components/product-row";
import { AdBannerWrapper } from "./components/ad-banner-wrapper";
import { api } from "@/app/server/server";

export const HomePage: FC = async () => {
  const [categories, featuredProducts, banners] = await Promise.all([
    api.categories.list(),
    api.product.getFeatured(),
    api.banners.getForHome(),
  ]);

  return (
    <main className="container mx-auto py-8 space-y-8">
      <MainCarousel items={banners.carousel} />

      <section>
        <h2 className="text-2xl font-bold mb-4">Categorias</h2>
        <CategoriesGrid categories={categories} />
      </section>

      <AdBannerWrapper banner={banners.midBanner} />

      <section>
        <h2 className="text-2xl font-bold mb-4">Destacados</h2>
        <ProductRow products={featuredProducts} />
      </section>
    </main>
  );
};
```

### MainCarousel

Carousel hero con autoplay para mostrar promociones principales.

```typescript
// src/modules/home/components/main-carousel.tsx
"use client";

import type { FC } from "react";
import useEmblaCarousel from "embla-carousel-react";
import Autoplay from "embla-carousel-autoplay";

interface MainCarouselProps {
  items: CarouselItem[];
}

export const MainCarousel: FC<MainCarouselProps> = ({ items }) => {
  const [emblaRef] = useEmblaCarousel({ loop: true }, [
    Autoplay({ delay: 5000 }),
  ]);

  return (
    <div className="overflow-hidden rounded-lg" ref={emblaRef}>
      <div className="flex">
        {items.map((item) => (
          <div key={item.id} className="flex-[0_0_100%]">
            <img
              src={item.imageUrl}
              alt={item.title}
              className="w-full h-auto object-cover"
            />
          </div>
        ))}
      </div>
    </div>
  );
};
```

### CategoriesGrid

Grid de categorias con navegacion a cada categoria.

```typescript
// src/modules/home/components/categories-grid.tsx
import type { FC } from "react";
import { Link } from "@/i18n/navigation";
import { Card, CardContent } from "@/components/ui/card";

interface CategoriesGridProps {
  categories: Category[];
}

export const CategoriesGrid: FC<CategoriesGridProps> = ({ categories }) => {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
      {categories.map((category) => (
        <Link
          key={category.id}
          href={`/categories/${category.id}`}
          className="block"
        >
          <Card className="hover:shadow-lg transition-shadow">
            <CardContent className="p-4 text-center">
              <img
                src={category.iconUrl}
                alt={category.name}
                className="w-12 h-12 mx-auto mb-2"
              />
              <h3 className="font-medium text-sm">{category.name}</h3>
            </CardContent>
          </Card>
        </Link>
      ))}
    </div>
  );
};
```

### ProductRow

Fila horizontal de productos con scroll.

```typescript
// src/modules/home/components/product-row.tsx
import type { FC } from "react";
import { ProductCard } from "@/modules/shared/components/products/product-card";

interface ProductRowProps {
  products: Product[];
}

export const ProductRow: FC<ProductRowProps> = ({ products }) => {
  return (
    <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide">
      {products.map((product) => (
        <div key={product.id} className="flex-shrink-0 w-48">
          <ProductCard product={product} />
        </div>
      ))}
    </div>
  );
};
```

## Ruta

```typescript
// src/app/[locale]/(root)/home/page.tsx
import { HomePage } from "@/modules/home/home-page";

export default function HomeRoute() {
  return <HomePage />;
}
```

## API Utilizada

| Endpoint | Descripcion |
|----------|-------------|
| `api.categories.list()` | Lista de categorias |
| `api.product.getFeatured()` | Productos destacados |
| `api.banners.getForHome()` | Banners de la pagina |

## Consideraciones

### Performance

- El carousel usa lazy loading para imagenes
- Las categorias se cachean por 1 hora
- Los productos destacados se revalidan cada 30 minutos

### Responsive

- Grid de categorias: 2 columnas (mobile), 4 (tablet), 6 (desktop)
- Carousel: Altura adaptativa segun viewport
- ProductRow: Scroll horizontal en mobile

### Accesibilidad

- Carousel tiene controles de navegacion con teclado
- Todas las imagenes tienen alt text
- Links son focuseables y tienen indicador visual
