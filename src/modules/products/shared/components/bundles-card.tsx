"use client";

import { useUser } from "@clerk/nextjs";
import type { FC } from "react";
import { useModalStore } from "@/modules/shared/providers/modal-store-provider";
import { PriceBadge } from "./price-badge";

export interface BundlesCardProps {
  id: number;
  title: string;
  price: number;
  walletAmount: number;
  walletId: number;
  productName: string;
}

/**
 * Client Component: Card de bundle individual
 * - Muestra título y precio del bundle
 * - Click handler para abrir modal de compra
 * - Valida usuario autenticado y saldo suficiente
 * - Hover effect con scale
 */
export const BundlesCard: FC<BundlesCardProps> = ({
  id,
  title,
  price,
  walletAmount,
  walletId,
  productName,
}) => {
  const { isSignedIn } = useUser();
  const openModal = useModalStore((state) => state.openModal);
  const insufficientGurus = walletAmount < price;

  const handleClick = () => {
    if (!isSignedIn) {
      openModal("Authenticate", { returnUrl: window.location.pathname });
      return;
    }
    if (insufficientGurus) {
      openModal("InsufficientGurus", {
        required: price,
        current: walletAmount,
      });
      return;
    }
    openModal("BuyBundle", {
      productName,
      bundleId: id,
      bundleTitle: title,
      price,
      walletAmount,
      walletId,
    });
  };

  return (
    <div className="px-2 max-w-80 md:max-w-96 py-2 flex flex-col h-full">
      <button
        type="button"
        onClick={handleClick}
        className="flex items-center justify-between gap-6 hover:scale-105 duration-100 ease-in-out transition-all cursor-pointer h-full py-2 md:py-4 px-2 md:px-6 shadow-md text-white flex-grow bg-slate-200/20 backdrop-blur-sm"
      >
        <h3 className="text-center text-sm md:text-base">{title}</h3>
        <div className="flex items-center py-1 px-2">
          <PriceBadge price={price} />
        </div>
      </button>
    </div>
  );
};
