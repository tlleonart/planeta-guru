"use client";

import { useSearchParams } from "next/navigation";
import { useLocale } from "next-intl";
import { SignInPage } from "@/modules/auth/sign-in/sign-in-page";

export default function SignIn() {
  const locale = useLocale();
  const redirectUrl = useSearchParams().get("redirectUrl") ?? undefined;

  return <SignInPage locale={locale} redirectUrl={redirectUrl} />;
}
