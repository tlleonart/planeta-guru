"use client";

import { SignedIn, SignedOut } from "@clerk/nextjs";
import { MenuIcon, SearchIcon, XIcon } from "lucide-react";
import { useTranslations } from "next-intl";
import { type FC, useState } from "react";
import { Link } from "@/i18n/navigation";
import { Button } from "@/modules/shared/components/ui/button";
import { LoginButton } from "@/modules/shared/components/ui/login-button";
import { trpc } from "@/modules/shared/lib/trpc/client";
import { HeaderGurusBadge } from "./header-gurus-badge";
import { HeaderLanguageSelector } from "./header-language-selector";
import { HeaderSearch } from "./header-search";

export const HeaderMobileNav: FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const t = useTranslations("Header");
  const { data: categories } = trpc.product.getCategories.useQuery();

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
    if (isSearchOpen) setIsSearchOpen(false);
  };

  const toggleSearch = () => {
    setIsSearchOpen(!isSearchOpen);
    if (isMenuOpen) setIsMenuOpen(false);
  };

  const closeMenu = () => setIsMenuOpen(false);

  return (
    <div className="lg:hidden flex items-center gap-2">
      <SignedIn>
        <HeaderGurusBadge />
      </SignedIn>

      <HeaderLanguageSelector />

      <Button
        variant="ghost"
        size="icon-sm"
        onClick={toggleSearch}
        className="text-white hover:bg-[#1a1a3e]"
        aria-label={t("search")}
      >
        {isSearchOpen ? (
          <XIcon className="h-5 w-5" />
        ) : (
          <SearchIcon className="h-5 w-5" />
        )}
      </Button>

      <Button
        variant="ghost"
        size="icon-sm"
        onClick={toggleMenu}
        className="text-white hover:bg-[#1a1a3e]"
        aria-label={isMenuOpen ? t("closeMenu") : t("openMenu")}
      >
        {isMenuOpen ? (
          <XIcon className="h-5 w-5" />
        ) : (
          <MenuIcon className="h-5 w-5" />
        )}
      </Button>

      {isSearchOpen && (
        <div className="absolute top-14 left-0 right-0 bg-[#0a0a1f] border-b border-[#1a1a3e] p-4">
          <HeaderSearch />
        </div>
      )}

      {isMenuOpen && (
        <div className="absolute top-14 left-0 right-0 bg-[#0a0a1f] border-b border-[#1a1a3e] p-4">
          <nav className="flex flex-col gap-4">
            <SignedOut>
              <LoginButton />
            </SignedOut>

            <SignedIn>
              <Link
                href="/charge-gurus"
                onClick={closeMenu}
                className="text-white hover:text-pink-400 transition-colors font-medium"
              >
                {t("recargarGurus")}
              </Link>
              <Link
                href="/profile"
                onClick={closeMenu}
                className="text-white hover:text-gray-300 transition-colors"
              >
                {t("myProfile")}
              </Link>
            </SignedIn>

            <div className="border-t border-[#1a1a3e] pt-4">
              <p className="text-gray-400 text-sm mb-2">{t("categories")}</p>
              <div className="flex flex-col gap-2">
                {categories?.items.slice(0, 6).map((category) => (
                  <Link
                    key={category.id}
                    href={`/categories/${category.id}`}
                    onClick={closeMenu}
                    className="text-white hover:text-gray-300 transition-colors"
                  >
                    {category.categoryLanguages[0]?.name}
                  </Link>
                ))}
                <Link
                  href="/categories"
                  onClick={closeMenu}
                  className="text-primary hover:text-primary/80 transition-colors font-medium"
                >
                  {t("viewAllCategories")}
                </Link>
              </div>
            </div>

            <div className="border-t border-[#1a1a3e] pt-4 flex flex-col gap-2">
              <Link
                href="/help"
                onClick={closeMenu}
                className="text-white hover:text-gray-300 transition-colors"
              >
                {t("help")}
              </Link>
              <Link
                href="/faq"
                onClick={closeMenu}
                className="text-white hover:text-gray-300 transition-colors"
              >
                {t("faq")}
              </Link>
            </div>
          </nav>
        </div>
      )}
    </div>
  );
};
