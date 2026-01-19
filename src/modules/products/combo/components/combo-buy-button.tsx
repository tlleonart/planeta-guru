"use client";

import { useUser } from "@clerk/nextjs";
import { useTranslations } from "next-intl";
import type { FC } from "react";
import { Button } from "@/modules/shared/components/ui/button";
import { useModalStore } from "@/modules/shared/providers/modal-store-provider";

export interface ComboBuyButtonProps {
  productName: string;
  bundleId: number;
  bundleTitle: string;
  price: number;
  currency: string;
}

/**
 * Client Component: Boton de compra para Combo
 * - Maneja autenticacion
 * - Abre ComboSummary modal (pago con MercadoPago, no usa gurus)
 */
export const ComboBuyButton: FC<ComboBuyButtonProps> = ({
  productName,
  bundleId,
  bundleTitle,
  price,
  currency,
}) => {
  const t = useTranslations("BuyButton");
  const { isSignedIn } = useUser();
  const openModal = useModalStore((state) => state.openModal);

  const handleClick = () => {
    if (!isSignedIn) {
      openModal("Authenticate", { returnUrl: window.location.pathname });
      return;
    }

    // Open combo summary modal with all needed data
    openModal("ComboSummary", {
      productName,
      bundleId,
      bundleTitle,
      price,
      currency,
    });
  };

  return (
    <Button
      size="sm"
      className="text-xs sm:text-sm md:text-base rounded-none cursor-pointer"
      onClick={handleClick}
    >
      {t("text")}
    </Button>
  );
};
