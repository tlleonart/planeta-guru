import type { FC, ReactNode } from "react";
import { GradientOverlay } from "@/modules/products/shared/components/gradient-overlay";
import { getBannersByDevice } from "@/modules/products/shared/lib/get-media";
import { cn } from "@/modules/shared/lib/utils";
import type { Product } from "@/modules/shared/types/product-types";
import { SubscriptionBanner } from "./subscription-banner";

export interface SubscriptionContainerProps {
  children: ReactNode;
  product: Product;
  variant?: "info" | "banner";
}

/**
 * Server Component: Container para Subscription con gradiente/banner
 * - Dos variantes: "banner" (con banner de fondo) e "info" (con gradiente)
 * - Banner variant: Muestra SubscriptionBanner de fondo
 * - Info variant: Muestra GradientOverlay de fondo
 * - Similar a GiftCardContainer en estructura y comportamiento
 */
export const SubscriptionContainer: FC<SubscriptionContainerProps> = ({
  children,
  product,
  variant,
}) => {
  const desktopImage = getBannersByDevice(product.media || [], "desktop");
  const mobileImage = getBannersByDevice(product.media || [], "mobile");

  return (
    <div
      className={cn(
        "relative h-full md:pt-16",
        variant === "info" && "md:pt-0",
      )}
    >
      <div className="overflow-hidden h-full">
        <div className="h-full flex">
          <div className="flex-[0_0_100%] h-full relative">
            <div className="flex flex-col md:block">
              {variant === "banner" && (
                <SubscriptionBanner
                  name={product.name}
                  desktopImage={desktopImage}
                  mobileImage={mobileImage}
                />
              )}
              {variant === "info" && (
                <GradientOverlay
                  name={product.name}
                  url={desktopImage}
                  variant={variant}
                />
              )}
              {children}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
