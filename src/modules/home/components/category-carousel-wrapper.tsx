import { api } from "@/app/server/server"
import { FC, Suspense } from "react"
import { CategoryCarousel } from "./category-carousel"

interface CategoryCarouselWrapperProps {
    label?: string
    categoryId: number
}

const CategoryCarouselSkeleton: FC = () => {
    return (
        <div className="py-4 px-4 animate-pulse">
        <div className="h-8 w-48 bg-gray-200 rounded mb-4"></div>
        <div className="flex gap-4 overflow-hidden">
            {[1, 2, 3, 4, 5].map((i) => (
            <div
                key={i}
                className="flex-none w-[250px] aspect-video bg-gray-200 rounded-lg"
            ></div>
            ))}
        </div>
        </div>
    );
}

export const CategoryCarouselWrapper: FC<CategoryCarouselWrapperProps> = async ({ label, categoryId }) => {
    const products = await api.product.getByCategory({categoryId})

    return (
        <Suspense fallback={<CategoryCarouselSkeleton/>}>
            <CategoryCarousel products={products.items} label={label} categoryId={categoryId}/>
        </Suspense>
    )
}