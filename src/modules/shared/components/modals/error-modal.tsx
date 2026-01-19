"use client";

import { useTranslations } from "next-intl";
import type { FC } from "react";
import { Button } from "@/modules/shared/components/ui/button";
import { BaseModal } from "./base-modal";

interface ErrorModalProps {
  message?: string;
  onClose: () => void;
}

/**
 * Client Component: Modal de error genérico
 * - Muestra mensaje de error
 * - Botón para cerrar
 */
const ErrorModal: FC<ErrorModalProps> = ({ message, onClose }) => {
  const t = useTranslations("ErrorModal");

  return (
    <BaseModal onClose={onClose} title={t("title")}>
      <div className="flex flex-col gap-6">
        <div className="flex flex-col gap-4 text-center">
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

export default ErrorModal;
