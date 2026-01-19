"use client";

import { CreditCard, Minimize2 } from "lucide-react";
import Image from "next/image";
import { useTranslations } from "next-intl";
import type { FC } from "react";
import { Link } from "@/i18n/navigation";
import mercadoPagoLogo from "@/public/mercadopago-logo.svg";
import oxxoLogo from "@/public/oxxo-logo.svg";

interface PaymentMethodsProps {
  pack: string;
  id: number;
  price: string;
  transactionCost: string;
  totalPrice: string;
  selectedCountry: string;
  origin?: string;
}

/**
 * Client Component: Grid de métodos de pago
 * - Muestra diferentes métodos de pago según el país
 * - CASH (Oxxo) solo disponible para México
 * - Cada método crea un link con query param payment-modal=true
 * - Client Component por uso de translations client-side
 */
export const PaymentMethods: FC<PaymentMethodsProps> = ({
  pack,
  id,
  price,
  transactionCost,
  totalPrice,
  selectedCountry,
  origin,
}) => {
  const t = useTranslations("PaymentMethod");

  const methods = [
    { id: "CREDIT_CARD", title: t("credit"), icon: <CreditCard /> },
    { id: "TRANF", title: t("transfer"), icon: <Minimize2 /> },
    { id: "DEBIT_CARD", title: t("debit"), icon: <CreditCard /> },
    {
      id: "CARD",
      title: t("mp"),
      icon: <Image src={mercadoPagoLogo} alt="MercadoPago" className="w-8" />,
    },
    // CASH solo para México
    ...(selectedCountry === "MX"
      ? [
          {
            id: "CASH",
            title: t("cash"),
            icon: <Image src={oxxoLogo} alt="Oxxo" className="w-8" />,
          },
        ]
      : []),
  ];

  return (
    <div className="flex flex-wrap gap-4 px-10 md:px-20">
      {methods.map((method) => {
        const queryParams = new URLSearchParams({ "payment-modal": "true" });
        if (origin) {
          queryParams.set("origin", origin);
        }
        const href = `/charge-gurus/payments/${pack}/${id}/${price}/${transactionCost}/${totalPrice}/${method.id}?${queryParams.toString()}`;

        return (
          <Link key={method.id} href={href}>
            <div className="flex p-10 justify-center md:min-w-64 items-center align-middle h-20 bg-white/20 cursor-pointer gap-4 transition-all duration-300 hover:bg-white/10">
              {method.icon}
              {method.title}
            </div>
          </Link>
        );
      })}
    </div>
  );
};
