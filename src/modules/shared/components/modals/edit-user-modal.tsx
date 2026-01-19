"use client";

import { UserProfile } from "@clerk/nextjs";
import { useTranslations } from "next-intl";
import type { FC } from "react";
import { BaseModal } from "./base-modal";

interface EditUserModalProps {
  onClose: () => void;
}

const EditUserModal: FC<EditUserModalProps> = ({ onClose }) => {
  const t = useTranslations("EditUser");

  return (
    <BaseModal onClose={onClose} title={t("title")}>
      <UserProfile
        routing="hash"
        appearance={{
          elements: {
            navbar: "!hidden",
            profileSection__emailAddresses: "!hidden",
            profileSection__phoneNumbers: "!hidden",
            profileSection__connectedAccounts: "!hidden",
            cardBox: "!h-fit !w-fit !shadow-none",
            header: "!hidden",
            actionCard: "!rounded-none",
            profileSectionTitleText: "!text-base",
            profileSectionPrimaryButton: "!text-base",
            userPreviewMainIdentifier: "!text-base",
            profileSectionItem: "!text-base",
            formFieldInput: "!rounded-none",
            avatarImageActionsUpload: "!rounded-none",
          },
        }}
      />
    </BaseModal>
  );
};

export default EditUserModal;
