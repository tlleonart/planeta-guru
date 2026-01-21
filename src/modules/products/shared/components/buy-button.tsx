"use client";

import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import type { FC } from "react";
import { Button } from "@/modules/shared/components/ui/button";
import { useModalStore } from "@/modules/shared/providers/modal-store-provider";

export interface BuyButtonProps {
  isOwner?: boolean;
  slug: string;
  price: number;
  walletAmount: number;
  walletId?: number;
  bundleId?: number;
  bundleTitle?: string;
  productName?: string;
}

/**
 * Client Component: Botón de compra/jugar
 * - Maneja autenticación, validación de saldo y compra
 * - Usa modales para feedback al usuario
 */
export const BuyButton: FC<BuyButtonProps> = ({
  isOwner = false,
  slug,
  price,
  walletAmount,
  walletId = 0,
  bundleId = 0,
  bundleTitle = "",
  productName = "",
}) => {
  const t = useTranslations("BuyButton");
  const router = useRouter();
  const { isSignedIn } = useUser();
  const openModal = useModalStore((state) => state.openModal);

  const insufficientGurus = walletAmount < price;

  const handleClick = () => {
    if (!isSignedIn) {
      openModal("Authenticate", { returnUrl: window.location.pathname });
      return;
    }

    if (insufficientGurus && price > 0) {
      openModal("InsufficientGurus", {
        required: price,
        current: walletAmount,
      });
      return;
    }

    if (isOwner) {
      router.push(`/products/games-view/${slug}`);
      return;
    }

    // Open buy bundle modal for purchase flow
    openModal("BuyBundle", {
      productName,
      bundleId,
      bundleTitle,
      price,
      walletAmount,
      walletId,
    });
  };

  return (
    <Button
      size="sm"
      className="text-xs sm:text-sm md:text-base rounded-none cursor-pointer"
      onClick={handleClick}
    >
      {isOwner ? t("play") : t("text")}
    </Button>
  );
};
