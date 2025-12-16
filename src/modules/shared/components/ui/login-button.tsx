import { Link } from "@/i18n/navigation";
import { getTranslations } from "next-intl/server";
import { FC } from "react";

interface LoginButtonProps {
  redirectUrl?: string;
}

export const LoginButton: FC<LoginButtonProps> = async ({
  redirectUrl = "/",
}) => {
  const t = await getTranslations("LoginButton");

  return (
    <Link href={`/auth/sign-in?redirect_url=${redirectUrl}`}>{t("text")}</Link>
  );
};
