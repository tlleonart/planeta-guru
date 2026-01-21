"use client";

import { useTranslations } from "next-intl";
import type { FC } from "react";
import { Button } from "@/modules/shared/components/ui/button";
import { BaseModal } from "./base-modal";

interface ErrorModalProps {
  message?: string;
  onRetry?: () => void;
  onClose: () => void;
}

/**
 * Client Component: Modal de error genérico
 * - Muestra mensaje de error
 * - Botón para cerrar
 * - Botón opcional para reintentar si se proporciona onRetry
 */
const ErrorModal: FC<ErrorModalProps> = ({ message, onRetry, onClose }) => {
  const t = useTranslations("ErrorModal");

  const handleRetry = () => {
    onClose();
    onRetry?.();
  };

  return (
    <BaseModal onClose={onClose} title={t("title")}>
      <div className="flex flex-col gap-6">
        <div className="flex flex-col gap-4 text-center">
          <p className="text-lg text-gray-700">
            {message || t("defaultMessage")}
          </p>
        </div>

        <div className="flex flex-row gap-4 justify-center">
          <Button
            size="sm"
            variant="ghost"
            className="text-xs sm:text-sm md:text-base no-underline hover:underline rounded-none cursor-pointer"
            onClick={onClose}
          >
            {t("close")}
          </Button>
          {onRetry && (
            <Button
              size="sm"
              className="text-xs sm:text-sm md:text-base bg-main rounded-none cursor-pointer"
              onClick={handleRetry}
            >
              {t("button")}
            </Button>
          )}
        </div>
      </div>
    </BaseModal>
  );
};

export default ErrorModal;
