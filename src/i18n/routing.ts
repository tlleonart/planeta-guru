import { defineRouting } from "next-intl/routing";

export type Country = {
  name: {
    en: string;
    es: string;
  };
  code: string;
};

export type Languages = {
  name: {
    en: string;
    es: string;
  };
  code: string;
};

export type Locale = `${Country["code"]}-${Languages["code"]}`;

const AVAILABLE_COUNTRIES: Country[] = [
  { name: { en: "Argentina", es: "Argentina" }, code: "AR" },
  { name: { en: "Mexico", es: "México" }, code: "MX" },
  { name: { en: "South Africa", es: "Sudáfrica" }, code: "ZA" },
  { name: { en: "Bolivia", es: "Bolivia" }, code: "BO" },
  { name: { en: "Brazil", es: "Brasil" }, code: "BR" },
  { name: { en: "Chile", es: "Chile" }, code: "CL" },
  { name: { en: "Colombia", es: "Colombia" }, code: "CO" },
  { name: { en: "Costa Rica", es: "Costa Rica" }, code: "CR" },
  { name: { en: "Cuba", es: "Cuba" }, code: "CU" },
  { name: { en: "Ecuador", es: "Ecuador" }, code: "EC" },
  { name: { en: "El Salvador", es: "El Salvador" }, code: "SV" },
  { name: { en: "Guatemala", es: "Guatemala" }, code: "GT" },
  { name: { en: "Haiti", es: "Haití" }, code: "HT" },
  { name: { en: "Honduras", es: "Honduras" }, code: "HN" },
  { name: { en: "Nicaragua", es: "Nicaragua" }, code: "NI" },
  { name: { en: "Panama", es: "Panamá" }, code: "PA" },
  { name: { en: "Paraguay", es: "Paraguay" }, code: "PY" },
  { name: { en: "Peru", es: "Perú" }, code: "PE" },
  {
    name: { en: "Dominican Republic", es: "República Dominicana" },
    code: "DO",
  },
  { name: { en: "Uruguay", es: "Uruguay" }, code: "UY" },
  { name: { en: "Venezuela", es: "Venezuela" }, code: "VE" },
];

const AVAILABLE_LANGUAGES: Languages[] = [
  { name: { en: "English", es: "Inglés" }, code: "en" },
  { name: { en: "Spanish", es: "Español" }, code: "es" },
];

const AVAILABLE_LOCALES: Locale[] = AVAILABLE_COUNTRIES.flatMap((country) =>
  AVAILABLE_LANGUAGES.map(
    (language) =>
      `${country.code.toLowerCase()}-${language.code.toLowerCase()}` as Locale,
  ),
);

const DEFAULT_LOCALE = "ar-es";

export const routing = defineRouting({
  locales: AVAILABLE_LOCALES,
  defaultLocale: DEFAULT_LOCALE,
});

export { AVAILABLE_COUNTRIES, AVAILABLE_LANGUAGES, AVAILABLE_LOCALES };
