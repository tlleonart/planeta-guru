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
    <main className="flex flex-col justify-center items-center min-h-screen py-20 md:py-24 gap-8">
      <div className="flex flex-col justify-center text-center gap-2 px-4">
        <h1 className="text-2xl">
          {t.rich("title", {
            strong: (children) => <strong>{children}</strong>,
          })}
        </h1>
        <p className="text-md opacity-80">{t("choose")}</p>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 px-4 sm:px-8 md:px-16 w-full max-w-6xl">
        {packs.items?.map((pack) => (
          <PackCard
            key={pack.id}
            id={pack.id}
            value={pack.guruAmount}
            origin={origin}
          />
        ))}
        <SubscriptionCard />
      </div>
    </main>
  );
};
