"use client";

import type { FC } from "react";
import { useShareModal } from "../hooks/use-share-modal";
import { FavoriteButton } from "./favorite-button";
import { ShareButton } from "./share-button";
import { ShareModal } from "./share-modal";

export interface ProductInteractionsProps {
  productId: number;
  productType: string;
  productSlug: string;
  initialIsFavorite?: boolean;
  initialFavoriteId?: number;
  size?: "small" | "default";
}

/**
 * Client Component: Wrapper que orquesta las interacciones del producto
 * - Botón de favoritos
 * - Botón de compartir
 * - Modal de compartir
 *
 * Separado en componentes pequeños para mejor performance
 */
export const ProductInteractions: FC<ProductInteractionsProps> = ({
  productId,
  productType,
  productSlug,
  initialIsFavorite,
  initialFavoriteId,
  size = "default",
}) => {
  const { isOpen, setIsOpen, open } = useShareModal({
    productType,
    productSlug,
  });

  return (
    <>
      <div className="flex flex-row gap-1 items-center">
        <FavoriteButton
          productId={productId}
          initialIsFavorite={initialIsFavorite}
          initialFavoriteId={initialFavoriteId}
          size={size}
        />
        <ShareButton onClick={open} size={size} />
      </div>

      <ShareModal
        isOpen={isOpen}
        onOpenChange={setIsOpen}
        productType={productType}
        productSlug={productSlug}
      />
    </>
  );
};
