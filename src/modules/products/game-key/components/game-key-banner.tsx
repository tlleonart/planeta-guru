import Image from "next/image";
import type { FC } from "react";

export interface GameKeyBannerProps {
  name: string;
  desktopImage: string;
  mobileImage: string;
  url: string;
}

/**
 * Server Component: Banner del Game Key
 * - Muestra imagen responsiva optimizada con Next/Image
 * - Picture tag para diferentes dispositivos
 * - Priority loading para LCP óptimo
 * - Similar a GameHTMLBanner pero sin overlay (el overlay está en el container)
 */
export const GameKeyBanner: FC<GameKeyBannerProps> = ({
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
          className="object-cover"
          priority
        />
      </picture>
    </div>
  );
};
