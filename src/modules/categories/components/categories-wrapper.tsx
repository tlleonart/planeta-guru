import { getTranslations } from "next-intl/server";
import { type FC, Suspense } from "react";
import { api } from "@/app/server/server";
import { CategoriesContainer } from "./categories-container";
import { CategoriesGrid } from "./categories-grid";

export const CategoriesWrapper: FC = async () => {
  const categories = await api.product.getCategories();
  const t = await getTranslations("CategoryWrapper");

  return (
    <Suspense fallback={<div />}>
      <CategoriesContainer>
        <div className="flex flex-col px-4 md:px-10 md:block">
          <div className="flex flex-col gap-8">
            <h1 className="text-lg sm:text-xl md:text-3xl font-semibold mb-0 md:mb-0 px-4 md:px-0">
              {t("title")}
            </h1>
            <CategoriesGrid categories={categories.items} />
          </div>
        </div>
      </CategoriesContainer>
    </Suspense>
  );
};
