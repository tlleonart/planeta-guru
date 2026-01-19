import type { FC, ReactNode } from "react";
import { GradientOverlay } from "@/modules/products/shared/components/gradient-overlay";
import { getBannersByDevice } from "@/modules/products/shared/lib/get-media";
import { cn } from "@/modules/shared/lib/utils";
import type { Product } from "@/modules/shared/types/product-types";
import { ComboBanner } from "./combo-banner";

export interface ComboContainerProps {
  children: ReactNode;
  product: Product;
  variant?: "info" | "banner";
}

/**
 * Server Component: Container para Combo con gradiente/banner
 * - Dos variantes: "banner" (con banner de fondo) e "info" (con gradiente)
 * - Banner variant: Muestra ComboBanner de fondo
 * - Info variant: Muestra GradientOverlay de fondo
 */
export const ComboContainer: FC<ComboContainerProps> = ({
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
      <div className="overflow-visible md:overflow-hidden h-full">
        <div className="h-full flex">
          <div className="flex-[0_0_100%] h-full relative">
            <div className="flex flex-col md:block">
              {variant === "banner" && (
                <ComboBanner
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
