import { Category } from "@/modules/shared/types/product-types";
import Link from "next/link";
import { FC } from "react";

interface CategoriesMainCategoryCardProps {
    category: Category;
}

export const CategoriesMainCategoryCard: FC<CategoriesMainCategoryCardProps> = ({ category }) => {
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
                    {category.categoryLanguages[0]?.name.split(" ").map((word, index) => (
                        <h1
                            key={index}
                            className="basis-full font-medium text-white self-end"
                        >
                            {word}
                        </h1>
                    ))}
                </div>
                <div className="relative w-3/4 p-0 flex flex-row justify-end items-end">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                        src={category.categoryMedia[0]?.url}
                        alt={category.categoryMedia[0]?.description}
                        className="absolute w-24 lg:w-40  overflow-visible rounded-3xl z-10 transition-transform duration-300 transform translate-x-1 md:translate-x-3 group-hover:scale-105 origin-bottom"
                    />
                </div>
            </div>
        </Link>
    );
};
