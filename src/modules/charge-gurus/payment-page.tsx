import { headers } from "next/headers";
import { getTranslations } from "next-intl/server";
import type { FC } from "react";
import { ConfirmPaymentModal } from "./components/confirm-payment-modal";
import { PaymentMethods } from "./components/payment-methods";
import { PaymentSummaryModal } from "./components/payment-summary-modal";

interface PaymentPageProps {
  id: number;
  pack: string;
  price: string;
  transactionCost: string;
  totalPrice: string;
  method?: string;
  origin?: string;
}

/**
 * Server Component: Página de detalle de pago
 * - Muestra selección de métodos de pago
 * - Incluye modales de resumen y confirmación (Client Islands)
 * - Recibe todos los parámetros desde URL catch-all
 * - Extrae país seleccionado y real IP desde headers
 */
export const PaymentPage: FC<PaymentPageProps> = async ({
  id,
  pack,
  method,
  price,
  transactionCost,
  totalPrice,
  origin,
}) => {
  const t = await getTranslations("PaymentMethod");
  const formattedPack = parseFloat(pack).toFixed(0);

  const headersList = await headers();
  const selectedCountry = headersList.get("selected-country") || "mx";
  const realIp = headersList.get("x-forwarded-for") || undefined;

  return (
    <>
      <ConfirmPaymentModal
        id={id}
        method={method ?? ""}
        origin={origin}
        realIp={realIp}
      />
      <PaymentSummaryModal
        pack={formattedPack}
        price={price}
        transactionCost={transactionCost}
        totalPrice={totalPrice}
      />
      <main className="flex flex-col justify-center items-center w-full h-screen gap-8 md:absolute">
        <div className="flex flex-col justify-center text-center gap-2">
          <h1 className="text-2xl">{t("title")}</h1>
          <p className="text-md opacity-80">
            {t("subtitle")} <strong>{formattedPack} GURUs</strong>
          </p>
        </div>
        <PaymentMethods
          pack={formattedPack}
          id={id}
          price={price}
          transactionCost={transactionCost}
          totalPrice={totalPrice}
          selectedCountry={selectedCountry}
          origin={origin}
        />
      </main>
    </>
  );
};
