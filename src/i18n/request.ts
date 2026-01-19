import { hasLocale } from "next-intl";
import { getRequestConfig } from "next-intl/server";
import { routing } from "./routing";

export default getRequestConfig(async ({ requestLocale }) => {
  const requested = await requestLocale;

  const countryLocale = hasLocale(routing.locales, requested)
    ? requested
    : routing.defaultLocale;

  const locale = countryLocale.split("-")[1];

  return {
    locale: countryLocale,
    messages: (await import(`../../messages/${locale}.json`)).default,
  };
});
