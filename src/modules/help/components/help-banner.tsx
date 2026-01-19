import Image from "next/image";
import type { FC } from "react";
import bannerDesktop from "@/public/help-page/banner-desktop.webp";
import bannerMobile from "@/public/help-page/banner-mobile.webp";

export const HelpBanner: FC = () => {
  return (
    <div className="flex justify-center items-center ">
      <div className="w-full h-[50dvh] md:h-[60vh] relative rounded-none">
        <div className="w-full h-full relative">
          <picture>
            <source media="(max-width: 767px)" srcSet={bannerMobile.src} />
            <source media="(min-width: 768px)" srcSet={bannerDesktop.src} />
            <Image
              alt="Help Banner"
              src={bannerDesktop}
              fill
              className="relative object-contain overflow-hidden"
            />
          </picture>
        </div>
      </div>
    </div>
  );
};
