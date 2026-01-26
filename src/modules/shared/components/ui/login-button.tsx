"use client";

import { useTranslations } from "next-intl";
import type { FC } from "react";
import { Link } from "@/i18n/navigation";
import { cn } from "@/modules/shared/lib/utils";
import { Button } from "./button";

interface LoginButtonProps {
  redirectUrl?: string;
  variant?: "default" | "header";
}

export const LoginButton: FC<LoginButtonProps> = ({
  redirectUrl = "/",
  variant = "default",
}) => {
  const t = useTranslations("LoginButton");

  return (
    <Button
      asChild
      size="sm"
      className={cn(
        "cursor-pointer",
        variant === "default" &&
          "text-base sm:text-sm md:text-base px-2 sm:px-3 md:px-4 h-8 sm:h-9 md:h-10 rounded-none",
        variant === "header" &&
          "bg-white text-[#0a0a1f] hover:bg-gray-100 px-4 h-8 rounded-md font-medium text-sm",
      )}
    >
      <Link href={`/auth/sign-up?redirect_url=${redirectUrl}`}>
        {t("text")}
      </Link>
    </Button>
  );
};
