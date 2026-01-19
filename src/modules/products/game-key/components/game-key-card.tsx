import type { FC } from "react";
import { BuyButton } from "@/modules/products/shared/components/buy-button";
import { PriceBadge } from "@/modules/products/shared/components/price-badge";
import { Badge } from "@/modules/shared/components/ui/badge";
import type { Spec } from "@/modules/shared/types/product-types";
import { GameKeyBanner } from "./game-key-banner";
import { GameKeyInteractions } from "./game-key-interactions";

export interface GameKeyCardProps {
  productId: number;
  name: string;
  description: string;
  price: number;
  discount?: number;
  productType: string;
  productTypeId: number;
  productSlug: string;
  storeId: number;
  region: string;
  specs: Spec[];
  isFavorite: boolean;
  favoriteId?: number;
  desktopImage: string;
  mobileImage: string;
  url: string;
  walletAmount: number;
}

/**
 * Server Component con Client Islands: Card principal de Game Key
 * - Muestra información del producto (Server)
 * - GameKeyBanner (Server): Banner del producto
 * - GameKeyInteractions (Hybrid): ProductHeader (Server) + Favorites/Share (Client)
 * - BuyButton (Client Island): Botón de compra
 * - Similar a GameHTMLCard pero incluye discount badge y region
 */
export const GameKeyCard: FC<GameKeyCardProps> = ({
  productId,
  name,
  description,
  price,
  discount,
  productType,
  productTypeId,
  productSlug,
  storeId,
  region,
  specs,
  isFavorite,
  favoriteId,
  desktopImage,
  mobileImage,
  url,
  walletAmount,
}) => {
  return (
    <div className="md:absolute md:left-44 md:right-auto md:w-1/3 lg:w-1/3 xl:w-1/4 w-full">
      <GameKeyBanner
        name={name}
        desktopImage={desktopImage}
        mobileImage={mobileImage}
        url={url}
      />
      <div className="flex flex-col gap-1 mt-0 md:mt-0 bg-white/20 px-5 py-4 backdrop-blur-sm">
        <GameKeyInteractions
          productId={productId}
          productType={productType}
          productTypeId={productTypeId}
          productSlug={productSlug}
          storeId={storeId}
          region={region}
          specs={specs}
          isFavorite={isFavorite}
          favoriteId={favoriteId}
        />
        <h2 className="flex items-end text-xl sm:text-2xl font-bold mb-1 md:mb-1 md:min-h-12">
          {name}
        </h2>
        <p className="text-sm md:min-h-[4.5rem] sm:text-base line-clamp-3 md:line-clamp-none">
          {description}
        </p>
        <div className="flex gap-2 w-1-3">
          {discount && <Badge variant="discount">{discount}% OFF</Badge>}
          <PriceBadge price={price} />
        </div>
        <div className="flex justify-start">
          <BuyButton
            slug={productSlug}
            price={price}
            walletAmount={walletAmount}
          />
        </div>
      </div>
    </div>
  );
};
