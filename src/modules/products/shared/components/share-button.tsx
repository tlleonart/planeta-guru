"use client";

import Image from "next/image";
import type { FC } from "react";
import ShareIcon from "@/modules/shared/assets/share-star-button.svg";
import { cn } from "@/modules/shared/lib/utils";

export interface ShareButtonProps {
  onClick: () => void;
  size?: "small" | "default";
  className?: string;
}

/**
 * Client Component: Botón simple para compartir
 * Solo maneja el click, el modal lo maneja el hook
 */
export const ShareButton: FC<ShareButtonProps> = ({
  onClick,
  size = "default",
  className,
}) => {
  const iconSize =
    size === "small" ? "w-3 h-3 md:w-4 md:h-4" : "w-3.5 h-3.5 md:w-5 md:h-5";

  return (
    <button
      className={cn("my-2 flex items-center cursor-pointer", className)}
      onClick={onClick}
      type="button"
      aria-label="Share product"
    >
      <Image
        src={ShareIcon}
        alt="Share"
        className={cn(iconSize, "text-indigo-300 stroke-2")}
      />
    </button>
  );
};
