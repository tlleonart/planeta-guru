import { getTranslations } from "next-intl/server";
import type { FC } from "react";

/**
 * Server Component: Contenido de política de privacidad
 * - Muestra título, subtítulo y contenido en formato de párrafos
 * - Detecta encabezados de nivel superior (formato: "1. Texto")
 * - Layout con border y padding responsivo
 */
export const PrivacyContent: FC = async () => {
  const t = await getTranslations("PrivacyText");
  const content = t.raw("content") as string[];

  return (
    <div className="flex flex-col px-6 md:px-40 py-12">
      <h1 className="flex justify-center text-3xl font-semibold mb-8">
        {t("title")}
      </h1>
      <div className="border border-white p-10">
        <div className="w-full">
          <h4 className="text-xl font-semibold">{t("subheading")}</h4>
        </div>
        <div className="mt-4 space-y-4 text-justify">
          {content.map((line, i) => {
            const isTopLevelHeading = /^\d+\.(?!\d)\s/.test(line);

            if (isTopLevelHeading) {
              return (
                <h4
                  // biome-ignore lint/suspicious/noArrayIndexKey: Static content from translations
                  key={`heading-${i}`}
                  className="text-xl font-semibold mt-8"
                >
                  {line}
                </h4>
              );
            }
            return (
              // biome-ignore lint/suspicious/noArrayIndexKey: Static content from translations
              <p key={`content-${i}`}>{line}</p>
            );
          })}
        </div>
      </div>
    </div>
  );
};
