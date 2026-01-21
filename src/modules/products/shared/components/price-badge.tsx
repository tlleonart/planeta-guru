"use client";

import { useLocale, useTranslations } from "next-intl";
import type { FC } from "react";

export interface PriceBadgeProps {
  price: number;
  currency?: string;
}

/**
 * Client Component: Badge de precio del producto
 * - Muestra "Free" o el precio
 * - Si se pasa currency, muestra precio en moneda local (ej: "$19,777 ARS")
 * - Si no hay currency, muestra precio en GURUs
 * - i18n con next-intl
 */
export const PriceBadge: FC<PriceBadgeProps> = ({ price, currency }) => {
  const t = useTranslations("PriceBadge");
  const locale = useLocale();

  // BCP 47 language tags use hyphens (ar-ES), not underscores
  const formattedPrice = currency ? price.toLocaleString(locale) : price;

  return (
    <div className="flex items-center justify-center px-4 py-2 bg-gradient-to-r from-purple-600 to-blue-500 rounded-lg shadow-lg">
      <span className="text-lg font-bold text-white">
        {price === 0
          ? t("free")
          : currency
            ? `$${formattedPrice} ${currency}`
            : `${formattedPrice} ${t("currency")}`}
      </span>
    </div>
  );
};
