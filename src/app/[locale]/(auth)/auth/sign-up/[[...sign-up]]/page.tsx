"use client";

import { useSearchParams } from "next/navigation";
import { useLocale } from "next-intl";
import { SignUpPage } from "@/modules/auth/sign-up/sign-up-page";

export default function SignUp() {
  const locale = useLocale();
  const redirectUrl = useSearchParams().get("redirectUrl") ?? undefined;

  return <SignUpPage locale={locale} redirectUrl={redirectUrl} />;
}
