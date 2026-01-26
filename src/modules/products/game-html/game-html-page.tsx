import type { FC } from "react";
import type { Product } from "@/modules/shared/types/product-types";
import { getDescription } from "../shared/lib/get-descriptions";
import {
  GameHTMLCard,
  GameHTMLContainer,
  GameHTMLInfoTable,
} from "./components";

export interface GameHTMLPageProps {
  product: Product;
  walletAmount?: number;
  walletId?: number;
}

/**
 * Server Component: Página principal de Game HTML
 * - Recibe el producto ya fetched
 * - Estructura de 3 secciones: Banner, Info, Categories
 */
export const GameHTMLPage: FC<GameHTMLPageProps> = ({
  product,
  walletAmount = 0,
  walletId = 0,
}) => {
  // Extraer datos necesarios
  const categoryName = product.categories[0]?.categoryLanguages[0]?.name || "";
  // Bug #6: Use getDescription to prioritize long description over short
  const description = getDescription(product.descriptions || []);
  const bundle = product.bundles[0];
  const price = bundle?.price || 0;

  return (
    <main>
      {/* Sección 1: Banner con Card overlay */}
      <section className="h-full md:h-screen">
        <GameHTMLContainer product={product} variant="banner">
          <GameHTMLCard
            name={product.name}
            price={price}
            description={description}
            productType={product.productType?.name || ""}
            rating={product.rating}
            categoryName={categoryName}
            slug={product.slug}
            isFavorite={product.isFavorite}
            isOwner={product.isOwner}
            walletAmount={walletAmount}
            walletId={walletId}
            bundleId={bundle?.id || 0}
            bundleTitle={bundle?.title || ""}
            productId={product.id}
            favoriteId={product.favoriteId}
          />
        </GameHTMLContainer>
      </section>

      {/* Sección 2: Información detallada */}
      <section className="h-full mb-2 md:mb-4">
        <GameHTMLContainer product={product} variant="info">
          <div className="flex flex-col gap-4 p-8 md:p-16">
            <h3 className="text-2xl font-bold mb-4">{product.name}</h3>
            <GameHTMLInfoTable
              name={product.name}
              categories={product.categories}
              specs={product.specs || []}
            />
          </div>
        </GameHTMLContainer>
      </section>

      {/* Sección 3: Categorías relacionadas */}
      {/* TODO: Implementar GameHTMLCategoryCarousel cuando migremos home carousel */}
      <section className="mb-4 md:mb-8">
        <div className="p-8 md:p-16">
          <h3 className="text-xl font-bold mb-4">Juegos Relacionados</h3>
          {/* TODO: Carousel de categorías */}
        </div>
      </section>
    </main>
  );
};
