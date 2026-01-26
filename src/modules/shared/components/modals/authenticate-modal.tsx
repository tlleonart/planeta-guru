"use client";

import { useTranslations } from "next-intl";
import type { FC } from "react";
import { Link } from "@/i18n/navigation";
import { Button } from "../ui/button";
import { BaseModal } from "./base-modal";

interface AuthenticateModalProps {
  returnUrl?: string;
  onClose: () => void;
}

const AuthenticateModal: FC<AuthenticateModalProps> = ({
  returnUrl,
  onClose,
}) => {
  const t = useTranslations("NotLoggedInModal");
  const redirectParam = returnUrl
    ? `?redirect_url=${encodeURIComponent(returnUrl)}`
    : "";

  return (
    <BaseModal onClose={onClose} title={t("title")}>
      <div className="flex flex-row w-full gap-4 justify-center">
        <Button asChild size="sm" variant="outline" onClick={onClose}>
          <Link href={`/auth/sign-in${redirectParam}`}>{t("signIn")}</Link>
        </Button>
        <Button asChild size="sm" onClick={onClose}>
          <Link href={`/auth/sign-up${redirectParam}`}>{t("signUp")}</Link>
        </Button>
      </div>
    </BaseModal>
  );
};

export default AuthenticateModal;
