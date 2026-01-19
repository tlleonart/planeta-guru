import type { FC } from "react";
import { BuyButton } from "@/modules/products/shared/components/buy-button";
import { PriceBadge } from "@/modules/products/shared/components/price-badge";
import { GameHTMLInteractions } from "./game-html-interactions";

export interface GameHTMLCardProps {
  name: string;
  price: number;
  description: string;
  productType: string;
  rating: number;
  categoryName: string;
  slug: string;
  isFavorite: boolean;
  isOwner: boolean;
  walletAmount: number;
  productId: number;
  favoriteId?: number;
  productTypeId?: number;
}

/**
 * Server Component con Client Islands: Card principal de Game HTML
 * - Muestra información del producto (Server)
 * - GameHTMLInteractions es Client Island
 * - BuyButton es Client Island
 */
export const GameHTMLCard: FC<GameHTMLCardProps> = ({
  name,
  price,
  description,
  productType,
  rating,
  categoryName,
  slug,
  isFavorite,
  isOwner,
  productId,
  favoriteId,
  walletAmount,
  productTypeId,
}) => {
  return (
    <div className="absolute top-20 left-8 md:top-50 md:left-44 md:right-auto md:w-1/3 lg:w-1/3 xl:w-1/4 w-5/6">
      <div className="flex flex-col gap-1 mt-4 md:mt-0 bg-main/20 p-4 sm:p-6 md:p-3 lg:p-6 backdrop-blur-lg">
        {/* Título - Server */}
        <h2 className="text-xl sm:text-2xl font-bold mb-1 md:mb-1 mt-2">
          {name}
        </h2>

        <div>
          {/* Interacciones - Client Island */}
          <GameHTMLInteractions
            categoryName={categoryName}
            productType={productType}
            rating={rating}
            slug={slug}
            isFavorite={isFavorite}
            productId={productId}
            favoriteId={favoriteId}
          />

          {/* Descripción - Server */}
          <p className="text-sm md:min-h-[4.5rem] sm:text-base line-clamp-3 md:line-clamp-none">
            {description}
          </p>
        </div>

        {/* Precio - Server */}
        <div className="flex gap-2 w-1-3">
          <PriceBadge price={price} />
        </div>

        {/* Botón de compra - Client Island */}
        <div className="flex justify-start">
          <BuyButton
            isOwner={isOwner}
            slug={slug}
            price={price}
            walletAmount={walletAmount}
            productTypeId={productTypeId}
          />
        </div>
      </div>
    </div>
  );
};
