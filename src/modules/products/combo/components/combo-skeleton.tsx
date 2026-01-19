import type { FC } from "react";

/**
 * Server Component: Skeleton de carga para Combo
 * - Muestra placeholder mientras carga el producto
 * - Estructura similar al layout final
 */
export const ComboSkeleton: FC = () => {
  return (
    <main>
      <section className="h-full md:h-screen pt-16 md:pt-6">
        <div className="relative h-full md:pt-16">
          <div className="overflow-hidden h-full">
            <div className="h-full flex">
              <div className="flex-[0_0_100%] h-full relative">
                <div className="flex flex-col md:block">
                  {/* Banner skeleton */}
                  <div className="relative aspect-square md:aspect-auto md:absolute md:inset-0 overflow-hidden rounded-none bg-gray-800 animate-pulse" />
                  {/* Card skeleton */}
                  <div className="absolute top-20 left-8 md:top-50 md:left-44 md:right-auto md:w-1/3 lg:w-1/3 xl:w-1/4 w-5/6">
                    <div className="flex flex-col gap-4 mt-4 md:mt-0 bg-main/20 p-4 sm:p-6 md:p-3 lg:p-6 backdrop-blur-lg">
                      <div className="h-6 bg-gray-700 rounded animate-pulse w-1/3" />
                      <div className="h-8 bg-gray-700 rounded animate-pulse w-2/3" />
                      <div className="h-20 bg-gray-700 rounded animate-pulse" />
                      <div className="h-10 bg-gray-700 rounded animate-pulse w-1/4" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
};
