import { getTranslations } from "next-intl/server";
import type { FC } from "react";
import { ProfileCardAvatar } from "./profile-card-avatar";

interface ProfileCardsProps {
  username?: string | null;
  avatarUrl?: string | null;
}

export const ProfileCard: FC<ProfileCardsProps> = async ({
  username,
  avatarUrl,
}) => {
  const t = await getTranslations("ProfileCard");

  return (
    <div className="flex flex-col justify-center items-center bg-black/20 p-4 h-full gap-4 md:gap-8">
      <ProfileCardAvatar avatarUrl={avatarUrl} />
      <h1 className="text-xl text-center">
        {t.rich("text", {
          username: username || "",
          strong: (children) => <strong>{children}</strong>,
        })}
      </h1>
    </div>
  );
};
