"use client"

import { SignUpPage } from "@/modules/auth/sign-up/sign-up-page"
import { useLocale } from "next-intl"
import { useSearchParams } from "next/navigation"

export default function SignUp() {
    const locale = useLocale()
    const redirectUrl = useSearchParams().get('redirectUrl') ?? undefined

    return <SignUpPage locale={locale} redirectUrl={redirectUrl} />
}