import { getTranslations } from "next-intl/server";
import { type FC, Suspense } from "react";
import { api } from "@/app/server/server";
import { Heading } from "@/modules/shared/components/ui/heading";
import { DownloadsGrid } from "./downloads-grid";

export const DownloadsWrapper: FC = async () => {
  const downloads = await api.product.getDownloads({
    perPage: 100,
    orderBy: "created_at",
    order: "desc",
  });
  const t = await getTranslations("DownloadsWrapper");

  const products = downloads.items.map((download) => download.bundle.product);

  return (
    <Suspense fallback={<div />}>
      <div className="relative h-full md:pt-16">
        <div className="overflow-hidden h-full">
          <div className="h-full flex">
            <div className="flex-[0_0_100%] h-full relative">
              <div className="flex flex-col md:block">
                <Heading className="text-lg sm:text-xl md:text-3xl font-semibold mb-0 md:mb-4 px-4 md:px-10">
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
