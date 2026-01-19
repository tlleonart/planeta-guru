import { getTranslations } from "next-intl/server";
import { type FC, Suspense } from "react";
import { api } from "@/app/server/server";
import { MainCarousel } from "./main-carousel";

export const MainCarouselSkeleton: FC = () => {
  return (
    <div className="relative h-full px-3 md:px-6 pb-4">
      <div className="w-full h-full bg-gray-200/20 rounded-lg" />
      <div className="absolute bottom-20 left-10 w-1/3 h-48 bg-gray-300/20 rounded-none m-20" />
    </div>
  );
};

/**
 * Async component that fetches data and translations inside Suspense boundary
 */
const MainCarouselFetcher: FC = async () => {
  const [featuredProducts, t] = await Promise.all([
    api.product.getFeatured(),
    getTranslations("MainCarouselCard"),
  ]);
  return (
    <MainCarousel
      products={featuredProducts.items}
      watchButtonLabel={t("watch")}
    />
  );
};

export const MainCarouselWrapper: FC = () => {
  return (
    <Suspense fallback={<MainCarouselSkeleton />}>
      <MainCarouselFetcher />
    </Suspense>
  );
};
