import { FC } from "react";
import { HeaderLogo } from "./header-logo";
import { HeaderButtons } from "./header-buttons";

export const HeaderComponent: FC = () => {
  return (
    <header className="absolute top-0 right-0 left-0 flex justify-between items-center p-3 sm:p-5 md:p-7 lg:px-6 lg:p-6 z-50 bg-transparent text-black">
      <HeaderLogo />
      <HeaderButtons />
    </header>
  );
};
