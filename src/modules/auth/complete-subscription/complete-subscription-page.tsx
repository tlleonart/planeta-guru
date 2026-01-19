import type { FC } from "react";
import { CompleteSubscriptionForm } from "@/app/[locale]/(auth)/auth/complete-subscription/components/complete-subscription-form";

interface CompleteSubscriptionPageProps {
  userId: string;
}

export const CompleteSubscriptionPage: FC<CompleteSubscriptionPageProps> = ({
  userId,
}) => {
  return (
    <main className="flex flex-col items-center justify-center w-full h-full pt-20 mb-16">
      <CompleteSubscriptionForm externalId={userId} />
    </main>
  );
};
