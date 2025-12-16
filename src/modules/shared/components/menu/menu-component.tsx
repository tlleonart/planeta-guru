import type { FC } from "react";
import { MenuHamburgerButton } from "./menu-hamburger-button";
import { MenuFavoritesButton } from "./menu-favorites-button";
import { MenuSearchButton } from "./menu-search-button";
import { MenuWalletButton } from "./menu-wallet-button";
import { MenuProfileButton } from "./menu-profile-button";

export const MenuComponent: FC = () => {
  return (
    <div className="fixed bottom-0 w-full p-6 md:p-14 flex justify-center items-center h-32 md:top-0 md:right-0 md:w-40 md:h-full z-40 pointer-events-none">
      <div className="bg-white relative p-3 space-x-4 shadow-lg md:flex md:flex-col md:space-x-0 md:space-y-4 pointer-events-auto">
        <MenuHamburgerButton />
        <MenuFavoritesButton />
        <MenuSearchButton />
        <MenuWalletButton />
        <MenuProfileButton />
      </div>
    </div>
  );
};