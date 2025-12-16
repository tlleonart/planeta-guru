import { SignUp } from "@clerk/nextjs";
import { FC } from "react"

interface SignUpPageProps {
    locale: string,
    redirectUrl?: string
}

export const SignUpPage: FC<SignUpPageProps> = ({ locale, redirectUrl }) => {
    const finalRedirectUrl = redirectUrl
        ? `/${locale}${redirectUrl}`
        : `/${locale}/help`
    
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
}
