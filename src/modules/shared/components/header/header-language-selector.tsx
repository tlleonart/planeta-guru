"use client";

import {
  AR,
  BO,
  BR,
  CL,
  CO,
  CR,
  CU,
  DO,
  EC,
  GT,
  HN,
  HT,
  MX,
  NI,
  PA,
  PE,
  PY,
  SV,
  UY,
  VE,
  ZA,
} from "country-flag-icons/react/3x2";
import { ChevronDownIcon, GlobeIcon, XIcon } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import { useLocale, useTranslations } from "next-intl";
import { type FC, useState } from "react";
import {
  AVAILABLE_COUNTRIES,
  AVAILABLE_LANGUAGES,
  type Country,
} from "@/i18n/routing";
import { Button } from "@/modules/shared/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/modules/shared/components/ui/sheet";
import { cn } from "@/modules/shared/lib/utils";

type FlagComponent = FC<{ className?: string }>;

const FLAG_COMPONENTS: Record<string, FlagComponent> = {
  AR,
  BO,
  BR,
  CL,
  CO,
  CR,
  CU,
  DO,
  EC,
  GT,
  HN,
  HT,
  MX,
  NI,
  PA,
  PE,
  PY,
  SV,
  UY,
  VE,
  ZA,
};

const getFlagComponent = (countryCode: string): FlagComponent | null => {
  return FLAG_COMPONENTS[countryCode] ?? null;
};

export const HeaderLanguageSelector: FC = () => {
  const locale = useLocale();
  const pathname = usePathname();
  const router = useRouter();
  const t = useTranslations("Header");

  const currentCountryCode = locale.split("-")[0]?.toUpperCase() ?? "AR";
  const currentLanguageCode = locale.split("-")[1]?.toLowerCase() ?? "es";

  const [selectedCountry, setSelectedCountry] = useState<Country | null>(
    AVAILABLE_COUNTRIES.find((c) => c.code === currentCountryCode) ?? null,
  );
  const [selectedLanguage, setSelectedLanguage] =
    useState<string>(currentLanguageCode);
  const [isOpen, setIsOpen] = useState(false);

  const handleCountrySelect = (country: Country) => {
    setSelectedCountry(country);
    // Navigate immediately with current language
    const newLocale = `${country.code.toLowerCase()}-${selectedLanguage}`;
    const pathWithoutLocale = pathname.replace(/^\/[a-z]{2}-[a-z]{2}/, "");
    const newPath = `/${newLocale}${pathWithoutLocale || ""}`;
    router.push(newPath);
    setIsOpen(false);
  };

  const handleLanguageSelect = (langCode: string) => {
    setSelectedLanguage(langCode);
    if (selectedCountry) {
      const newLocale = `${selectedCountry.code.toLowerCase()}-${langCode}`;
      const pathWithoutLocale = pathname.replace(/^\/[a-z]{2}-[a-z]{2}/, "");
      const newPath = `/${newLocale}${pathWithoutLocale || ""}`;
      router.push(newPath);
      setIsOpen(false);
    }
  };

  const displayLanguage = currentLanguageCode.toUpperCase();
  const displayCountry = currentCountryCode;

  const CurrentFlag = getFlagComponent(currentCountryCode);

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className="text-white hover:bg-[#1a1a3e] hover:text-white px-2 h-8 gap-1.5"
        >
          {CurrentFlag ? (
            <CurrentFlag className="h-4 w-5 rounded-sm" />
          ) : (
            <GlobeIcon className="h-4 w-4" />
          )}
          <span className="text-sm">
            {displayCountry} | {displayLanguage}
          </span>
          <ChevronDownIcon className="h-3 w-3" />
        </Button>
      </SheetTrigger>
      <SheetContent
        side="right"
        className="w-80 bg-[#0d0d24] border-l border-[#2a2a5e] p-0 flex flex-col"
      >
        <SheetHeader className="p-4 border-b border-[#2a2a5e]">
          <div className="flex items-center justify-between">
            <SheetTitle className="text-white text-lg font-semibold">
              {t("selectCountry")}
            </SheetTitle>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-gray-400 hover:text-white hover:bg-[#1a1a3e]"
              onClick={() => setIsOpen(false)}
            >
              <XIcon className="h-4 w-4" />
            </Button>
          </div>
        </SheetHeader>

        {/* Countries List */}
        <div className="flex-1 overflow-y-auto p-2">
          <div className="space-y-1">
            {AVAILABLE_COUNTRIES.map((country) => {
              const FlagComp = getFlagComponent(country.code);
              const isSelected = country.code === currentCountryCode;

              return (
                <button
                  key={country.code}
                  type="button"
                  onClick={() => handleCountrySelect(country)}
                  className={cn(
                    "w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors",
                    "hover:bg-[#1a1a3e] cursor-pointer text-left",
                    isSelected &&
                      "bg-purple-600/20 border border-purple-500/50",
                  )}
                >
                  {FlagComp ? (
                    <FlagComp className="h-5 w-7 rounded-sm flex-shrink-0 shadow-sm" />
                  ) : (
                    <div className="h-5 w-7 bg-gray-600 rounded-sm flex-shrink-0" />
                  )}
                  <span
                    className={cn(
                      "text-sm",
                      isSelected ? "text-purple-300 font-medium" : "text-white",
                    )}
                  >
                    {country.name[currentLanguageCode as "en" | "es"]}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Language Selection at Bottom */}
        <div className="border-t border-[#2a2a5e] p-4">
          <p className="text-gray-400 text-xs mb-3 uppercase tracking-wide">
            {t("selectLanguage")}
          </p>
          <div className="flex gap-2">
            {AVAILABLE_LANGUAGES.map((language) => {
              const isSelected = language.code === selectedLanguage;
              return (
                <button
                  key={language.code}
                  type="button"
                  onClick={() => handleLanguageSelect(language.code)}
                  className={cn(
                    "flex-1 py-2 px-3 rounded-lg text-sm font-medium transition-colors",
                    isSelected
                      ? "bg-purple-600 text-white"
                      : "bg-[#1a1a3e] text-gray-300 hover:bg-[#2a2a5e] hover:text-white",
                  )}
                >
                  {language.name[currentLanguageCode as "en" | "es"]}
                </button>
              );
            })}
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
};
