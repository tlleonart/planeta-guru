import { getTranslations } from "next-intl/server";
import type { FC } from "react";
import { FAQAccordion } from "./components/faq-accordion";

/**
 * Server Component: Página de preguntas frecuentes
 * - Muestra título y acordeón de preguntas
 * - Layout centrado y responsive
 * - FAQAccordion es Client Island para interactividad
 */
export const FAQPage: FC = async () => {
  const t = await getTranslations("FAQ");

  return (
    <section className="pt-16">
      <div className="w-full h-full flex flex-col md:flex-row overflow-visible">
        <div className="px-8 lg:flex flex-col gap-4 md:content-center py-0 md:py-10 w-full h-full text-center">
          <div>
            <h1 className="text-xl md:text-2xl font-semibold">
              {t("mainTitle")}
            </h1>
          </div>
          <div className="flex flex-col gap-4 w-full lg:w-2/3 mx-auto font-light text-sm xl:text-lg mt-4 md:mt-2">
            <FAQAccordion />
          </div>
        </div>
      </div>
    </section>
  );
};
