"use client";

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
import { useModalStore } from "@/modules/shared/providers/modal-store-provider";
import { useConfirmPaymentModal } from "../hooks/use-confirm-payment-modal";

interface ConfirmPaymentModalProps {
  id: number;
  method?: string;
  origin?: string;
  realIp?: string;
}

/**
 * Client Component: Modal de confirmación de compra
 * - Muestra mensaje de confirmación antes de redirigir a MercadoPago
 * - Al confirmar, llama al action gurusPaymentAction
 * - Redirige a la URL de compra de MercadoPago
 * - State gestionado con nuqs (URL-based)
 */
export const ConfirmPaymentModal: FC<ConfirmPaymentModalProps> = ({
  id,
  method,
  origin,
  realIp,
}) => {
  const { isOpen, setIsOpen, close } = useConfirmPaymentModal();
  const [loading, setLoading] = useState(false);
  const t = useTranslations("ConfirmPaymentModal");
  const tError = useTranslations("ErrorModal");
  const openModal = useModalStore((state) => state.openModal);

  const handleConfirm = async (event: MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    setLoading(true);

    try {
      // Construir URL completa con host y path de origen
      const customSuccessUrl = origin
        ? `${window.location.origin}${origin}`
        : undefined;

      const payload = {
        guru_pack_id: id,
        payment_method: method ?? "",
        custom_success_url: customSuccessUrl ?? null,
        user_ip_address: realIp ?? null,
      };

      const response = await fetch("/api/payment", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Payment failed");
      }

      const data = await response.json();

      // Redirigir a MercadoPago
      const link = data.id.purchase_link;
      window.location.href = link;
    } catch (error) {
      console.error("Error confirming payment:", error);
      close();
      openModal("Error", { message: tError("defaultMessage") });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{t("title")}</DialogTitle>
        </DialogHeader>
        <div className="flex flex-col gap-8 justify-center items-center">
          <div className="md:w-3/4">
            <p className="text-center">{t("message")}</p>
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
        </div>
      </DialogContent>
    </Dialog>
  );
};
