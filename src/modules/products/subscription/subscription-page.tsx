import type { FC } from "react";
import type { Product } from "@/modules/shared/types/product-types";
import { About } from "../shared/components/about";
import { Bullets } from "../shared/components/bullets";
import { BundlesGrid } from "../shared/components/bundles-grid";
import { Exclusive } from "../shared/components/exclusive";
import { ImageCarousel } from "../shared/components/image-carousel";
import { Instructions } from "../shared/components/instructions";
import { getDescription } from "../shared/lib/get-descriptions";
import { SubscriptionCard } from "./components/subscription-card";
import { SubscriptionContainer } from "./components/subscription-container";

export interface SubscriptionPageProps {
  product: Product;
  walletAmount?: number;
  walletId?: number;
}

/**
 * Server Component: Página principal de Subscription
 * - Recibe el producto ya fetched
 * - Estructura de 3 secciones: Banner con card, Info detallada, Categorías relacionadas
 * - Características únicas: BundlesGrid (si > 1 bundle), Exclusive, Instructions
 * - Similar a GiftCardPage en estructura y comportamiento
 */
export const SubscriptionPage: FC<SubscriptionPageProps> = ({
  product,
  walletAmount = 0,
  walletId = 0,
}) => {
  // Bug #6: Use getDescription to prioritize long description over short
  const description = getDescription(product.descriptions || []);
  const price = product.bundles[0]?.price || 0;
  const region = product.bundles[0]?.region?.name || "";
  const regionId = product.bundles[0]?.regionId || 0;
  const countries = product.bundles[0]?.region?.countries;

  return (
    <main>
      {/* Sección 1: Banner con card */}
      <section className="h-full md:h-screen pt-16 md:pt-6">
        <SubscriptionContainer product={product} variant="banner">
          <SubscriptionCard
            productId={product.id}
            name={product.name}
            description={description}
            price={price}
            productType={product.productType?.name || ""}
            productTypeId={product.productTypeId}
            productSlug={product.slug}
            storeId={product.bundles[0]?.storeId || 0}
            region={region}
            specs={product.specs || []}
            isFavorite={product.isFavorite}
            favoriteId={product.favoriteId}
            bundlesLength={product.bundles.length}
            bundleName={product.bundles[0]?.title}
            walletAmount={walletAmount}
          />
        </SubscriptionContainer>
      </section>

      {/* Sección 2: Información detallada */}
      <section className="h-full mb-2 md:mb-4">
        <SubscriptionContainer product={product} variant="info">
          {/* Grid de bundles (solo si hay múltiples) */}
          {product.bundles.length > 1 && (
            <div className="md:p-16 md:pb-0">
              <BundlesGrid
                bundles={product.bundles}
                walletAmount={walletAmount}
                walletId={walletId}
                productName={product.name}
              />
            </div>
          )}

          {/* Carrusel de imágenes */}
          {product.media && product.media.length > 0 && (
            <div className="p-5 md:p-16 md:pb-0">
              <ImageCarousel
                images={product.media}
                productName={product.name}
              />
            </div>
          )}

          {/* Info detallada */}
          <div className="flex flex-col p-5 m-4 md:p-10 md:pb-14 gap-8 md:m-16 border border-white">
            <Exclusive
              bundle={product.bundles[0]}
              regionId={regionId}
              countries={countries}
            />
            <About descriptions={product.descriptions || []} />
            <Bullets descriptions={product.descriptions || []} />
            <Instructions descriptions={product.descriptions || []} />
          </div>
        </SubscriptionContainer>
      </section>

      {/* Sección 3: Categorías relacionadas - TODO: Implementar cuando se migre el carousel */}
      <section className="mb-4 md:mb-8">
        {/* <CategoryCarousel categoryId={7} label="RelatedContent" /> */}
      </section>
    </main>
  );
};
