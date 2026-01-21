import type { FC } from "react";
import type { Product } from "@/modules/shared/types/product-types";
import { About } from "../shared/components/about";
import { Bullets } from "../shared/components/bullets";
import { getDescription } from "../shared/lib/get-descriptions";
import { getBannersByDevice } from "../shared/lib/get-media";
import { GameKeyCard } from "./components/game-key-card";
import { GameKeyContainer } from "./components/game-key-container";
import { GameKeyInfoTable } from "./components/game-key-info-table";
import { GameKeyLanguageTable } from "./components/game-key-language-table";
import { GameKeyRequirements } from "./components/game-key-requirements";

export interface GameKeyPageProps {
  product: Product;
  walletAmount?: number;
  walletId?: number;
}

/**
 * Server Component: Página principal de Game Key
 * - Recibe el producto ya fetched
 * - Estructura de 3 secciones: Banner con card, Info detallada, Categorías relacionadas
 * - Más compleja que GameHTMLPage (incluye requisitos de sistema, tabla de idiomas)
 */
export const GameKeyPage: FC<GameKeyPageProps> = ({
  product,
  walletAmount = 0,
  walletId = 0,
}) => {
  const desktopBanner = getBannersByDevice(product.media || [], "desktop");
  const mobileBanner = getBannersByDevice(product.media || [], "mobile");
  // Bug #6: Use getDescription to prioritize long description over short
  const description = getDescription(product.descriptions || []);
  const bundle = product.bundles[0];
  const price = bundle?.price || 0;
  const discount = bundle?.discount?.percentage;
  const region = bundle?.region?.name || "";

  return (
    <main>
      {/* Sección 1: Banner con card */}
      <section className="h-full md:h-screen pt-8">
        <GameKeyContainer
          name={product.name}
          url={product.media?.[0]?.url}
          variant="banner"
        >
          <GameKeyCard
            productId={product.id}
            name={product.name}
            description={description}
            price={price}
            discount={discount}
            productType={product.productType?.name || ""}
            productTypeId={product.productTypeId}
            productSlug={product.slug}
            storeId={bundle?.storeId || 0}
            region={region}
            specs={product.specs || []}
            isFavorite={product.isFavorite}
            favoriteId={product.favoriteId}
            desktopImage={desktopBanner}
            mobileImage={mobileBanner}
            url={product.media?.[0]?.url || ""}
            walletAmount={walletAmount}
            walletId={walletId}
            bundleId={bundle?.id || 0}
            bundleTitle={bundle?.title || ""}
          />
        </GameKeyContainer>
      </section>

      {/* Sección 2: Información detallada */}
      <section className="h-full mb-4">
        <GameKeyContainer
          name={product.name}
          url={product.media?.[0]?.url}
          variant="info"
        >
          <div className="flex flex-col p-5 m-4 md:p-10 md:pb-14 gap-8 md:gap-16 md:m-16 border border-white">
            <About descriptions={product.descriptions || []} />
            <div className="grid md:grid-cols-2 gap-8 md:gap-4">
              <Bullets descriptions={product.descriptions || []} />
              <div className="flex flex-col gap-6 md:gap-12">
                <GameKeyInfoTable
                  categories={product.categories}
                  specs={product.specs || []}
                  name={product.name}
                />
                <GameKeyLanguageTable specs={product.specs || []} />
              </div>
            </div>
            <GameKeyRequirements specs={product.specs || []} />
          </div>
        </GameKeyContainer>
      </section>

      {/* Sección 3: Categorías relacionadas - TODO: Implementar cuando se migre el carousel */}
      <section className="mb-8">
        {/* <CategoryCarousel categoryId={7} label="RelatedContent" /> */}
      </section>
    </main>
  );
};
