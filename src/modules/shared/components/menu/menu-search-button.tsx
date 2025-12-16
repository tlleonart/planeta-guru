"use client"

import type { FC } from "react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "../ui/dropdown-menu";
import { Button } from "../ui/button";
import { Search } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { Searchbar } from "../ui/searchbar";
import { useTranslations } from "next-intl";

export const MenuSearchButton: FC = () => {
    const t = useTranslations('SearchMenuButton')

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="outline" className="rounded-none text-blue-400 hover:text-white hover:bg-blue-400 transition-all duration-300 cursor-pointer">
                    <Search />
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56 m-6 rounded-none md:m-0 transform md:-translate-x-33 md:-translate-y-10">
                <DropdownMenuLabel>{t("search")}</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuGroup>
                    <DropdownMenuItem onSelect={(event) => event.preventDefault()} asChild>
                        <Searchbar />
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                        <Link href="/categories">
                            {t("categories")}</Link>
                    </DropdownMenuItem>
                </DropdownMenuGroup>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}