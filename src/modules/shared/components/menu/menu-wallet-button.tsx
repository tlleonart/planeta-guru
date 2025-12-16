import { SignedIn, SignedOut } from "@clerk/nextjs";
import { getTranslations } from "next-intl/server";
import { FC } from "react";
import { ModalActivator } from "../modals/modal-activator";
import { Button } from "../ui/button";
import { Download, Heart, Wallet2Icon } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "../ui/dropdown-menu";
import { Link } from "@/i18n/navigation";

export const MenuWalletButton: FC = async () => {
    const t = await getTranslations("WalletMenuButton")

    return (
        <>
            <SignedOut>
                <ModalActivator modalType="Authenticate" modalProps={{}}>
                    <Button
                    variant="outline"
                    className="rounded-none text-blue-400 hover:text-white hover:bg-blue-400 transition-all duration-300 cursor-pointer"
                    >
                        <Wallet2Icon />   
                    </Button>
                </ModalActivator>
            </SignedOut>
            <SignedIn>
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button
                            variant="outline"
                            className="rounded-none text-blue-400 hover:text-white hover:bg-blue-400 transition-all duration-300 cursor-pointer"
                        >
                            <Wallet2Icon />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="w-56 m-6 md:m-0 md:-mx-20 rounded-none transform md:-translate-x-40 md:-translate-y-10">
                        <DropdownMenuLabel>{t("myguru")}</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuGroup>
                            <DropdownMenuItem
                                className="cursor-pointer"
                            >
                                <Link href="/profile">
                                    <Heart />
                                    {t("myguru")}
                                </Link>
                            </DropdownMenuItem>
                            <DropdownMenuItem
                                className="cursor-pointer"
                            >
                                <Link href={`/charge-gurus?origin=/`}>
                                    <Download />
                                    {t("charge")}
                                </Link>
                            </DropdownMenuItem>
                        </DropdownMenuGroup>
                    </DropdownMenuContent>
                </DropdownMenu>
            </SignedIn>
        </>
    )
}