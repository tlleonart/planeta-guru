import type { FC, HTMLAttributes, ReactNode } from "react";
import { cn } from "@/modules/shared/lib/utils";

export interface BadgeProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  variant?: "price" | "discount";
  size?: "sm" | "md";
  rounded?: boolean;
}

/**
 * Server Component: Badge genérico para etiquetar información
 * - Variantes: default, price, discount
 * - Tamaños: sm, md
 * - Opcionalmente sin bordes redondeados
 */
export const Badge: FC<BadgeProps> = ({
  children,
  className,
  variant,
  size: _size = "sm",
  rounded = true,
}) => {
  return (
    <div
      className={cn(
        "flex justify-center align-middle my-2 gap-2 bg-black/25 px-3 py-1 md:py-2 rounded-full text-white text-sm md:text-base items-center",
        variant === "price" &&
          "flex justify-center align-middle my-2 gap-2 bg-black/25 px-3 py-2 rounded-full text-white items-center",
        variant === "discount" && "bg-red-600/80 font-semibold",
        !rounded && "rounded-none",
        className,
      )}
    >
      {children}
    </div>
  );
};
