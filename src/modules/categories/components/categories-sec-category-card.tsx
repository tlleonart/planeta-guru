import type { FC } from "react";
import { Link } from "@/i18n/navigation";
import type { Category } from "@/modules/shared/types/product-types";

interface CategoriesSecCategoryCardProps {
  category: Category;
}

export const CategoriesSecCategoryCard: FC<CategoriesSecCategoryCardProps> = ({
  category,
}) => {
  return (
    <Link href={`/categories/${category.id}`}>
      <div
        key={category.id}
        className="
                border
                border-slate-400
                z-10
                flex
                cursor-pointer
                px-2
                md:px-3
                py-1
                md:py-2
                shadow-lg
                group
                relative
                hover:bg-white/20
                hover:scale-105
                transition-all
                duration-150
                ease-in-out
            "
      >
        <h1 className="relative z-20 text-center text-xs md:text-base font-medium text-white ">
          {category.categoryLanguages[0]?.name}
        </h1>
      </div>
    </Link>
  );
};
