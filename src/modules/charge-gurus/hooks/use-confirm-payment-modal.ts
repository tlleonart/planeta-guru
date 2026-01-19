"use client";

import { parseAsBoolean, useQueryState } from "nuqs";

/**
 * Custom hook para manejar el estado del modal de confirmación de payment
 * - Usa nuqs para sincronizar state con URL
 * - Retorna métodos para abrir/cerrar modal y state del modal
 */
export const useConfirmPaymentModal = () => {
  const [isOpen, setIsOpen] = useQueryState(
    "confirm-payment-modal",
    parseAsBoolean.withDefault(false).withOptions({ clearOnDefault: true }),
  );

  const open = () => setIsOpen(true);
  const close = () => setIsOpen(false);

  return {
    isOpen,
    setIsOpen,
    open,
    close,
  };
};
