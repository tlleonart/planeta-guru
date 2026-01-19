import type { FC } from "react";
import { cn } from "@/modules/shared/lib/utils";
import type { Bundle } from "@/modules/shared/types/product-types";
import { ComboBundlesCard } from "./combo-bundles-card";

export interface ComboBundlesGridProps {
  bundles: Bundle[];
  productName: string;
}

/**
 * Server Component con Client Islands: Grid de bundles para Combo
 * - Muestra grid de cards de bundles (ComboBundlesCard)
 * - Grid responsive: 1 columna mobile, 3 desktop
 * - Se oculta si solo hay 1 bundle
 * - ComboBundlesCard son Client Islands para interactividad
 */
export const ComboBundlesGrid: FC<ComboBundlesGridProps> = ({
  bundles,
  productName,
}) => {
  return (
    <div
      className={cn(
        "relative overflow-x-hidden w-full flex items-center justify-center md:justify-start pb-4 pt-4 md:pb-6 md:pt-6",
        bundles.length <= 1 && "hidden",
      )}
    >
      <div className="grid grid-cols-1 md:grid-cols-3 gap-y-1 md:gap-y-5 gap-x-1 md:gap-x-12 md:pl-1 md:pr-20">
        {bundles.map((bundle) => (
          <ComboBundlesCard
            key={bundle.id}
            id={bundle.id}
            title={bundle.title}
            price={bundle.finalPriceInCurrency}
            currency={bundle.currency}
            productName={productName}
          />
        ))}
      </div>
    </div>
  );
};
