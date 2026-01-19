"use client";

import { useTranslations } from "next-intl";
import type { FC } from "react";
import { LoginButton } from "../ui/login-button";
import { BaseModal } from "./base-modal";

interface AuthenticateModalProps {
  onClose: () => void;
}

const AuthenticateModal: FC<AuthenticateModalProps> = ({ onClose }) => {
  const t = useTranslations("NotLoggedInModal");

  return (
    <BaseModal onClose={onClose} title={t("title")}>
      <div className="flex flex-row w-full gap-4 justify-center">
        <LoginButton />
      </div>
    </BaseModal>
  );
};

export default AuthenticateModal;
