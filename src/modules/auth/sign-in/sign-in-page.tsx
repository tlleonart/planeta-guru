import { SignIn } from "@clerk/nextjs";
import type { FC } from "react";
import { validateRedirectUrl } from "@/modules/shared/lib/validate-redirect";

interface SignInPageProps {
  locale: string;
  redirectUrl?: string;
}

export const SignInPage: FC<SignInPageProps> = ({ locale, redirectUrl }) => {
  const finalRedirectUrl = validateRedirectUrl(redirectUrl, locale, "/help");

  return (
    <main className="flex flex-col items-center justify-center w-full h-full pt-20">
      <style jsx global>{`
        .cl-internal-1dauvpw {
          display: none !important;
        }
      `}</style>
      <SignIn
        appearance={{
          elements: {
            cardBox: "!rounded-none",
            card: "!rounded-none",
            button: "!rounded-none",
            input: "!rounded-none",
            footer: "",
          },
        }}
        fallbackRedirectUrl={finalRedirectUrl}
        forceRedirectUrl={finalRedirectUrl}
        signUpUrl={`/${locale}/auth/sign-up`}
      />
    </main>
  );
};
