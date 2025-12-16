import { Suspense, type FC } from "react";
import { MainCarousel } from "./main-carousel";
import { api } from "@/app/server/server";

export const MainCarouselSkeleton: FC = () => {
  return (
    <div className="relative h-full px-3 md:px-6 md:pt-16 pb-4">
      <div className="w-full h-full bg-gray-200/20 rounded-lg"></div>
      <div className="absolute bottom-20 left-10 w-1/3 h-48 bg-gray-300/20 rounded-none m-20"></div>
    </div>
  );
};

export const MainCarouselWrapper: FC = async () => {
    const featuredProducts = await api.product.getFeatured()

    return (
        <Suspense fallback={<MainCarouselSkeleton/>}>
            <MainCarousel products={featuredProducts.items}/>
        </Suspense>

    )
}