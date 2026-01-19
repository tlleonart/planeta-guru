/** biome-ignore-all lint/complexity/useOptionalChain: Explicit null checks for Embla carousel API */

"use client";

import useEmblaCarousel from "embla-carousel-react";
import { type FC, useCallback, useEffect, useState } from "react";
import type { Product } from "../types/product-types";
import { ThumbnailCarouselCard } from "./thumbnail-carousel-card";
import { ThumbnailCarouselNavigationButtons } from "./thumbnail-carousel-navigation-buttons";
import { ThumbnailCarouselWatchMore } from "./thumbnail-carousel-watch-more";
import { Heading } from "./ui/heading";

interface ThumbnailCarouselProps {
  products: Product[];
  watchMoreHref?: string;
  title?: string;
}

export const ThumbnailCarousel: FC<ThumbnailCarouselProps> = ({
  products,
  watchMoreHref,
  title,
}) => {
  const [emblaRef, emblaApi] = useEmblaCarousel({
    loop: false,
    align: "start",
    containScroll: "trimSnaps",
    dragFree: true,
    slidesToScroll: 1,
  });

  const [prevBtnEnabled, setPrevBtnEnabled] = useState<boolean>(false);
  const [nextBtnEnabled, setNextBtnEnabled] = useState<boolean>(false);

  const scrollPrev = useCallback(
    () => emblaApi && emblaApi.scrollPrev(),
    [emblaApi],
  );
  const scrollNext = useCallback(
    () => emblaApi && emblaApi.scrollNext(),
    [emblaApi],
  );

  const onSelect = useCallback(() => {
    if (!emblaApi) return;

    setPrevBtnEnabled(emblaApi.canScrollPrev());
    setNextBtnEnabled(emblaApi.canScrollNext());
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    onSelect();
    emblaApi.on("select", onSelect);
    emblaApi.on("reInit", onSelect);
  }, [emblaApi, onSelect]);

  return (
    <div className="relative">
      <Heading className="text-2xl font-bold mb-2 md:mb-0">{title}</Heading>
      <div className="relative overflow-hidden touch-pan-y" ref={emblaRef}>
        <div className="flex space-x-4 lg:py-2 pl-2 lg:px-4">
          {products.map((product) => (
            <ThumbnailCarouselCard key={product.slug} product={product} />
          ))}
          {watchMoreHref && <ThumbnailCarouselWatchMore href={watchMoreHref} />}
        </div>
      </div>
      <ThumbnailCarouselNavigationButtons
        prevBtnEnabled={prevBtnEnabled}
        nextBtnEnabled={nextBtnEnabled}
        scrollPrev={scrollPrev}
        scrollNext={scrollNext}
        classRight="right-36"
      />
    </div>
  );
};
