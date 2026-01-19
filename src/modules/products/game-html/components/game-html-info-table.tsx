"use client";

import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import type { FC } from "react";
import {
  getDeveloper,
  getLanguages,
} from "@/modules/products/shared/lib/get-specs";
import { cn } from "@/modules/shared/lib/utils";
import type { Category, Spec } from "@/modules/shared/types/product-types";

export interface GameHTMLInfoTableProps {
  name: string;
  categories: Category[];
  specs: Spec[];
}

/**
 * Client Component: Tabla de información del juego HTML
 * - Muestra título, categorías, idiomas y desarrollador
 * - Client porque usa router para navegación
 * - Podría optimizarse separando la navegación en un componente más pequeño
 */
export const GameHTMLInfoTable: FC<GameHTMLInfoTableProps> = ({
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
  const languages = getLanguages(specs);

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
      title: t("language"),
      value:
        languages.length > 0
          ? languages
              .map((lang) => lang.charAt(0).toUpperCase() + lang.slice(1))
              .join(", ")
          : "-",
      opacity: true,
    },
    {
      title: t("developer"),
      value: developer,
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
