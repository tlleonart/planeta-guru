"use client";

import { parseAsBoolean, useQueryState } from "nuqs";

export interface UseShareModalProps {
  productType: string;
  productSlug: string;
}

/**
 * Hook personalizado para manejar estado del modal de compartir
 * Usa nuqs para sincronizar el estado con la URL query string
 */
export const useShareModal = ({
  productType,
  productSlug,
}: UseShareModalProps) => {
  const [isOpen, setIsOpen] = useQueryState(
    "share-product",
    parseAsBoolean.withDefault(false).withOptions({ clearOnDefault: true }),
  );

  const open = () => setIsOpen(true);
  const close = () => setIsOpen(false);

  return {
    isOpen,
    setIsOpen,
    open,
    close,
    productType,
    productSlug,
  };
};
