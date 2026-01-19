"use client";

import { useTranslations } from "next-intl";
import type { FC } from "react";
import { Button } from "@/modules/shared/components/ui/button";
import { BaseModal } from "./base-modal";

interface ConfirmationModalProps {
  title?: string;
  message?: string;
  onClose: () => void;
}

/**
 * Client Component: Modal de confirmación/éxito
 * - Muestra mensaje de éxito
 * - Botón para cerrar
 */
const ConfirmationModal: FC<ConfirmationModalProps> = ({
  title,
  message,
  onClose,
}) => {
  const t = useTranslations("ConfirmationModal");

  return (
    <BaseModal onClose={onClose} title={title || t("title")}>
      <div className="flex flex-col gap-6">
        <div className="flex flex-col gap-4 text-center">
          <div className="text-4xl mb-2">✓</div>
          <p className="text-lg text-gray-700">
            {message || t("defaultMessage")}
          </p>
        </div>

        <div className="flex justify-center">
          <Button
            size="sm"
            className="text-xs sm:text-sm md:text-base bg-main rounded-none cursor-pointer"
            onClick={onClose}
          >
            {t("close")}
          </Button>
        </div>
      </div>
    </BaseModal>
  );
};

export default ConfirmationModal;
