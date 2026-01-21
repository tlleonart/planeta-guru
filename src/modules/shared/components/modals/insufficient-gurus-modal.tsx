"use client";

import { useTranslations } from "next-intl";
import type { FC } from "react";
import { Link } from "@/i18n/navigation";
import { Button } from "@/modules/shared/components/ui/button";
import { BaseModal } from "./base-modal";

interface InsufficientGurusModalProps {
  required: number;
  current: number;
  onClose: () => void;
}

/**
 * Client Component: Modal de gurus insuficientes
 * - Muestra cantidad requerida vs actual
 * - Botón para ir a recargar gurus
 */
const InsufficientGurusModal: FC<InsufficientGurusModalProps> = ({
  required,
  current,
  onClose,
}) => {
  const t = useTranslations("InsufficientGurusModal");

  const missing = required - current;

  return (
    <BaseModal onClose={onClose} title={t("title")}>
      <div className="flex flex-col gap-6">
        <div className="flex flex-col gap-4 text-center">
          <p className="text-lg text-gray-800">{t("description")}</p>
          <div className="bg-white p-4 rounded border border-gray-200">
            <div className="flex justify-between mb-2">
              <span className="text-gray-700">{t("required")}:</span>
              <span className="font-bold text-gray-900">{required} GURUs</span>
            </div>
            <div className="flex justify-between mb-2">
              <span className="text-gray-700">{t("current")}:</span>
              <span className="font-bold text-gray-900">{current} GURUs</span>
            </div>
            <div className="flex justify-between border-t border-gray-200 pt-2">
              <span className="text-gray-700">{t("missing")}:</span>
              <span className="font-bold text-red-600">{missing} GURUs</span>
            </div>
          </div>
        </div>

        <div className="flex flex-row gap-4 justify-center">
          <Button
            size="sm"
            variant="ghost"
            className="text-xs sm:text-sm md:text-base no-underline hover:underline rounded-none cursor-pointer"
            onClick={onClose}
          >
            {t("cancel")}
          </Button>
          <Button
            asChild
            size="sm"
            className="text-xs sm:text-sm md:text-base bg-main rounded-none cursor-pointer"
          >
            <Link href="/charge-gurus" onClick={onClose}>
              {t("recharge")}
            </Link>
          </Button>
        </div>
      </div>
    </BaseModal>
  );
};

export default InsufficientGurusModal;
