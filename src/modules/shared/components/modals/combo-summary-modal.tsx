"use client";

import { usePathname } from "next/navigation";
import { useLocale, useTranslations } from "next-intl";
import { type FC, useState } from "react";
import { comboPaymentAction } from "@/app/actions";
import { Button } from "@/modules/shared/components/ui/button";
import { cn } from "@/modules/shared/lib/utils";
import { useModalStore } from "@/modules/shared/providers/modal-store-provider";
import { BaseModal } from "./base-modal";

interface ComboSummaryModalProps {
  productName: string;
  bundleId: number;
  bundleTitle: string;
  price: number;
  currency: string;
  onClose: () => void;
}

/**
 * Client Component: Modal de resumen de compra de combo
 * - Muestra nombre del producto, titulo del bundle y precio
 * - Boton de confirmar que llama a comboPaymentAction
 * - Redirige al link de pago de MercadoPago
 */
const ComboSummaryModal: FC<ComboSummaryModalProps> = ({
  productName,
  bundleId,
  bundleTitle,
  price,
  currency,
  onClose,
}) => {
  const t = useTranslations("ComboSummaryModal");
  const locale = useLocale();
  const pathname = usePathname();
  const [loading, setLoading] = useState(false);
  const openModal = useModalStore((state) => state.openModal);

  const localeString = locale.replace("-", "_");

  const handleConfirm = async () => {
    setLoading(true);
    try {
      const customSuccessUrl = `${window.location.origin}${pathname}`;

      const payload = {
        bundle_id: bundleId,
        payment_method: "CARD",
        custom_success_url: customSuccessUrl,
      };

      const response = await comboPaymentAction(payload);
      const link = response.id.purchase_link;
      window.location.href = link;
    } catch (error) {
      console.error("Combo payment error:", error);
      onClose();
      openModal("Error", { message: t("error") });
    } finally {
      setLoading(false);
    }
  };

  return (
    <BaseModal onClose={onClose} title={t("title")}>
      <div className="flex flex-col gap-6">
        <div className="flex flex-col gap-2 items-start justify-start">
          <h1 className="text-2xl font-bold">{productName}</h1>
        </div>

        <div className="flex flex-col gap-4">
          <div className="bg-main p-2">
            <h2 className="text-lg text-center font-semibold text-white">
              {bundleTitle}
            </h2>
          </div>
          <div className="p-4 bg-gray-600/20">
            <table className="w-full">
              <tbody>
                <tr className="flex justify-between">
                  <td className="text-sm sm:text-base md:text-lg font-medium text-gray-800">
                    {t("total")}:
                  </td>
                  <td className="text-sm sm:text-base md:text-lg font-semibold">
                    ${Number(price).toLocaleString(localeString)} {currency}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <div className="flex flex-col items-center text-center">
          <p className="text-xs md:text-sm">{t("tyc")}</p>
        </div>

        <div className="flex flex-row gap-4 justify-center">
          <Button
            disabled={loading}
            size="sm"
            variant="ghost"
            className="text-xs sm:text-sm md:text-base no-underline hover:underline rounded-none cursor-pointer"
            onClick={onClose}
          >
            {t("cancel")}
          </Button>
          <Button
            disabled={loading}
            size="sm"
            className={cn(
              "text-xs sm:text-sm md:text-base bg-main rounded-none cursor-pointer disabled:cursor-progress disabled:pointer-events-none",
            )}
            onClick={handleConfirm}
          >
            {loading ? t("processing") : t("confirm")}
          </Button>
        </div>
      </div>
    </BaseModal>
  );
};

export default ComboSummaryModal;
