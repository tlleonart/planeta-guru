import type { FC } from "react";
import { cn } from "@/modules/shared/lib/utils";
import type { Bundle } from "@/modules/shared/types/product-types";
import { BundlesCard } from "./bundles-card";

export interface BundlesGridProps {
  bundles: Bundle[];
  walletAmount: number;
  walletId: number;
  productName: string;
}

/**
 * Server Component con Client Islands: Grid de bundles
 * - Muestra grid de cards de bundles (BundlesCard)
 * - Grid responsive: 1 columna mobile, 3 desktop
 * - Se oculta si solo hay 1 bundle
 * - BundlesCard son Client Islands para interactividad
 */
export const BundlesGrid: FC<BundlesGridProps> = ({
  bundles,
  walletAmount,
  walletId,
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
          <BundlesCard
            key={bundle.id}
            id={bundle.id}
            title={bundle.title}
            price={bundle.price}
            walletAmount={walletAmount}
            walletId={walletId}
            productName={productName}
            supportsCodes={!bundle.externalProviderId}
          />
        ))}
      </div>
    </div>
  );
};
