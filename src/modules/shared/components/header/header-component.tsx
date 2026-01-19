import type { FC } from "react";
import { HeaderDesktopNav } from "./header-desktop-nav";
import { HeaderLogo } from "./header-logo";
import { HeaderMobileNav } from "./header-mobile-nav";

export const HeaderComponent: FC = () => {
  return (
    <header className="sticky top-0 z-50 w-full bg-[#0a0a1f] border-b border-[#1a1a3e]">
      <div className="container mx-auto px-4 lg:px-6 h-14 flex items-center justify-between gap-3">
        <HeaderLogo />
        <HeaderDesktopNav />
        <HeaderMobileNav />
      </div>
    </header>
  );
};
