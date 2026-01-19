import { SignUp } from "@clerk/nextjs";
import type { FC } from "react";
import { validateRedirectUrl } from "@/modules/shared/lib/validate-redirect";

interface SignUpPageProps {
  locale: string;
  redirectUrl?: string;
}

export const SignUpPage: FC<SignUpPageProps> = ({ locale, redirectUrl }) => {
  const finalRedirectUrl = validateRedirectUrl(redirectUrl, locale, "/help");

  return (
    <main className="flex flex-col items-center justify-center w-full h-full pt-20 mb-16">
      <style jsx global>{`
        .cl-internal-1dauvpw {
          display: none !important;
        }
      `}</style>
      <SignUp
        appearance={{
          elements: {
            cardBox: "!rounded-none",
            card: "!rounded-none",
            button: "!rounded-none",
            input: "!rounded-none",
            phoneInputBox: "!rounded-none",
          },
        }}
        signInUrl={`/${locale}/auth/sign-in`}
        fallbackRedirectUrl={finalRedirectUrl}
        forceRedirectUrl={finalRedirectUrl}
      />
    </main>
  );
};
