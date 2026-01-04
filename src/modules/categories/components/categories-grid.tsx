import { Category } from "@/modules/shared/types/product-types";
import { FC } from "react";
import { CategoriesMainCategoryCard } from "./categories-main-category-card";
import { CategoriesSecCategoryCard } from "./categories-sec-category-card";

interface CategoriesGridProps {
    categories: Category[]
}

export const CategoriesGrid: FC<CategoriesGridProps> = ({ categories }) => {
    const mainCategories = categories.filter(
        (category) => category.categoryMedia.length > 0
    );
    const secondaryCategories = categories.filter(
        (category) =>
            category.categoryMedia.length === 0 && category.id !== 20
    );

    return (
        <div className="flex flex-col justify-start w-full gap-6">
            <div className="grid grid-cols-2 lg:grid lg:grid-cols-4 gap-x-1 md:gap-x-2 gap-y-6 md:gap-y-16   mb-6">
                {mainCategories &&
                    mainCategories.map((category, index) => (
                        <CategoriesMainCategoryCard key={index} category={category} />
                    ))}
            </div>
            <div className="flex flex-wrap  gap-x-3  md:gap-x-4 gap-y-3 md:gap-y-6   mb-6">
                {secondaryCategories &&
                    secondaryCategories.map((category, index) => (
                        <CategoriesSecCategoryCard key={index} category={category} />
                    ))}
            </div>
        </div>
    );
}   