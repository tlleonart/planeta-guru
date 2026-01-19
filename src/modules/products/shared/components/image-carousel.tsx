/** biome-ignore-all lint/complexity/useOptionalChain: Explicit null checks for Embla carousel API */

"use client";

import useEmblaCarousel from "embla-carousel-react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import Image from "next/image";
import { type FC, useCallback, useEffect, useState } from "react";
import { cn } from "@/modules/shared/lib/utils";
import type { Media } from "@/modules/shared/types/product-types";

interface ImageCarouselProps {
  images: Media[];
  productName: string;
}

/**
 * Client Component: Carrusel de imágenes del producto
 * - Usa Embla Carousel
 * - Muestra imágenes con mediaTypeId === 1
 * - Incluye navegación con botones y dots
 * - Responsive: se adapta a diferentes tamaños
 */
export const ImageCarousel: FC<ImageCarouselProps> = ({
  images,
  productName,
}) => {
  const [emblaRef, emblaApi] = useEmblaCarousel({
    loop: true,
    align: "center",
  });

  const [selectedIndex, setSelectedIndex] = useState(0);
  const [scrollSnaps, setScrollSnaps] = useState<number[]>([]);
  const [prevBtnEnabled, setPrevBtnEnabled] = useState(false);
  const [nextBtnEnabled, setNextBtnEnabled] = useState(false);

  const scrollPrev = useCallback(
    () => emblaApi && emblaApi.scrollPrev(),
    [emblaApi],
  );
  const scrollNext = useCallback(
    () => emblaApi && emblaApi.scrollNext(),
    [emblaApi],
  );
  const scrollTo = useCallback(
    (index: number) => emblaApi && emblaApi.scrollTo(index),
    [emblaApi],
  );

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setSelectedIndex(emblaApi.selectedScrollSnap());
    setPrevBtnEnabled(emblaApi.canScrollPrev());
    setNextBtnEnabled(emblaApi.canScrollNext());
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    onSelect();
    setScrollSnaps(emblaApi.scrollSnapList());
    emblaApi.on("select", onSelect);
    emblaApi.on("reInit", onSelect);
  }, [emblaApi, onSelect]);

  // Filtrar solo imágenes (mediaTypeId === 1)
  const filteredImages = images.filter((img) => img.mediaTypeId === 1);

  if (filteredImages.length === 0) {
    return null;
  }

  if (filteredImages.length === 1) {
    // Si solo hay una imagen, mostrar sin carrusel
    return (
      <div className="relative w-full aspect-video">
        <Image
          src={filteredImages[0].url}
          alt={filteredImages[0].description || productName}
          fill
          className="object-cover"
        />
      </div>
    );
  }

  return (
    <div className="relative">
      {/* Carrusel principal */}
      <div className="overflow-hidden" ref={emblaRef}>
        <div className="flex">
          {filteredImages.map((image, index) => (
            <div
              key={image.id}
              className="flex-[0_0_100%] min-w-0 relative aspect-video"
            >
              <Image
                src={image.url}
                alt={image.description || `${productName} - Image ${index + 1}`}
                fill
                className="object-cover"
              />
            </div>
          ))}
        </div>
      </div>

      {/* Botones de navegación */}
      <button
        type="button"
        onClick={scrollPrev}
        disabled={!prevBtnEnabled}
        className={cn(
          "absolute left-2 top-1/2 -translate-y-1/2 z-10",
          "bg-black/50 hover:bg-black/70 text-white p-2 rounded-full",
          "disabled:opacity-30 disabled:cursor-not-allowed",
          "transition-all duration-200",
        )}
        aria-label="Previous image"
      >
        <ChevronLeft className="w-6 h-6" />
      </button>
      <button
        type="button"
        onClick={scrollNext}
        disabled={!nextBtnEnabled}
        className={cn(
          "absolute right-2 top-1/2 -translate-y-1/2 z-10",
          "bg-black/50 hover:bg-black/70 text-white p-2 rounded-full",
          "disabled:opacity-30 disabled:cursor-not-allowed",
          "transition-all duration-200",
        )}
        aria-label="Next image"
      >
        <ChevronRight className="w-6 h-6" />
      </button>

      {/* Dots de navegación */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-10">
        {scrollSnaps.map((_, index) => (
          <button
            key={`dot-${filteredImages[index]?.id || index}`}
            type="button"
            onClick={() => scrollTo(index)}
            className={cn(
              "w-2 h-2 rounded-full transition-all duration-200",
              index === selectedIndex
                ? "bg-white w-4"
                : "bg-white/50 hover:bg-white/70",
            )}
            aria-label={`Go to image ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
};
