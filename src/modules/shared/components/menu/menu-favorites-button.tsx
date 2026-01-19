import { SignedIn, SignedOut } from "@clerk/nextjs";
import { Download, Gamepad, Group, Heart } from "lucide-react";
import { getTranslations } from "next-intl/server";
import type { FC } from "react";
import { Link } from "@/i18n/navigation";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/modules/shared/components/ui/dropdown-menu";
import { ModalActivator } from "../modals/modal-activator";
import { Button } from "../ui/button";

export const MenuFavoritesButton: FC = async () => {
  const t = await getTranslations("FavoritesMenuButton");

  return (
    <>
      <SignedOut>
        <ModalActivator modalType="Authenticate" modalProps={{}}>
          <Button
            variant="outline"
            className="rounded-none text-blue-400 hover:text-white hover:bg-blue-400 transition-all duration-300 cursor-pointer"
          >
            <Gamepad />
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
              <Gamepad />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56 m-6 md:m-0 md:-mx-20 rounded-none transform md:-translate-x-40 md:-translate-y-10">
            <DropdownMenuLabel>{t("favorites")}</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuItem className="cursor-pointer">
                <Link href="/favorites">
                  <Heart />
                  {t("favorites")}
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem className="cursor-pointer">
                <Link href="/downloads">
                  <Download />
                  {t("downloads")}
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem className="cursor-pointer">
                <Link href="categories">
                  <Group />
                  {t("categories")}
                </Link>
              </DropdownMenuItem>
            </DropdownMenuGroup>
          </DropdownMenuContent>
        </DropdownMenu>
      </SignedIn>
    </>
  );
};
