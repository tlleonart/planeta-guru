import { getTranslations } from "next-intl/server";
import type { FC } from "react";
import { LinkButton } from "@/modules/shared/components/ui/link-button";
import { cn } from "@/modules/shared/lib/utils";

interface SignUpButtonProps {
  dark?: boolean;
  redirectUrl?: string;
}

export const SignUpButton: FC<SignUpButtonProps> = async ({
  dark = true,
  redirectUrl,
}) => {
  const t = await getTranslations("SignUpButton");

  return (
    <LinkButton
      size="sm"
      className={cn(
        "text-base sm:text-sm md:text-base px-2 sm:px-3 md:px-4 h-8 sm:h-9 md:h-10 cursor-pointer rounded-none",
        !dark && "bg-white text-main hover:bg-gray-200 hover:text-main",
      )}
      href={`/auth/sign-up?redirect_url=${redirectUrl}`}
    >
      {t("text")}
    </LinkButton>
  );
};
