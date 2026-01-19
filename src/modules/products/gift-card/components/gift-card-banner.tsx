import Image from "next/image";
import type { FC } from "react";

export interface GiftCardBannerProps {
  name: string;
  desktopImage: string;
  mobileImage: string;
}

/**
 * Server Component: Banner de Gift Card
 * - Imagen responsiva optimizada con Next/Image
 * - Picture tag para diferentes dispositivos
 * - Priority loading para LCP óptimo
 * - Idéntico a GameHTMLBanner/GameKeyBanner
 */
export const GiftCardBanner: FC<GiftCardBannerProps> = ({
  name,
  desktopImage,
  mobileImage,
}) => {
  return (
    <div className="relative aspect-square md:aspect-auto md:absolute md:inset-0 overflow-hidden rounded-none">
      <picture>
        <source media="(max-width: 767px)" srcSet={mobileImage} />
        <source media="(min-width: 768px)" srcSet={desktopImage} />
        <Image
          src={desktopImage}
          alt={name}
          fill
          quality={85}
          sizes="100vw"
          className="relative object-cover object-center md:object-top w-full"
          priority
        />
      </picture>
    </div>
  );
};
