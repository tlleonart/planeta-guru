"use client";

import { SignedIn, SignedOut } from "@clerk/nextjs";
import { useTranslations } from "next-intl";
import type { FC } from "react";
import { usePathname } from "@/i18n/navigation";
import { ModalActivator } from "./modals/modal-activator";
import { Button } from "./ui/button";
import { LinkButton } from "./ui/link-button";

export const ChargeGurusButton: FC = () => {
  const t = useTranslations("ChargeButton");
  const pathname = usePathname();

  return (
    <>
      <SignedIn>
        <LinkButton
          className="rounded-none text-lg cursor-pointer"
          size="lg"
          href={`/charge-gurus?origin=${pathname}`}
        >
          {t("text")}
        </LinkButton>
      </SignedIn>
      <SignedOut>
        <ModalActivator modalType="Authenticate" modalProps={{}}>
          <Button className="rounded-none text-lg cursor-pointer" size="lg">
            {t("text")}
          </Button>
        </ModalActivator>
      </SignedOut>
    </>
  );
};
