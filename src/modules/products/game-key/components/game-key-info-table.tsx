"use client";

import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import type { FC } from "react";
import {
  getClassification,
  getDeveloper,
  getEditor,
  getReleaseDate,
} from "@/modules/products/shared/lib/get-specs";
import { cn } from "@/modules/shared/lib/utils";
import type { Category, Spec } from "@/modules/shared/types/product-types";

export interface GameKeyInfoTableProps {
  name: string;
  categories: Category[];
  specs: Spec[];
}

/**
 * Client Component: Tabla de información del Game Key
 * - Muestra título, categorías, clasificación, desarrollador, editor, fecha de lanzamiento
 * - Client porque usa router para navegación de categorías
 * - Más completa que GameHTMLInfoTable (incluye editor, release date, classification)
 */
export const GameKeyInfoTable: FC<GameKeyInfoTableProps> = ({
  name,
  categories,
  specs,
}) => {
  const router = useRouter();
  const t = useTranslations("ProductInfoTable");

  const tdMainClass = "p-1 px-3 text-sm md:text-lg";
  const tdSecondaryClass = "p-1 px-3 md:text-sm text-base";

  // Filtrar categoría de pruebas (id: 20)
  const filteredCategories = categories.filter(
    (category) => category.id !== 20,
  );

  const developer = getDeveloper(specs);
  const editor = getEditor(specs);
  const releaseDate = getReleaseDate(specs);
  const classification = getClassification(specs);

  const handleCategoryClick = (categoryId: number) => {
    router.push(`/categories/${categoryId}`);
  };

  const tableItems = [
    {
      title: t("title"),
      value: name,
      opacity: true,
    },
    {
      title: t("categories"),
      value: (
        <>
          {filteredCategories.map((category, index) => (
            <span key={category.id}>
              <button
                type="button"
                className="opacity-60 hover:cursor-pointer hover:opacity-90"
                onClick={() => handleCategoryClick(category.id)}
              >
                {category.categoryLanguages[0]?.name}
              </button>
              {index < filteredCategories.length - 1 && (
                <span className="opacity-60">, </span>
              )}
            </span>
          ))}
        </>
      ),
      opacity: false,
    },
    {
      title: t("classification"),
      value: classification,
      opacity: true,
    },
    {
      title: t("developer"),
      value: developer,
      opacity: true,
    },
    {
      title: t("editor"),
      value: editor,
      opacity: true,
    },
    {
      title: t("release"),
      value: releaseDate,
      opacity: true,
    },
  ];

  return (
    <div className="w-[97%] overflow-x-auto">
      <table className="min-w-full border-b text-white bg-transparent">
        <tbody className="divide-y">
          {tableItems.map((item) => (
            <tr className="divide-x" key={item.title}>
              <td className={tdMainClass}>{item.title}</td>
              <td
                className={cn(tdSecondaryClass, item.opacity && "opacity-60")}
              >
                {item.value}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
