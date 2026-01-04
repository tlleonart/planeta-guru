"use client"

import { FC, useActionState } from "react"
import { Button } from "./ui/button"
import { cn } from "../lib/utils"
import { useTranslations } from "next-intl"
import { unsubscribeAction } from "@/app/actions"

interface UnsubscribeFormProps {
    msisdn: string,
    serviceName: string,
    providerName: string,
    operatorName: string
}

const initialState = {
    msisdn: "",
    serviceName: "",
    providerName: "",
    operatorName: ""
}

export const UnsubscribeForm: FC<UnsubscribeFormProps> = ({ msisdn, serviceName, providerName, operatorName }) => {
    const t = useTranslations("Subscriptions")
    const [state, formAction, pending] = useActionState(unsubscribeAction, initialState)
    return (
        <form action={formAction}>
            <input type="hidden" value={msisdn} readOnly />
            <input type="hidden" value={serviceName} readOnly />
            <input type="hidden" value={providerName} readOnly />
            <input type="hidden" value={operatorName} readOnly />
            <Button
                className={cn(
                    "font-semibold px-10 py-2 rounded-lg text-gray-200 underline cursor-pointer",
                    pending && "text-gray-600 pointer pointer-events-none decoration-0"
                )}
                type="submit"
                disabled={pending}
            >
                {t("cancel")}
            </Button>
        </form>
    )
}   