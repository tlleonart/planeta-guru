import type { FC } from "react";
import { Link } from "@/i18n/navigation";
import { Button } from "@/modules/shared/components/ui/button";

interface MainCarouselSlideCardProps {
  name: string;
  description?: string;
  slug: string;
  type: string;
  watchButtonLabel: string;
}

/**
 * Server Component: Card del main carousel
 * - Recibe el label del boton desde el servidor (evita "use client" innecesario)
 * - Reduce bundle size del cliente
 */
export const MainCarouselSlideCard: FC<MainCarouselSlideCardProps> = ({
  name,
  description,
  slug,
  type,
  watchButtonLabel,
}) => {
  return (
    <div
      className="absolute top-32 left-8 md:top-50 md:left-44 md:right-auto md:w-1/3 lg:w-1/3 xl:w-1/4 
                        w-5/6 mt-4 md:mt-0  bg-main/20 p-4 sm:p-6 md:p-3 lg:p-6 backdrop-blur-lg md:h-60 "
    >
      <div className="flex flex-col md:h-full md:justify-between ">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold mb-1 md:mb-2">{name}</h2>
          <p className="text-sm sm:text-base mb-3 md:mb-4 line-clamp-3 md:line-clamp-none">
            {description}
          </p>
        </div>
        <div className="flex justify-start">
          <Button
            size="sm"
            className="text-xs sm:text-sm md:text-base rounded-none"
          >
            <Link href={`/products/${type}/${slug}`}>{watchButtonLabel}</Link>
          </Button>
        </div>
      </div>
    </div>
  );
};
