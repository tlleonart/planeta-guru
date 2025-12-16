"use client"

import { SignInPage } from "@/modules/auth/sign-in/sign-in-page"
import { useLocale } from "next-intl"
import { useSearchParams } from "next/navigation"

export default function SignIn() {
    const locale = useLocale()
    const redirectUrl = useSearchParams().get('redirectUrl') ?? undefined

    return <SignInPage locale={locale} redirectUrl={redirectUrl} />
}