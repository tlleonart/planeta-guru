import { SignUpButton } from "@/modules/auth/components/sign-up-button";
import { Heading } from "@/modules/shared/components/ui/heading";
import { LinkButton } from "@/modules/shared/components/ui/link-button";
import { Paragraph } from "@/modules/shared/components/ui/paragraph";
import { SignedIn, SignedOut } from "@clerk/nextjs";
import { getTranslations } from "next-intl/server";
import { FC } from "react";

export const HelpWelcome: FC = async () => {
    const t = await getTranslations("Help")

    return (
        <div className="md:px-20 text-center">
            <Heading className="absoulte md:relative text-2xl md:text-3xl font-bold text-white mb-4">
                {t('title')}
            </Heading>
            <Paragraph className="text-base md:text-lg text-white mb-6 max-w-2xl mx-auto px-6 md:px-0">
                {t.rich("subtitle", {
                    strong: (chunks) => <span className="font-semibold">{chunks}</span>
                })}
            </Paragraph>
            <SignedIn>
                <div className="flex justify-center">
                    <LinkButton className="bg-white text-main rounded-none cursor-pointer hover:text-white hover:bg-white/50 duration-150 ease-in-out transition" href="/">{t('button')}</LinkButton>
                </div>
            </SignedIn>
            <SignedOut>
                <div className="flex justify-center">
                    <SignUpButton dark={false} />
                </div>
            </SignedOut>
        </div>
    )
}