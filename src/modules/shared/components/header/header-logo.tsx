import Image from "next/image";
import type { FC } from "react";
import { Link } from "@/i18n/navigation";
import logo from "@/public/logo.png";

export const HeaderLogo: FC = () => {
  return (
    <Link href="/" className="flex items-center shrink-0">
      <Image
        src={logo}
        alt="Planeta Guru logo"
        className="cursor-pointer h-9 md:h-10 w-auto object-contain"
        priority
      />
    </Link>
  );
};
