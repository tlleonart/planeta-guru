import { api } from "@/app/server/server";
import { getTranslations } from "next-intl/server";
import Image from "next/image";
import { FC } from "react";
import guruCoinIcon from "@/public/guru-coin.svg";
import { ChargeGurusButton } from "@/modules/shared/components/charge-gurus-button";

export const ProfileWalletCard: FC = async () => {
    const t = await getTranslations("WalletCard")
    const { amount } = await api.wallet.getWallet()

    return (
        <div className="bg-black/20 flex flex-col gap-2 md:gap-4 justify-between items-center p-4 md:p-8 h-1/2">
            <h1 className="text-xl">{t("title")}</h1>
            <p className="flex align-middle gap-4">
                <Image src={guruCoinIcon} alt="Guru Coin" height={20} />
                {amount ?? 0}
            </p>
            <ChargeGurusButton />
        </div>
    );
}