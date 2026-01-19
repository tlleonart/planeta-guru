import type { FC, ReactNode } from "react";
import { GradientOverlay } from "@/modules/products/shared/components/gradient-overlay";
import { cn } from "@/modules/shared/lib/utils";

export interface GameKeyContainerProps {
  children: ReactNode;
  name: string;
  url?: string;
  variant?: "banner" | "info";
}

/**
 * Server Component: Container para Game Key con gradiente de fondo
 * - Dos variantes: "banner" (con padding top) e "info" (sin padding top)
 * - GradientOverlay proporciona el efecto visual de fondo
 * - Similar a GameHTMLContainer pero con soporte para variant info
 */
export const GameKeyContainer: FC<GameKeyContainerProps> = ({
  children,
  name,
  url,
  variant,
}) => {
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
              <GradientOverlay name={name} url={url} variant={variant} />
              {children}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
