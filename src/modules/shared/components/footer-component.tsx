// src/components/footer/footer.tsx

import Image from "next/image";
import { getTranslations } from "next-intl/server";
import type { FC } from "react";
import { api } from "@/app/server/server";
import { Link } from "@/i18n/navigation";
import nexusLogo from "@/public/footer/nexus-logo.svg";

export const FooterComponent: FC = async () => {
  const t = await getTranslations("Footer");

  let termsUrl = "/terms";

  try {
    const legalsUrls = await api.legals.getLegalsUrls();
    termsUrl = legalsUrls.termsUrl ?? "/terms";
  } catch {}

  return (
    <footer className="flex flex-col md:flex-row items-center justify-center gap-2 bg-white/10 w-full pb-28 md:pb-4 py-4 text-white">
      <Image
        src={nexusLogo}
        alt="Nexus Logo"
        width={30}
        height={30}
        className="h-[30px] w-auto object-contain"
      />

      <div className="flex flex-col items-center justify-center">
        <div className="flex flex-wrap justify-center gap-2 items-center">
          <Link
            href="/privacy"
            target="_blank"
            className="text-sm hover:text-opacity-80 transition-colors underline px-2 pb-1"
          >
            {t("privacy")}
          </Link>

          <span className="hidden md:inline">-</span>

          <Link
            href={termsUrl}
            target="_blank"
            className="text-sm hover:text-opacity-80 transition-colors underline px-2 pb-1"
          >
            {t("terms")}
          </Link>
        </div>

        <p className="text-sm">
          {t("rights")} {new Date().getFullYear()}
        </p>
      </div>
    </footer>
  );
};
