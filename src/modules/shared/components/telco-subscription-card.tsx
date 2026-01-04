import { api } from "@/app/server/server";
import { getTranslations } from "next-intl/server";
import { FC } from "react";
import { UnsubscribeForm } from "./unsubscribe-form";

export const TelcoSubscriptionCard: FC = async () => {
    const t = await getTranslations("Subscriptions")
    const { externalUserAccount, operatorName, providerName, serviceName, status, valid } = await api.user.getSubscription()

    return (
        <div className="flex flex-col justify-between h-1/2 text-white bg-black/20 p-4 md:p-8">
            <h2 className=" text-center text-xl ">
                {t("title")}
            </h2>
            <div className="flex flex-col">
                <div className="flex flex-row gap-2 w-full justify-center items-center">
                    <div className={cn(
                        "w-4 h-4 rounded-full",
                        valid ? "bg-green-400" : "bg-red-400"
                    )}></div>
                    <div>
                        <p className="text-lg ">{t(status?.toLowerCase())}</p>
                    </div>
                </div>
                {valid &&
                    <div className="flex flex-row gap-2 w-full justify-center">
                        <UnsubscribeForm msisdn={externalUserAccount} serviceName={serviceName} providerName={providerName} operatorName={operatorName} />
                    </div>
                }
            </div>
        </div>
    );
}