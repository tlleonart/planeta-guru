import { currentUser } from "@clerk/nextjs/server";
import type { FC } from "react";
import { TelcoSubscriptionCard } from "../shared/components/telco-subscription-card";
import { ProfileCard } from "./components/profile-card";
import { ProfileWalletCard } from "./components/profile-wallet-card";

export const ProfilePage: FC = async () => {
  const user = await currentUser();

  return (
    <main className="flex flex-col items-center justify-center w-full h-full md:absolute">
      <div className="h-full md:h-2/3 w-full grid grid-cols-1 md:grid-cols-2 gap-4 p-8 pt-16 md:pt-8">
        <ProfileCard username={user?.username} avatarUrl={user?.imageUrl} />
        <div className="flex flex-col gap-4 h-full">
          <TelcoSubscriptionCard />
          <ProfileWalletCard />
        </div>
      </div>
    </main>
  );
};
