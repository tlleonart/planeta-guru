import Image from "next/image";
import { getTranslations } from "next-intl/server";
import type { FC } from "react";
import { Heading } from "@/modules/shared/components/ui/heading";
import { Paragraph } from "@/modules/shared/components/ui/paragraph";
import { Span } from "@/modules/shared/components/ui/span";
import bannerOne from "@/public/help-page/banner-desktop-mobile-1.webp";
import bannerTwo from "@/public/help-page/banner-desktop-mobile-2.webp";
import bannerThree from "@/public/help-page/banner-desktop-mobile-3.webp";

const IMAGES = [bannerOne, bannerTwo, bannerThree];

export const HelpGrid: FC = async () => {
  const t = await getTranslations("Help");

  return (
    <div className="space-y-12 px-6 md:px-40 py-6 md:py-12">
      {[0, 1, 2].map((i) => {
        const isReversed = i % 2 === 1;
        const stepKey = `text${i + 1}`;
        const title = t(`${stepKey}.title`);
        const subtitle = t(`${stepKey}.subtitle`);
        const bullets = t.raw(`${stepKey}.bullets`) as string[];
        const note = t(`${stepKey}.note`) ?? null;

        return (
          <div
            key={i}
            className={`
              flex flex-col md:flex-row justify-between items-center gap-8
              ${isReversed ? "md:flex-row-reverse" : ""}
            `}
          >
            <div className="relative rounded-none overflow-hidden shadow-lg">
              <Image
                src={IMAGES[i]}
                alt={title}
                width={IMAGES[i].width}
                height={IMAGES[i].height}
                className={`object-contain object-left border border-white
                  ${isReversed ? "object-right" : ""}`}
              />
            </div>
            <div className="text-white">
              <Heading className="text-xl md:text-2xl font-semibold mb-4">
                {title}
              </Heading>
              {subtitle && <Paragraph className="mb-4">{subtitle}</Paragraph>}
              <ul className="space-y-2">
                {bullets.map((text) => {
                  const highlight = i !== 1;
                  return (
                    <li key={text} className="flex items-start">
                      {highlight && <Span className="mr-2">•</Span>}
                      <Span>{text}</Span>
                    </li>
                  );
                })}
              </ul>
              {note && (
                <Paragraph className="mt-2 text-xs opacity-70">
                  {note}
                </Paragraph>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};
