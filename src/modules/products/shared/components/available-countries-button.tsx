"use client";

import Image from "next/image";
import type { FC } from "react";
import Info from "@/modules/shared/assets/information.svg";
import { Button } from "@/modules/shared/components/ui/button";
import type { Country } from "@/modules/shared/types/product-types";
import { useAvailableCountriesModal } from "../hooks/use-available-countries-modal";
import { AvailableCountriesModal } from "./available-countries-modal";

export interface AvailableCountriesButtonProps {
  countries: Country[];
}

/**
 * Client Component: Botón para mostrar países disponibles
 * - Abre modal con lista de países
 * - Ícono de información
 * - Usa hook personalizado para state management
 */
export const AvailableCountriesButton: FC<AvailableCountriesButtonProps> = ({
  countries,
}) => {
  const { isOpen, setIsOpen, open } = useAvailableCountriesModal({
    countries,
  });

  return (
    <>
      <Button
        variant="ghost"
        size="icon"
        className="z-30 text-xs sm:text-sm md:text-base rounded-none cursor-pointer mt-1"
        onClick={open}
      >
        <Image
          src={Info}
          alt="Region Information"
          className="z-30 w-3 md:w-4"
          style={{ filter: "brightness(0) invert(1)" }}
        />
      </Button>
      <AvailableCountriesModal
        isOpen={isOpen}
        onOpenChange={setIsOpen}
        countries={countries}
      />
    </>
  );
};
