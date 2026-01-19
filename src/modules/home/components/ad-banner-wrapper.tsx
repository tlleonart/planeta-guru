/** biome-ignore-all lint/complexity/useOptionalChain: Explicit null checks for readability */

import type { FC } from "react";
import { api } from "@/app/server/server";
import { AdBanner } from "./ad-banner";
import { AdBannerCard } from "./ad-banner-card";

export const AdBannerWrapper: FC = async () => {
  const adBanner = await api.adBanner.getAdBanner();

  if (!adBanner) return null;

  const nameText =
    adBanner.descriptions?.find(
      (description) => description.descriptionTypeId === 6,
    )?.text ?? "";
  const descriptionText =
    adBanner.descriptions?.find(
      (description) => description.descriptionTypeId === 1,
    )?.text ?? "";

  return (
    <div className="flex justify-center md:justify-start items-center my-10 w-full aspect-[3/2] md:aspect-[31/9] relative rounded-none">
      <AdBanner
        desktopUrl={adBanner.media && adBanner.media[0].url}
        mobileUrl={adBanner.media && adBanner.media[1].url}
      />
      <AdBannerCard name={nameText} description={descriptionText} />
    </div>
  );
};
