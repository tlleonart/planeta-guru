import { getTranslations } from "next-intl/server";
import type { FC } from "react";
import { api } from "@/app/server/server";
import { cn } from "@/modules/shared/lib/utils";
import { UnsubscribeForm } from "./unsubscribe-form";

export const TelcoSubscriptionCard: FC = async () => {
  const t = await getTranslations("Subscriptions");

  let subscriptionData: {
    externalUserAccount?: string;
    operatorName?: string;
    providerName?: string;
    serviceName?: string;
    status?: string;
    valid?: boolean;
  } = {};
  let hasError = false;

  try {
    subscriptionData = await api.subscription.getSubscription();
  } catch {
    hasError = true;
  }

  const {
    externalUserAccount,
    operatorName,
    providerName,
    serviceName,
    status,
    valid,
  } = subscriptionData;

  if (hasError) {
    return (
      <div className="flex flex-col justify-center items-center h-1/2 text-white bg-black/20 p-4 md:p-8">
        <h2 className="text-center text-xl">{t("title")}</h2>
        <p className="text-white/60 mt-4">
          {t("unavailable") ?? "No disponible"}
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col justify-between h-1/2 text-white bg-black/20 p-4 md:p-8">
      <h2 className=" text-center text-xl ">{t("title")}</h2>
      <div className="flex flex-col">
        <div className="flex flex-row gap-2 w-full justify-center items-center">
          <div
            className={cn(
              "w-4 h-4 rounded-full",
              valid ? "bg-green-400" : "bg-red-400",
            )}
          ></div>
          <div>
            <p className="text-lg ">{t(status?.toLowerCase() ?? "inactive")}</p>
          </div>
        </div>
        {valid && (
          <div className="flex flex-row gap-2 w-full justify-center">
            <UnsubscribeForm
              msisdn={externalUserAccount}
              serviceName={serviceName}
              providerName={providerName}
              operatorName={operatorName}
            />
          </div>
        )}
      </div>
    </div>
  );
};
