import type { FC } from "react";
import { ProductHeader } from "@/modules/products/shared/components/product-header";
import { ProductInteractions } from "@/modules/products/shared/components/product-interactions";
import type { Spec } from "@/modules/shared/types/product-types";

export interface GameKeyInteractionsProps {
  productId: number;
  productType: string;
  productTypeId: number;
  productSlug: string;
  storeId: number;
  region: string;
  specs: Spec[];
  isFavorite: boolean;
  favoriteId?: number;
}

/**
 * Server Component con Client Islands: Interacciones del Game Key
 * - ProductHeader (Server): Badges de tipo, región y sistema
 * - ProductInteractions (Client Island): Favoritos y compartir
 * - Combina ambos en un layout horizontal
 */
export const GameKeyInteractions: FC<GameKeyInteractionsProps> = ({
  productId,
  productType,
  productTypeId,
  productSlug,
  storeId,
  region,
  specs,
  isFavorite,
  favoriteId,
}) => {
  return (
    <div className="flex flex-row items-center justify-between">
      <ProductHeader
        type={productType}
        typeId={productTypeId}
        storeId={storeId}
        specs={specs}
        region={region}
      />
      <ProductInteractions
        productId={productId}
        productType={productType}
        productSlug={productSlug}
        initialIsFavorite={isFavorite}
        initialFavoriteId={favoriteId}
        size="small"
      />
    </div>
  );
};
