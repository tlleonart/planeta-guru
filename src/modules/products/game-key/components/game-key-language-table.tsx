import Image from "next/image";
import { getTranslations } from "next-intl/server";
import type { FC } from "react";
import CheckIcon from "@/modules/shared/assets/language-check.svg";
import type { Spec } from "@/modules/shared/types/product-types";

export interface GameKeyLanguageTableProps {
  specs: Spec[];
}

/**
 * Server Component: Tabla de idiomas disponibles para Game Key
 * - Muestra idiomas (español/inglés) en columnas
 * - Filas: Interface, Voices, Subtitles
 * - Check icon si el idioma está disponible en esa categoría
 * - Usa specs para determinar disponibilidad
 */
export const GameKeyLanguageTable: FC<GameKeyLanguageTableProps> = async ({
  specs,
}) => {
  const t = await getTranslations("ProductLanguageTable");
  const thClass = "p-1 px-2 md:px-3 text-sm md:text-lg font-normal";
  const iconClass = "mx-auto";

  const hasSpec = (specType: number, langId: number): boolean => {
    return specs.some(
      (item) => item.spec?.id === specType && item.specValue?.id === langId,
    );
  };

  const languages = [
    { name: t("spanish"), id: 4 },
    { name: t("english"), id: 13 },
  ];

  const specTypes = [
    { key: "interface", name: t("interface"), id: 16 },
    { key: "voices", name: t("voices"), id: 15 },
    { key: "subtitles", name: t("subtitles"), id: 17 },
  ];

  return (
    <div className="overflow-x-auto">
      <table className="min-w-3/4 border-b text-white bg-transparent">
        <thead>
          <tr className="divide-x border-b">
            <th className={thClass}>{t("title")}</th>
            {specTypes.map((type) => (
              <th key={type.key} className={thClass}>
                {type.name}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {languages.map((language) => (
            <tr key={language.id} className="divide-x">
              <th className={thClass}>{language.name}</th>
              {specTypes.map((type) => (
                <td key={type.key}>
                  {hasSpec(type.id, language.id) && (
                    <Image
                      src={CheckIcon}
                      alt={`${language.name} ${type.key}`}
                      className={iconClass}
                    />
                  )}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
