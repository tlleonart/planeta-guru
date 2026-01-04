"use client"

import { SignedIn, SignedOut } from "@clerk/nextjs";
import { FC } from "react";
import { LinkButton } from "./ui/link-button";
import { usePathname } from "@/i18n/navigation";
import { useTranslations } from "next-intl";
import { ModalActivator } from "./modals/modal-activator";
import { Button } from "./ui/button";

export const ChargeGurusButton: FC = () => {
    const t = useTranslations("ChargeButton")
    const pathname = usePathname()

    return (
        <>
            <SignedIn>
                <LinkButton className="rounded-none text-black text-lg cursor-pointer" size="lg" href={`/charge-gurus?origin=${pathname}`}>
                    {t("text")}
                </LinkButton>
            </SignedIn>
            <SignedOut>
                <ModalActivator modalType="Authenticate" modalProps={{}}>
                    <Button className="rounded-none text-black text-lg cursor-pointer" size="lg">
                        {t("text")}
                    </Button>
                </ModalActivator>
            </SignedOut>
        </>
    )
}