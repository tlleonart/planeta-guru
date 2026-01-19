"use client";

import { SignedIn, SignedOut } from "@clerk/nextjs";
import type { FC } from "react";
import { LoginButton } from "@/modules/shared/components/ui/login-button";
import { HeaderCategoriesDropdown } from "./header-categories-dropdown";
import { HeaderGurusBadge } from "./header-gurus-badge";
import { HeaderHelpLink } from "./header-help-link";
import { HeaderLanguageSelector } from "./header-language-selector";
import { HeaderProfileLink } from "./header-profile-link";
import { HeaderRecargarButton } from "./header-recargar-button";
import { HeaderSearch } from "./header-search";

export const HeaderDesktopNav: FC = () => {
  return (
    <nav className="hidden lg:flex items-center gap-3 flex-1">
      <HeaderSearch />
      <HeaderCategoriesDropdown />

      <div className="flex items-center gap-2 ml-auto">
        <SignedIn>
          <HeaderGurusBadge />
          <HeaderRecargarButton />
          <HeaderProfileLink />
        </SignedIn>
        <SignedOut>
          <LoginButton variant="header" />
        </SignedOut>
        <HeaderLanguageSelector />
        <HeaderHelpLink />
      </div>
    </nav>
  );
};
