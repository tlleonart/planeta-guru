"use client";

import { ChevronDownIcon } from "lucide-react";
import { useTranslations } from "next-intl";
import type { FC } from "react";
import { Link } from "@/i18n/navigation";
import { Button } from "@/modules/shared/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/modules/shared/components/ui/dropdown-menu";
import { trpc } from "@/modules/shared/lib/trpc/client";

export const HeaderCategoriesDropdown: FC = () => {
  const t = useTranslations("Header");
  const { data: categories, isLoading } = trpc.product.getCategories.useQuery();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          className="h-9 px-3 text-white hover:bg-[#2a2a5e] hover:text-white gap-1"
        >
          {t("categories")}
          <ChevronDownIcon className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="start"
        className="bg-[#1a1a3e] border-[#2a2a5e] min-w-[200px]"
      >
        {isLoading ? (
          <DropdownMenuItem disabled className="text-gray-400">
            {t("loadingCategories")}
          </DropdownMenuItem>
        ) : (
          categories?.items
            .filter((category) => !category.parentId)
            .map((category) => (
              <DropdownMenuItem key={category.id} asChild>
                <Link
                  href={`/categories/${category.id}`}
                  className="text-white hover:bg-[#2a2a5e] cursor-pointer"
                >
                  {category.categoryLanguages[0]?.name}
                </Link>
              </DropdownMenuItem>
            ))
        )}
        <DropdownMenuItem asChild>
          <Link
            href="/categories"
            className="text-primary hover:bg-[#2a2a5e] cursor-pointer font-medium"
          >
            {t("viewAllCategories")}
          </Link>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
