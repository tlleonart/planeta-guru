"use client";

import Image from "next/image";
import { useTranslations } from "next-intl";
import type { FC, MouseEvent } from "react";
import { useState } from "react";
import { Button } from "@/modules/shared/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/modules/shared/components/ui/dialog";
import { cn } from "@/modules/shared/lib/utils";
import guruCoin from "@/public/guru-coin.svg";
import { useConfirmPaymentModal } from "../hooks/use-confirm-payment-modal";
import { usePaymentModal } from "../hooks/use-payment-modal";

interface PaymentSummaryModalProps {
  pack: string;
  price: string;
  transactionCost: string;
  totalPrice: string;
}

/**
 * Client Component: Modal de resumen de compra
 * - Muestra desglose de precio (costo + servicio = total)
 * - Botón de confirmar abre ConfirmPaymentModal
 * - Botón de cancelar cierra el modal
 * - State gestionado con nuqs (URL-based)
 */
export const PaymentSummaryModal: FC<PaymentSummaryModalProps> = ({
  pack,
  price,
  transactionCost,
  totalPrice,
}) => {
  const { isOpen, setIsOpen, close } = usePaymentModal();
  const { open: openConfirm } = useConfirmPaymentModal();
  const [loading, setLoading] = useState(false);
  const t = useTranslations("PaymentModal");

  const currencyTitleClass = "text-sm sm:text-base md:text-lg";
  const currencyValueClass = "text-sm sm:text-base md:text-lg";

  const handleConfirm = (event: MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    setLoading(true);
    openConfirm();
    close();
    setLoading(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{t("title")}</DialogTitle>
        </DialogHeader>
        <div className="flex flex-col gap-4 justify-center items-center">
          <div className="flex flex-col gap-4 w-full">
            <p className="flex flex-row gap-2 text-lg items-center">
              {t("gurus")}:
              <Image src={guruCoin} alt="Guru Coin" className="w-4 h-4" />
              <span className="text-xl font-semibold">{pack}</span>
            </p>
            <div className="p-4 bg-gray-600/20">
              <table className="w-full">
                <tbody>
                  <tr>
                    <td className={currencyTitleClass}>{t("cost")}:</td>
                    <td className={currencyValueClass}>${price}</td>
                  </tr>
                  <tr>
                    <td className={currencyTitleClass}>
                      {t("service_charge")}:
                    </td>
                    <td className={currencyValueClass}>${transactionCost}</td>
                  </tr>
                  <tr>
                    <td className={currencyTitleClass}>{t("total")}:</td>
                    <td
                      className={`${currencyValueClass} md:text-xl font-semibold`}
                    >
                      ${totalPrice}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
          <div className="flex flex-row gap-4 justify-center">
            <Button
              disabled={loading}
              size="sm"
              variant="ghost"
              className="text-xs sm:text-sm md:text-base no-underline hover:underline rounded-none cursor-pointer"
              onClick={close}
              type="button"
            >
              {t("cancel")}
            </Button>
            <Button
              disabled={loading}
              size="sm"
              className={cn(
                "text-xs sm:text-sm md:text-base rounded-none cursor-pointer disabled:cursor-progress disabled:pointer-events-none",
              )}
              onClick={handleConfirm}
              type="button"
            >
              {t("confirm")}
            </Button>
          </div>
          <div className="flex flex-col">
            <p className="text-xs md:text-sm py-1">
              {t("tyc")}
              <a
                href="https://storage.googleapis.com/planeta-guru-assets-bucket/terms/planetaguru/tyc-es.html"
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary underline hover:text-primary/80"
              >
                {t("terms_link")}
              </a>
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
