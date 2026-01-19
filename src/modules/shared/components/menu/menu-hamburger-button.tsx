import { CircleHelp, Info, Menu } from "lucide-react";
import { getTranslations } from "next-intl/server";
import type { FC } from "react";
import { Link } from "@/i18n/navigation";
import { Button } from "@/modules/shared/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/modules/shared/components/ui/dropdown-menu";

export const MenuHamburgerButton: FC = async () => {
  const t = await getTranslations("HamburgerMenuButton");

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          className="rounded-none text-blue-400 hover:text-white hover:bg-blue-400 transition-all duration-300 cursor-pointer"
        >
          <Menu />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56 m-6 md:m-0 md:-mx-20 rounded-none transform md:-translate-x-40 md:-translate-y-10">
        <DropdownMenuLabel>Menu</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem className="cursor-pointer">
            <Link href="/help">
              <Info />
              {t("help")}
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem className="cursor-pointer">
            <Link href="/faq">
              <CircleHelp />
              {t("faqs")}
            </Link>
          </DropdownMenuItem>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
