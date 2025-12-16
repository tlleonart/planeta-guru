import { FC } from "react";
import { LanguagesIcon } from "lucide-react";
import { getLocale } from "next-intl/server";
import { Button } from "@/modules/shared/components/ui/button";

export const HeaderLanguageButton: FC = async () => {
  const locale = await getLocale();

  const country = locale.split("-")[1].toUpperCase() ?? "MX";
  const language = locale.split("-")[0].toUpperCase() ?? "ES";

  return (
    <Button
      variant="outline"
      size="sm"
      className="text-xs sm:text-sm md:text-base px-2 sm:px-3 md:px-4 h-8 sm:h-9 md:h-10 rounded-none cursor-pointer"
    >
      <span className="flex items-center gap-1 sm:gap-2">
        <LanguagesIcon className="text-sm sm:text-base md:text-lg" />
        <span className="inline">
          {country} | {language}
        </span>
      </span>
    </Button>
  );
};
