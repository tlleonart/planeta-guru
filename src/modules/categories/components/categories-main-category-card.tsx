import Image from "next/image";
import type { FC } from "react";
import { Link } from "@/i18n/navigation";
import type { Category } from "@/modules/shared/types/product-types";

interface CategoriesMainCategoryCardProps {
  category: Category;
}

export const CategoriesMainCategoryCard: FC<
  CategoriesMainCategoryCardProps
> = ({ category }) => {
  return (
    <Link href={`/categories/${category.id}`}>
      <div
        key={category.id}
        className="
                group
                relative
                border
                border-slate-400
                z-10
                flex
                flex-row
                flex-nowrap
                align-items-end
                cursor-pointer
                aspect-[21/9]
                pb-0
                w-40
                h-14
                mx-1
                lg:mx-0
                min-w-36
                md:h-24
                md:min-w-64
                bg-cover
                bg-top
                shadow-lg
                hover:bg-white/20
            "
      >
        <div className="relative h-full w-1/4 pl-2 pb-2 lg:p-2 lg:pl-4 flex flex-row flex-wrap items-stretch content-center text-[10px]/[12px] lg:text-lg z-20">
          {category.categoryLanguages[0]?.name.split(" ").map((word) => (
            <h1
              key={word}
              className="basis-full font-medium text-white self-end"
            >
              {word}
            </h1>
          ))}
        </div>
        <div className="relative w-3/4 p-0 flex flex-row justify-end items-end">
          <div className="absolute w-24 lg:w-40 h-full overflow-visible z-10 transition-transform duration-300 transform translate-x-1 md:translate-x-3 group-hover:scale-105 origin-bottom">
            {category.categoryMedia?.[0]?.url && (
              <Image
                src={category.categoryMedia[0].url}
                alt={
                  category.categoryMedia?.[0]?.description ??
                  category.categoryLanguages[0]?.name ??
                  "Category"
                }
                fill
                className="object-contain object-bottom rounded-3xl"
                sizes="(max-width: 768px) 96px, 160px"
              />
            )}
          </div>
        </div>
      </div>
    </Link>
  );
};
