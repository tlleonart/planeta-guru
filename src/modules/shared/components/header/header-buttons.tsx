import { FC } from "react";
import { SignedIn, SignedOut } from "@clerk/nextjs";
import { LoginButton } from "@/modules/shared/components/ui/login-button";
import { HeaderLanguageButton } from "./header-language-button";
import { HeaderProfileButton } from "./header-profile-button";

export const HeaderButtons: FC = () => {
  return (
    <div className="flex items-center gap-2 sm:gap-3 md:gap-4">
      <HeaderLanguageButton />
      <SignedOut>
        <LoginButton />
      </SignedOut>
      <SignedIn>
        <HeaderProfileButton />
      </SignedIn>
    </div>
  );
};
