"use client";

import { useUser } from "@clerk/nextjs";
import type { FC } from "react";
import { PriceBadge } from "@/modules/products/shared/components/price-badge";
import { useModalStore } from "@/modules/shared/providers/modal-store-provider";

export interface ComboBundlesCardProps {
  id: number;
  title: string;
  price: number;
  currency: string;
  productName: string;
}

/**
 * Client Component: Card de bundle individual para Combo
 * - Muestra titulo y precio del bundle en moneda local
 * - Click handler para abrir ComboSummary modal
 * - Valida usuario autenticado
 * - Hover effect con scale
 */
export const ComboBundlesCard: FC<ComboBundlesCardProps> = ({
  id,
  title,
  price,
  currency,
  productName,
}) => {
  const { isSignedIn } = useUser();
  const openModal = useModalStore((state) => state.openModal);

  const handleClick = () => {
    if (!isSignedIn) {
      openModal("Authenticate", { returnUrl: window.location.pathname });
      return;
    }
    // Open ComboSummary modal with bundle and product info
    openModal("ComboSummary", {
      productName,
      bundleId: id,
      bundleTitle: title,
      price,
      currency,
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
          <PriceBadge price={price} currency={currency} />
        </div>
      </button>
    </div>
  );
};
