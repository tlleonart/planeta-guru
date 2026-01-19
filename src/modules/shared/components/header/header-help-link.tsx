import { HelpCircleIcon } from "lucide-react";
import { useTranslations } from "next-intl";
import type { FC } from "react";
import { Link } from "@/i18n/navigation";

export const HeaderHelpLink: FC = () => {
  const t = useTranslations("Header");

  return (
    <Link
      href="/help"
      className="flex items-center gap-1 text-white hover:text-gray-300 transition-colors text-sm"
    >
      <HelpCircleIcon className="h-4 w-4" />
      {t("help")}
    </Link>
  );
};
