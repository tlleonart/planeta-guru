import { type FC, Suspense } from "react";
import { api } from "@/app/server/server";
import { CategoryCarousel } from "./category-carousel";

interface CategoryCarouselWrapperProps {
  label?: string;
  categoryId: number;
}

const CategoryCarouselSkeleton: FC = () => {
  return (
    <div className="py-4 px-4 animate-pulse">
      <div className="h-8 w-48 bg-gray-200/20 rounded mb-4" />
      <div className="flex gap-4 overflow-hidden">
        {[1, 2, 3, 4, 5].map((i) => (
          <div
            key={i}
            className="flex-none w-[250px] aspect-video bg-gray-200/20 rounded-lg"
          />
        ))}
      </div>
    </div>
  );
};

/**
 * Async component that fetches data inside Suspense boundary
 * This allows the skeleton to show while data is loading
 */
const CategoryCarouselFetcher: FC<CategoryCarouselWrapperProps> = async ({
  label,
  categoryId,
}) => {
  const products = await api.product.getByCategory({ categoryId });

  return (
    <CategoryCarousel
      products={products.items}
      label={label}
      categoryId={categoryId}
    />
  );
};

export const CategoryCarouselWrapper: FC<CategoryCarouselWrapperProps> = ({
  label,
  categoryId,
}) => {
  return (
    <Suspense fallback={<CategoryCarouselSkeleton />}>
      <CategoryCarouselFetcher label={label} categoryId={categoryId} />
    </Suspense>
  );
};
