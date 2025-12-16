/** biome-ignore-all lint/security/noDangerouslySetInnerHtml: <explanation> */
import { Heading } from "@/modules/shared/components/ui/heading";
import { Paragraph } from "@/modules/shared/components/ui/paragraph";
import { FC } from "react";

interface AdBannerCardProps {
  name: string;
  description: string;
}

export const AdBannerCard: FC<AdBannerCardProps> = ({ name, description }) => {

  return (
    <div className="flex md:ml-4 md:mr-0 mx-2 xl:ml-16 bg-main/20 p-4 sm:p-6 md:p-3 lg:p-6 backdrop-blur-lg">
      <div className="flex flex-col justify-between items-start gap-8 text-center">
      <div>
        <Heading className="text-base sm:text-3xl md:text-xl xl:text-2xl font-bold mb-1 md:mb-2w-full relative rounded-none">{name}</Heading>
        <Paragraph 
          className="text-xs sm:text-lg mb-3 md:mb-4 line-clamp-3 md:line-clamp-none"
          dangerouslySetInnerHTML={{ __html: description }}
        />
      </div>
      </div>
    </div>
  );
};
