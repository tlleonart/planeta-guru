import { getTranslations } from "next-intl/server";
import type { FC } from "react";
import { getDescription } from "@/modules/products/shared/lib/get-descriptions";
import { ReadMore } from "@/modules/shared/components/ui/read-more";
import type { Description } from "@/modules/shared/types/product-types";

export interface AboutProps {
  descriptions: Description[];
  readMore?: boolean;
}

/**
 * Server Component con Client Island: Sección "Acerca de" del producto
 * - Extrae descripción larga o corta desde descriptions
 * - Opcionalmente usa ReadMore para truncar texto largo
 * - Si readMore=false, muestra texto completo
 */
export const About: FC<AboutProps> = async ({
  descriptions,
  readMore = true,
}) => {
  const text = getDescription(descriptions);
  const t = await getTranslations("About");

  if (!text) {
    return null;
  }

  return (
    <div className="flex flex-col gap-2 md:gap-4 w-[99%]">
      <h1 className="sm:text-xl md:text-2xl font-medium">{t("title")}</h1>
      <div className="flex flex-col text-sm md:text-base w-full">
        {!readMore ? (
          text
        ) : text.length <= 300 ? (
          text
        ) : (
          <ReadMore text={text} maxLength={300} />
        )}
      </div>
    </div>
  );
};
