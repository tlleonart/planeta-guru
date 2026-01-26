import { Skeleton } from "@/modules/shared/components/ui/skeleton";

/**
 * Loading skeleton for product pages.
 * Shows while the product data is being fetched.
 */
export default function ProductLoading() {
  return (
    <main>
      {/* Banner section skeleton */}
      <section className="h-full md:h-screen pt-16 md:pt-6">
        <div className="relative w-full h-[50vh] md:h-full">
          {/* Background skeleton */}
          <Skeleton className="absolute inset-0 w-full h-full" />

          {/* Card overlay skeleton */}
          <div className="absolute bottom-0 left-0 right-0 md:bottom-auto md:top-1/2 md:-translate-y-1/2 md:left-8 md:right-auto p-4 md:p-0">
            <div className="bg-background/80 backdrop-blur-sm p-6 md:p-8 rounded-lg w-full md:w-[400px]">
              {/* Category */}
              <Skeleton className="h-4 w-24 mb-2" />
              {/* Title */}
              <Skeleton className="h-8 w-3/4 mb-4" />
              {/* Description */}
              <Skeleton className="h-4 w-full mb-2" />
              <Skeleton className="h-4 w-5/6 mb-4" />
              {/* Price */}
              <Skeleton className="h-6 w-20 mb-4" />
              {/* Buttons */}
              <div className="flex gap-4">
                <Skeleton className="h-10 w-32" />
                <Skeleton className="h-10 w-10" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Info section skeleton */}
      <section className="h-full mb-2 md:mb-4">
        <div className="p-8 md:p-16">
          <Skeleton className="h-8 w-1/3 mb-6" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Skeleton className="h-32 w-full" />
            <Skeleton className="h-32 w-full" />
          </div>
        </div>
      </section>
    </main>
  );
}
