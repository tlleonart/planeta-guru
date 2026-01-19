import { HelpPage } from "@/modules/help/help-page";

/**
 * Ruta de Welcome
 * - Reutiliza HelpPage ya que ambas páginas tienen el mismo contenido
 * - Página de bienvenida con información sobre Planeta Guru
 */
export default function WelcomeRoute() {
  return <HelpPage />;
}
