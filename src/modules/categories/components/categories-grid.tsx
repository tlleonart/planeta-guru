import type { FC } from "react";
import type { Category } from "@/modules/shared/types/product-types";
import { CategoriesMainCategoryCard } from "./categories-main-category-card";
import { CategoriesSecCategoryCard } from "./categories-sec-category-card";

interface CategoriesGridProps {
  categories: Category[];
}

export const CategoriesGrid: FC<CategoriesGridProps> = ({ categories }) => {
  const mainCategories = categories.filter(
    (category) => (category.categoryMedia?.length ?? 0) > 0,
  );
  const secondaryCategories = categories.filter(
    (category) =>
      (category.categoryMedia?.length ?? 0) === 0 && category.id !== 20,
  );

  return (
    <div className="flex flex-col justify-start w-full gap-6">
      <div className="grid grid-cols-1 xs:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6 lg:gap-8 mb-6">
        {mainCategories?.map((category) => (
          <CategoriesMainCategoryCard key={category.id} category={category} />
        ))}
      </div>
      <div className="flex flex-wrap justify-start gap-3 md:gap-4 mb-6">
        {secondaryCategories?.map((category) => (
          <CategoriesSecCategoryCard key={category.id} category={category} />
        ))}
      </div>
    </div>
  );
};
