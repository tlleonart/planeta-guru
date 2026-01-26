"use client";

import { useTranslations } from "next-intl";
import type { FC } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/modules/shared/components/ui/dialog";
import type { Country } from "@/modules/shared/types/product-types";
import { ListedDescription } from "./listed-description";

export interface AvailableCountriesModalProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  countries: Country[];
}

/**
 * Client Component: Modal de países disponibles
 * - Muestra lista de países donde el producto está disponible
 * - Divide en 2 columnas si hay más de 8 países
 * - i18n con next-intl
 */
export const AvailableCountriesModal: FC<AvailableCountriesModalProps> = ({
  isOpen,
  onOpenChange,
  countries,
}) => {
  const t = useTranslations("AvailableCountries");
  const maxListCount = 8;

  const countryStrings = countries.map((country) =>
    typeof country === "object" && country.name
      ? country.name
      : String(country),
  );

  const splitCountries = () => {
    if (countryStrings.length > maxListCount) {
      const mid = Math.ceil(countryStrings.length / 2);
      return [countryStrings.slice(0, mid), countryStrings.slice(mid)];
    }
    return [countryStrings];
  };

  const splittedCountries = splitCountries();

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="w-full md:w-fit sm:max-w-lg border-none p-5 md:p-10 text-foreground rounded-none">
        <DialogHeader className="w-full flex flex-col text-center p-4">
          <DialogTitle className="w-full text-center text-xl">
            {t("title")}
          </DialogTitle>
          <DialogDescription className="sr-only">
            {t("title")}
          </DialogDescription>
        </DialogHeader>
        <div className="z-1 flex flex-col gap-6 w-full md:w-fit md:p-6 md:pt-6">
          <div className="grid w-full grid-cols-2 content-center md:grid-cols-2 grid-flow-row gap-16 pt-2 px-4">
            {splittedCountries.map((chunk) => (
              <ListedDescription
                key={chunk.join("-")}
                type="bullets"
                textStyling="px-2 font-medium"
                description={chunk}
              />
            ))}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
