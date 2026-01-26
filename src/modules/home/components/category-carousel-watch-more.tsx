import { ArrowRight } from "lucide-react";
import { getTranslations } from "next-intl/server";
import type { FC } from "react";
import { Link } from "@/i18n/navigation";

interface CategoryCarouselWatchMoreProps {
  categoryId: number;
}

export const CategoryCarouselWatchMore: FC<
  CategoryCarouselWatchMoreProps
> = async ({ categoryId }) => {
  const t = await getTranslations("WatchMoreButton");

  return (
    <Link
      href={`categories/${categoryId}`}
      className="inline-flex items-center gap-1 text-sm text-muted-foreground pointer-events-none group-hover:pointer-events-auto cursor-pointer opacity-0 group-hover:opacity-70 hover:!opacity-100 hover:text-foreground transition-all ease-in-out duration-150"
    >
      <span className="hover:underline">{t("watch")}</span>
      <ArrowRight className="size-4" />
    </Link>
  );
};
