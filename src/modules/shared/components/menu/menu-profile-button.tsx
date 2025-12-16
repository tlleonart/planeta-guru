import { SignedIn, SignedOut, SignOutButton } from "@clerk/nextjs";
import { getTranslations } from "next-intl/server";
import { FC } from "react";
import { ModalActivator } from "../modals/modal-activator";
import { Button } from "../ui/button";
import { Bot, DoorClosed, Download, Heart } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "../ui/dropdown-menu";
import { Link } from "@/i18n/navigation";

export const MenuProfileButton: FC = async () => {
    const t = await getTranslations("ProfileMenuButton")

    return (
        <>
            <SignedOut>
                <ModalActivator modalType="Authenticate" modalProps={{}}>
                    <Button
                        variant="outline"
                        className="rounded-none text-blue-400 hover:text-white hover:bg-blue-400 transition-all duration-300 cursor-pointer"
                    >
                        <Bot />   
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
                            <Bot />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="w-56 m-6 md:m-0 md:-mx-20 rounded-none transform md:-translate-x-40 md:-translate-y-10">
                        <DropdownMenuLabel>{t("myprofile")}</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuGroup>
                            <DropdownMenuItem
                                className="cursor-pointer"
                            >
                                <Link href="/account">
                                    <Heart />
                                    {t("myaccount")}
                                </Link>
                            </DropdownMenuItem>
                            <DropdownMenuItem
                                className="cursor-pointer"
                            >
                                <ModalActivator modalType="EditUser" modalProps={{}}>
                                    <Download />   
                                    {t("myuser")}
                                </ModalActivator>
                            </DropdownMenuItem>
                            <DropdownMenuItem className="cursor-pointer">
                                <SignOutButton redirectUrl="/">
                                    <div className="flex justify-ceter items-center gap-2">
                                        <DoorClosed />
                                        {t("logout")}
                                    </div>
                                </SignOutButton>
                            </DropdownMenuItem>
                        </DropdownMenuGroup>
                    </DropdownMenuContent>
                </DropdownMenu>
            </SignedIn>
        </>
    )
}