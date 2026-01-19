import type { FC } from "react";
import { PrivacyContent } from "./components/privacy-content";

/**
 * Server Component: Página de política de privacidad
 * - Muestra contenido de privacidad con padding top
 * - Layout simple con PrivacyContent
 */
export const PrivacyPage: FC = () => {
  return (
    <section className="pt-16">
      <PrivacyContent />
    </section>
  );
};
