import Image from "next/image";
import { getTranslations } from "next-intl/server";
import type { FC } from "react";
import { ListedDescription } from "@/modules/products/shared/components/listed-description";
import { getSystemIcon } from "@/modules/products/shared/lib/get-icons";
import {
  getRequirements,
  getSystem,
} from "@/modules/products/shared/lib/get-specs";
import type { Spec } from "@/modules/shared/types/product-types";

export interface GameKeyRequirementsProps {
  specs: Spec[];
}

/**
 * Server Component: Requisitos del sistema para Game Key
 * - Muestra requisitos mínimos y recomendados
 * - Grid de 2 columnas en desktop, 1 en mobile
 * - Ícono del sistema operativo (Windows/Mac)
 * - No se renderiza si no hay requisitos
 */
export const GameKeyRequirements: FC<GameKeyRequirementsProps> = async ({
  specs,
}) => {
  const t = await getTranslations("GameKeyRequeriments");

  // id: 2 = requisitos mínimos, id: 1 = requisitos recomendados
  const minRequirements = getRequirements(specs, 2);
  const recommendedRequirements = getRequirements(specs, 1);
  const system = getSystem(specs);
  const Icon = getSystemIcon(system[0]?.specValue?.name ?? "");

  // Si no hay requisitos, no renderizar
  if (minRequirements.length === 0 && recommendedRequirements.length === 0) {
    return null;
  }

  return (
    <div className="flex flex-col gap-3 md:gap-6">
      <h1 className="sm:text-xl md:text-2xl font-medium">{t("title")}</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 divide-y md:divide-y-0 md:divide-x">
        {/* Requisitos mínimos */}
        {minRequirements.length > 0 && (
          <div className="flex flex-col gap-1">
            <div className="flex flex-row gap-2 pl-1 md:pl-4">
              {Icon && (
                <Image
                  src={Icon}
                  alt="System"
                  className="relative md:hidden w-3"
                />
              )}
              <h2 className="font-medium md:font-semibold text-sm md:text-lg">
                {t("min")}
              </h2>
            </div>
            <ListedDescription
              type="bullets"
              description={minRequirements}
              listStyling="marker:text-blue"
            />
          </div>
        )}

        {/* Requisitos recomendados */}
        {recommendedRequirements.length > 0 && (
          <div className="flex flex-col gap-1 pl-0 md:pl-6 pt-4 md:pt-0">
            <div className="flex flex-row gap-2 pl-1 md:pl-4">
              {Icon && (
                <Image
                  src={Icon}
                  alt="System"
                  className="relative md:hidden w-3"
                />
              )}
              <h2 className="font-medium md:font-semibold text-sm md:text-lg">
                {t("rec")}
              </h2>
            </div>
            <ListedDescription
              type="bullets"
              description={recommendedRequirements}
            />
          </div>
        )}
      </div>
    </div>
  );
};
