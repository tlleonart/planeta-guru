"use client";

import { SignOutButton } from "@clerk/nextjs";
import { Download, Heart, LogOut, User } from "lucide-react";
import { useTranslations } from "next-intl";
import type { FC } from "react";
import { Link } from "@/i18n/navigation";
import { Button } from "@/modules/shared/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/modules/shared/components/ui/dropdown-menu";

export const HeaderProfileLink: FC = () => {
  const t = useTranslations("Header");

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          className="h-9 px-3 text-white hover:bg-[#2a2a5e] hover:text-white gap-1"
        >
          <User className="h-4 w-4" />
          {t("myProfile")}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="end"
        className="bg-[#1a1a3e] border-[#2a2a5e] min-w-[180px]"
      >
        <DropdownMenuItem asChild>
          <Link
            href="/profile"
            className="text-white hover:bg-[#2a2a5e] cursor-pointer flex items-center gap-2"
          >
            <User className="h-4 w-4" />
            {t("myProfile")}
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link
            href="/profile/downloads"
            className="text-white hover:bg-[#2a2a5e] cursor-pointer flex items-center gap-2"
          >
            <Download className="h-4 w-4" />
            {t("myDownloads")}
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link
            href="/profile/favorites"
            className="text-white hover:bg-[#2a2a5e] cursor-pointer flex items-center gap-2"
          >
            <Heart className="h-4 w-4" />
            {t("myFavorites")}
          </Link>
        </DropdownMenuItem>
        <DropdownMenuSeparator className="bg-[#2a2a5e]" />
        <DropdownMenuItem className="text-white hover:bg-[#2a2a5e] cursor-pointer p-0">
          <SignOutButton redirectUrl="/">
            <div className="flex items-center gap-2 w-full px-2 py-1.5">
              <LogOut className="h-4 w-4" />
              {t("signOut")}
            </div>
          </SignOutButton>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
