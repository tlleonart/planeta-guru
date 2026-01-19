import { Link } from "@/i18n/navigation";
import { Button } from "@/modules/shared/components/ui/button";

/**
 * Locale-specific Not Found Page
 * Displays when a page within a locale is not found
 */
export default function LocaleNotFound() {
  return (
    <main className="flex flex-col items-center justify-center min-h-[60vh] px-4">
      <div className="text-center max-w-md">
        <h1 className="text-6xl font-bold text-white mb-4">404</h1>
        <h2 className="text-2xl font-semibold text-white mb-4">
          Pagina no encontrada
        </h2>
        <p className="text-white/70 mb-8">
          La pagina que buscas no existe o ha sido movida.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button asChild className="rounded-none">
            <Link href="/">Volver al inicio</Link>
          </Button>
          <Button asChild variant="outline" className="rounded-none">
            <Link href="/categories">Ver categorias</Link>
          </Button>
        </div>
      </div>
    </main>
  );
}
