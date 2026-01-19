import Image from "next/image";
import { getTranslations } from "next-intl/server";
import type { FC } from "react";
import { api } from "@/app/server/server";
import { ChargeGurusButton } from "@/modules/shared/components/charge-gurus-button";
import guruCoinIcon from "@/public/guru-coin.svg";

export const ProfileWalletCard: FC = async () => {
  const t = await getTranslations("WalletCard");

  let amount = 0;
  let hasError = false;

  try {
    const wallet = await api.wallet.getWallet();
    amount = wallet.amount ?? 0;
  } catch {
    hasError = true;
  }

  if (hasError) {
    return (
      <div className="bg-black/20 flex flex-col gap-2 md:gap-4 justify-center items-center p-4 md:p-8 h-1/2">
        <h1 className="text-xl">{t("title")}</h1>
        <p className="text-white/60">{t("unavailable") ?? "No disponible"}</p>
        <ChargeGurusButton />
      </div>
    );
  }

  return (
    <div className="bg-black/20 flex flex-col gap-2 md:gap-4 justify-between items-center p-4 md:p-8 h-1/2">
      <h1 className="text-xl">{t("title")}</h1>
      <p className="flex align-middle gap-4">
        <Image src={guruCoinIcon} alt="Guru Coin" height={20} />
        {amount}
      </p>
      <ChargeGurusButton />
    </div>
  );
};
