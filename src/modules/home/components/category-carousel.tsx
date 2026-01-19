import { getTranslations } from "next-intl/server";
import type { FC } from "react";
import { ThumbnailCarousel } from "@/modules/shared/components/thumbnail-carousel";
import { Section } from "@/modules/shared/components/ui/section";
import type { Product } from "@/modules/shared/types/product-types";
import { CategoryCarouselWatchMore } from "./category-carousel-watch-more";

interface CategoryCarouselProps {
  products: Product[];
  label?: string;
  categoryId: number;
}

export const CategoryCarousel: FC<CategoryCarouselProps> = async ({
  products,
  label,
  categoryId,
}) => {
  const categoryName =
    products[0]?.categories?.find((category) => category.id === categoryId)
      ?.categoryLanguages[0].name ?? "";
  const t = await getTranslations(label ?? "");

  if (!products || products.length === 0) return null;

  return (
    <Section className="group py-4">
      <div className="flex flex-row items-center gap-5">
        <h2 className="text-lg sm:text-xl md:text-2xl font-semibold mb-0 md:mb-4 pl-4 md:pl-10">
          {label ? t("title") : categoryName}
        </h2>
        <CategoryCarouselWatchMore categoryId={categoryId} />
      </div>
      <ThumbnailCarousel
        products={products}
        watchMoreHref={`/categories/${categoryId}`}
      />
    </Section>
  );
};
