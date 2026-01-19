import type { FC } from "react";
import { AiFillStar } from "react-icons/ai";
import { ProductInteractions } from "@/modules/products/shared/components/product-interactions";

export interface GameHTMLInteractionsProps {
  categoryName: string;
  productType: string;
  rating: number;
  slug: string;
  isFavorite: boolean;
  productId: number;
  favoriteId?: number;
}

/**
 * Server Component con Client Island: Interacciones de Game HTML
 * - Muestra categoría y rating (Server)
 * - ProductInteractions es Client Island para favoritos/share
 */
export const GameHTMLInteractions: FC<GameHTMLInteractionsProps> = ({
  categoryName,
  productType,
  rating,
  slug,
  isFavorite,
  productId,
  favoriteId,
}) => {
  return (
    <div className="flex flex-row justify-start gap-1 items-center">
      {/* Categoría - Server Component */}
      <div className="text-left text-sm font-medium">{categoryName}</div>

      {/* Rating - Server Component */}
      <div className="flex items-center mx-2">
        <AiFillStar className="mx-1 text-yellow-400 h-6 w-6" />
        <p className="text-sm">{rating > 0 ? rating.toFixed(1) : "4.8"}</p>
      </div>

      {/* Client Island: Solo esta parte es interactiva */}
      <ProductInteractions
        productId={productId}
        productType={productType}
        productSlug={slug}
        initialIsFavorite={isFavorite}
        initialFavoriteId={favoriteId}
      />
    </div>
  );
};
