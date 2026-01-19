import type { FC } from "react";
import { PriceBadge } from "@/modules/products/shared/components/price-badge";
import { ProductHeader } from "@/modules/products/shared/components/product-header";
import { ProductInteractions } from "@/modules/products/shared/components/product-interactions";
import { Badge } from "@/modules/shared/components/ui/badge";
import { cn } from "@/modules/shared/lib/utils";
import type { Spec } from "@/modules/shared/types/product-types";
import { ComboBuyButton } from "./combo-buy-button";

export interface ComboCardProps {
  productId: number;
  productName: string;
  description: string;
  price: number;
  currency: string;
  productType: string;
  productTypeId: number;
  productSlug: string;
  storeId: number;
  region: string;
  specs: Spec[];
  isFavorite: boolean;
  favoriteId?: number;
  bundlesLength: number;
  bundleId: number;
  bundleTitle: string;
}

/**
 * Server Component con Client Islands: Card principal de Combo
 * - Similar a GiftCardCard pero con ComboBuyButton
 * - Muestra bundle title si solo hay 1 bundle
 * - ProductHeader + ProductInteractions (Client Islands)
 * - ComboBuyButton (Client Island) - abre ComboSummary modal
 */
export const ComboCard: FC<ComboCardProps> = ({
  productId,
  productName,
  description,
  price,
  currency,
  productType,
  productTypeId,
  productSlug,
  storeId,
  region,
  specs,
  isFavorite,
  favoriteId,
  bundlesLength,
  bundleId,
  bundleTitle,
}) => {
  return (
    <div className="absolute top-20 left-8 md:top-50 md:left-44 md:right-auto md:w-1/3 lg:w-1/3 xl:w-1/4 w-5/6">
      <div className="flex flex-col gap-1 mt-4 md:mt-0 bg-main/20 p-4 sm:p-6 md:p-3 lg:p-6 backdrop-blur-lg">
        <div className="flex flex-row justify-between">
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
        <h2 className="text-xl sm:text-2xl font-bold mb-1 md:mb-1 mt-2">
          {productName}
        </h2>
        <div>
          <p className="text-sm md:min-h-[4.5rem] sm:text-base line-clamp-3 md:line-clamp-none">
            {description}
          </p>
        </div>
        {bundlesLength <= 1 && bundleTitle && (
          <div className="flex gap-2 w-1-3">
            <Badge>{bundleTitle}</Badge>
            <PriceBadge price={price} currency={currency} />
          </div>
        )}
        <div
          className={cn(
            "flex justify-start mt-6",
            bundlesLength <= 1 && "mt-0",
          )}
        >
          <ComboBuyButton
            productName={productName}
            bundleId={bundleId}
            bundleTitle={bundleTitle}
            price={price}
            currency={currency}
          />
        </div>
      </div>
    </div>
  );
};
