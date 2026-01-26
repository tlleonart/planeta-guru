import { notFound } from "next/navigation";
import { hasLocale, NextIntlClientProvider } from "next-intl";
import { setRequestLocale } from "next-intl/server";
import { Suspense } from "react";
import { routing } from "@/i18n/routing";
import { ModalRenderer } from "@/modules/shared/components/modals/modal-renderer";
import { NavigationProgress } from "@/modules/shared/components/navigation-progress";

type Props = {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
};

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export default async function LocaleLayout({ children, params }: Props) {
  const { locale } = await params;

  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }

  setRequestLocale(locale);

  return (
    <NextIntlClientProvider locale={locale}>
      <Suspense fallback={null}>
        <NavigationProgress />
      </Suspense>
      {children}
      <ModalRenderer />
    </NextIntlClientProvider>
  );
}
