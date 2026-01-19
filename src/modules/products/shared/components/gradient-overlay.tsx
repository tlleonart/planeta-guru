import type { FC } from "react";
import { cn } from "@/modules/shared/lib/utils";

export interface GradientOverlayProps {
  name: string;
  url?: string;
  variant?: "banner" | "info";
}

/**
 * Server Component: Gradient overlay para fondos de productos
 * Crea un efecto de desenfoque y gradiente sobre la imagen de fondo
 * No tiene estado ni interactividad - Optimizado para RSC
 */
export const GradientOverlay: FC<GradientOverlayProps> = ({
  name: _name,
  url,
  variant = "banner",
}) => {
  return (
    <div className="absolute aspect-square -z-10 md:aspect-auto md:inset-0 overflow-hidden rounded-none">
      {/* Top Gradient - Ajustado según variant */}
      <div
        aria-hidden="true"
        className={cn(
          "absolute inset-0 z-10 bg-gradient-to-b from-main via-transparent to-main md:object-top w-full h-full",
          variant === "info" && "from-main via-gray-600/20 to-main",
        )}
      />

      {/* Left Gradient */}
      <div className="absolute inset-y-0 left-0 w-44 bg-gradient-to-r from-main to-transparent z-20" />

      {/* Right Gradient */}
      <div className="absolute inset-y-0 right-0 w-44 bg-gradient-to-l from-main to-transparent z-20" />

      {/* Background Image con blur y filtros */}
      {url && (
        <div
          style={{
            backgroundImage: `url(${url})`,
            backgroundSize: "cover",
            backgroundPosition: variant === "info" ? "top" : "bottom",
            filter: "blur(40px) grayscale(0.8) contrast(4)",
            opacity: "0.15",
            ...(variant === "info" && {
              transform: "rotate(180deg) scaleX(-1)",
            }),
          }}
          className="absolute z-5 md:object-top w-full h-full"
        />
      )}
    </div>
  );
};
