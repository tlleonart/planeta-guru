import { useTranslations } from "next-intl";
import type { FC } from "react";
import { Link } from "@/i18n/navigation";
import { cn } from "@/modules/shared/lib/utils";

export const HeaderRecargarButton: FC = () => {
  const t = useTranslations("Header");

  return (
    <Link
      href="/charge-gurus"
      className={cn(
        "flex items-center justify-center px-4 h-9 rounded-md",
        "bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600",
        "text-white font-semibold text-sm transition-all",
        "shadow-lg shadow-pink-500/25",
      )}
    >
      {t("recargarGurus")}
    </Link>
  );
};
