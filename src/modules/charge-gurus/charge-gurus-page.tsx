import { api } from "@/app/server/server"
import { getTranslations } from "next-intl/server"
import { FC } from "react"

interface ChargeGurusProps {
    origin?: string
}

export const ChargeGurusPage: FC<ChargeGurusProps> = async ({ origin }) => {
    const packs = await api.pack.getPacks()
    const t = await getTranslations("ChargeGurus")

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
                {packs.items &&
                    packs.items.map(({ id, guruAmount, prices: { price, transactionCost, totalPrice } }, index) => (
                        <PackCard id={id} value={guruAmount} key={index} price={price} transactionCost={transactionCost} totalPrice={totalPrice} origin={origin} />
                    ))}
                <SubscriptionCard />
            </div>
        </main>
    );
}