import { Link } from "@/i18n/navigation";
import Image from "next/image";
import { FC } from "react";
import logo from "@/public/logo.svg";

export const HeaderLogo: FC = () => {
  return (
    <Link href="/" className="flex items-center w-1/3 sm:w-1/4 md:w-1/5">
      <Image
        src={logo || "/placeholder.svg"}
        alt="Planeta Guru logo"
        className="cursor-pointer h-8 sm:h-10 md:h-10 lg:h-10 w-auto object-contain"
        priority
      />
    </Link>
  );
};
