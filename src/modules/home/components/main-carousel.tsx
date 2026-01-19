/** biome-ignore-all lint/complexity/useOptionalChain: Explicit null checks for carousel API */
/** biome-ignore-all lint/suspicious/noArrayIndexKey: Carousel items are static and order does not change */

"use client";

import Autoplay from "embla-carousel-autoplay";
import useEmblaCarousel from "embla-carousel-react";
import { type FC, useCallback, useEffect, useState } from "react";
import { Button } from "@/modules/shared/components/ui/button";
import type { FeaturedProduct } from "@/modules/shared/types/product-types";
import { MainCarouselSlide } from "./main-carousel-slide";

interface MainCarouselProps {
  products: FeaturedProduct[];
  watchButtonLabel: string;
}

export const MainCarousel: FC<MainCarouselProps> = ({
  products,
  watchButtonLabel,
}) => {
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true }, [Autoplay()]);
  const [selectedIndex, setSelectedIndex] = useState<number>(0);

  const scrollTo = useCallback(
    (index: number) => emblaApi && emblaApi.scrollTo(index),
    [emblaApi],
  );

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setSelectedIndex(emblaApi.selectedScrollSnap());
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    onSelect();
    emblaApi.on("select", onSelect);
  }, [emblaApi, onSelect]);

  return (
    <div className="relative h-full">
      <div className="embla overflow-hidden h-full" ref={emblaRef}>
        <div className="embla__container h-full flex">
          {products.map((product) => (
            <MainCarouselSlide
              product={product}
              key={product.id}
              watchButtonLabel={watchButtonLabel}
            />
          ))}
        </div>
      </div>
      <div className="absolute bottom-4 sm:bottom-8 md:bottom-16 left-1/2 transform -translate-x-1/2 md:flex space-x-3 sm:space-x-5 md:space-x-8 z-10 hidden">
        {products.map((_, index) => (
          <Button
            key={index}
            className={`cursor-pointer w-2 h-2 sm:w-3 sm:h-3 rounded-full ${
              index === selectedIndex ? "bg-blue-500" : "bg-gray-300"
            }`}
            onClick={() => scrollTo(index)}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
};
