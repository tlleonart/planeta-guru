import type { FC, ReactNode } from "react";
import { GradientOverlay } from "@/modules/products/shared/components/gradient-overlay";
import { getBannersByDevice } from "@/modules/products/shared/lib/get-media";
import { cn } from "@/modules/shared/lib/utils";
import type { Product } from "@/modules/shared/types/product-types";
import { GameHTMLBanner } from "./game-html-banner";

export interface GameHTMLContainerProps {
  children: ReactNode;
  product: Product;
  variant?: "info" | "banner";
}

/**
 * Server Component: Contenedor principal de Game HTML
 * - Renderiza banner o gradient overlay según variant
 * - Wrapper visual con children
 * - 100% Server Component
 */
export const GameHTMLContainer: FC<GameHTMLContainerProps> = ({
  children,
  product,
  variant = "banner",
}) => {
  const desktopImage = getBannersByDevice(product.media, "desktop");
  const mobileImage = getBannersByDevice(product.media, "mobile");

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
                <GameHTMLBanner
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
