import { getTranslations } from "next-intl/server";
import { type FC, Suspense } from "react";
import { DownloadsGrid } from "@/modules/profile/downloads/components/downloads-grid";
import { Heading } from "@/modules/shared/components/ui/heading";
import type { Product } from "@/modules/shared/types/product-types";

interface SearchWrapperProps {
  products: Product[];
}

export const SearchWrapper: FC<SearchWrapperProps> = async ({ products }) => {
  const t = await getTranslations("SearchWrapper");

  if (!products) return null;

  // TODO: CAMBIAR THUMBNAIL Y GRID POR LO QUE CORRESPONDE (COMPONENTE COMPARTIDO)

  return (
    <Suspense fallback={<div />}>
      <div className="relative h-full md:pt-16">
        <div className="overflow-hidden h-full">
          <div className="h-full flex">
            <div className="flex-[0_0_100%] h-full relative">
              <div className="flex flex-col md:block">
                <Heading className="text-3xl font-bold px-10">
                  {t("title")}
                </Heading>
                <DownloadsGrid products={products} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </Suspense>
  );
};
