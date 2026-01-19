"use client";

import { parseAsBoolean, useQueryState } from "nuqs";
import type { Country } from "@/modules/shared/types/product-types";

export interface UseAvailableCountriesModalProps {
  countries: Country[];
}

/**
 * Custom hook para manejar el estado del modal de países disponibles
 * - Usa nuqs para sincronizar state con URL
 * - Retorna métodos para abrir/cerrar modal y state del modal
 */
export const useAvailableCountriesModal = ({
  countries,
}: UseAvailableCountriesModalProps) => {
  const [isOpen, setIsOpen] = useQueryState(
    "available-countries",
    parseAsBoolean.withDefault(false).withOptions({ clearOnDefault: true }),
  );

  const open = () => setIsOpen(true);
  const close = () => setIsOpen(false);

  return {
    isOpen,
    setIsOpen,
    open,
    close,
    countries,
  };
};
