"use client";

import { useRouter } from "next/navigation";
import { useLocale, useTranslations } from "next-intl";
import { type FC, useState } from "react";
import {
  externalProviderPurchaseAction,
  storeOutcomeAction,
} from "@/app/actions";
import { Button } from "@/modules/shared/components/ui/button";
import { cn } from "@/modules/shared/lib/utils";
import { useModalStore } from "@/modules/shared/providers/modal-store-provider";
import { BaseModal } from "./base-modal";

interface BuyBundleModalProps {
  productName: string;
  bundleId: number;
  bundleTitle: string;
  price: number;
  walletAmount: number;
  walletId: number;
  supportsCodes?: boolean;
  onClose: () => void;
}

/**
 * Client Component: Modal de confirmación de compra con gurus
 * - Muestra resumen de compra
 * - Calcula balance restante
 * - Llama a storeOutcomeAction o externalProviderPurchaseAction
 */
const BuyBundleModal: FC<BuyBundleModalProps> = ({
  productName,
  bundleId,
  bundleTitle,
  price,
  walletAmount,
  walletId,
  supportsCodes = true,
  onClose,
}) => {
  const t = useTranslations("BuyBundleModal");
  const locale = useLocale();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const openModal = useModalStore((state) => state.openModal);

  // BCP 47 language tags use hyphens (ar-ES), not underscores
  const localeString = locale;
  const remaining = walletAmount - price;

  const tableItems = [
    { label: t("current"), value: walletAmount },
    { label: t("purchase"), value: -price },
    { label: t("remaining"), value: remaining },
  ];

  const handleConfirm = async () => {
    setLoading(true);
    try {
      if (supportsCodes) {
        await storeOutcomeAction(bundleId, walletId);
      } else {
        await externalProviderPurchaseAction(bundleId, null);
      }
      onClose();
      // Refresh page data to update isOwner status
      router.refresh();
      openModal("Confirmation", {
        title: t("successTitle"),
        message: t("successMessage"),
      });
    } catch (error) {
      console.error("Purchase error:", error);
      onClose();
      openModal("Error", {
        message: t("error"),
        onRetry: () => {
          openModal("BuyBundle", {
            productName,
            bundleId,
            bundleTitle,
            price,
            walletAmount,
            walletId,
            supportsCodes,
          });
        },
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <BaseModal onClose={onClose} title={t("title")}>
      <div className="flex flex-col gap-6">
        <div className="flex flex-col gap-2 items-start justify-start">
          <h1 className="text-2xl font-bold">{productName}</h1>
          {bundleTitle && (
            <span className="text-sm bg-main text-white px-2 py-1">
              {bundleTitle}
            </span>
          )}
        </div>

        <div className="flex flex-col gap-4">
          <div className="p-4 bg-gray-100">
            <table className="w-full">
              <tbody>
                {tableItems.map((item, index) => (
                  <tr key={item.label} className="flex justify-between py-1">
                    <td className="text-sm sm:text-base font-medium text-gray-700">
                      {item.label}:
                    </td>
                    <td
                      className={cn(
                        "text-sm sm:text-base font-semibold",
                        index === tableItems.length - 1 &&
                          item.value >= 0 &&
                          "text-green-600",
                        index === tableItems.length - 1 &&
                          item.value < 0 &&
                          "text-red-500",
                      )}
                    >
                      {item.value.toLocaleString(localeString)} GURUs
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="flex flex-col items-center text-center">
          <p className="text-xs md:text-sm text-gray-600">{t("disclaimer")}</p>
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

export default BuyBundleModal;
