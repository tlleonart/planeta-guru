import Image from "next/image";
import { getTranslations } from "next-intl/server";
import type { FC } from "react";
import Check from "@/modules/shared/assets/check-region.svg";
import { cn } from "@/modules/shared/lib/utils";
import type { Bundle, Country } from "@/modules/shared/types/product-types";
import { AvailableCountriesButton } from "./available-countries-button";

export interface ExclusiveProps {
  bundle: Bundle;
  regionId: number;
  countries?: Country[];
  className?: string;
}

/**
 * Server Component con Client Island: Mensaje de exclusividad regional
 * - Muestra si el producto está disponible en el país seleccionado
 * - Botón para ver países disponibles (Client Island)
 * - No se renderiza para región 1 (global)
 * - i18n con next-intl
 */
export const Exclusive: FC<ExclusiveProps> = async ({
  bundle,
  regionId,
  countries,
  className,
}) => {
  const t = await getTranslations("Exclusive");
  const available: boolean =
    bundle.availableIntoSelectedCountry?.available ?? false;
  const country: string | null =
    bundle.availableIntoSelectedCountry?.country ?? null;
  const countriesCount = countries?.length ?? 0;
  let text = "";

  if (!country) {
    text = t("country_not_found");
  } else if (available) {
    // Use "available_single" when only 1 country, "available" when multiple
    text =
      countriesCount <= 1
        ? t("available_single", { country })
        : t("available", { country });
  } else {
    text = t("text_not_available", { country });
  }

  // No mostrar para región global (id: 1)
  if (regionId === 1) {
    return null;
  }

  return (
    <div className={cn("flex flex-row items-center", className)}>
      <Image
        src={Check}
        alt="Check Region"
        className="w-4 md:w-6 h-4 md:h-6 mt-1 mr-3"
      />
      <h1 className="text-base md:text-2xl font-medium">{text}</h1>
      {countries && <AvailableCountriesButton countries={countries} />}
    </div>
  );
};
