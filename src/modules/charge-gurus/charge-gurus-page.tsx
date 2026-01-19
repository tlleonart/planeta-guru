import { getTranslations } from "next-intl/server";
import type { FC } from "react";
import { api } from "@/app/server/server";
import { PackCard } from "./components/pack-card";
import { SubscriptionCard } from "./components/subscription-card";

interface ChargeGurusProps {
  origin?: string;
}

/**
 * Server Component: Página principal de Charge Gurus
 * - Lista de packs disponibles para comprar gurús
 * - Card de suscripción al final
 * - Recibe origin como query param opcional
 * - Data fetching con tRPC
 */
export const ChargeGurusPage: FC<ChargeGurusProps> = async ({ origin }) => {
  const packs = await api.pack.getPacks();
  const t = await getTranslations("ChargeGurus");

  return (
    <main className="flex flex-col justify-center items-center h-screen pt-6 md:pt-0 gap-8 md:absolute">
      <div className="flex flex-col justify-center text-center gap-2">
        <h1 className="text-2xl">
          {t.rich("title", {
            strong: (children) => <strong>{children}</strong>,
          })}
        </h1>
        <p className="text-md opacity-80">{t("choose")}</p>
      </div>
      <div className="flex flex-wrap gap-4 justify-between md:justify-start px-10 md:px-20">
        {packs.items?.map((pack) => (
          <PackCard
            key={pack.id}
            id={pack.id}
            value={pack.guruAmount}
            price={pack.prices.price}
            transactionCost={pack.prices.transactionCost}
            totalPrice={pack.prices.totalPrice}
            origin={origin}
          />
        ))}
        <SubscriptionCard />
      </div>
    </main>
  );
};
