"use client";

import { useTranslations } from "next-intl";
import { type FC, useActionState } from "react";
import { unsubscribeAction } from "@/app/actions";
import { cn } from "../lib/utils";
import { Button } from "./ui/button";

interface UnsubscribeFormProps {
  msisdn?: string;
  serviceName?: string;
  providerName?: string;
  operatorName?: string;
}

const initialState = {
  msisdn: "",
  serviceName: "",
  providerName: "",
  operatorName: "",
};

export const UnsubscribeForm: FC<UnsubscribeFormProps> = ({
  msisdn,
  serviceName,
  providerName,
  operatorName,
}) => {
  const t = useTranslations("Subscriptions");
  const [_state, formAction, pending] = useActionState(
    unsubscribeAction,
    initialState,
  );
  return (
    <form action={formAction}>
      <input type="hidden" name="msisdn" value={msisdn ?? ""} readOnly />
      <input
        type="hidden"
        name="serviceName"
        value={serviceName ?? ""}
        readOnly
      />
      <input
        type="hidden"
        name="providerName"
        value={providerName ?? ""}
        readOnly
      />
      <input
        type="hidden"
        name="operatorName"
        value={operatorName ?? ""}
        readOnly
      />
      <Button
        className={cn(
          "font-semibold px-10 py-2 rounded-lg text-gray-200 underline cursor-pointer",
          pending && "text-gray-600 pointer pointer-events-none decoration-0",
        )}
        type="submit"
        disabled={pending}
      >
        {t("cancel")}
      </Button>
    </form>
  );
};
