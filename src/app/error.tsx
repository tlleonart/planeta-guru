"use client";

import { useEffect } from "react";

interface ErrorPageProps {
  error: Error & { digest?: string };
  reset: () => void;
}

/**
 * Root Error Boundary
 * Catches errors at the app root level (outside locale routes)
 */
export default function RootErrorPage({ error, reset }: ErrorPageProps) {
  useEffect(() => {
    console.error("[APP_ROOT_ERROR]", error);
  }, [error]);

  return (
    <html lang="es">
      <body className="bg-main min-h-screen flex items-center justify-center">
        <main className="flex flex-col items-center justify-center min-h-[60vh] px-4">
          <div className="text-center max-w-md">
            <h1 className="text-4xl font-bold text-white mb-4">
              Error de aplicacion
            </h1>
            <p className="text-white/70 mb-8">
              Ha ocurrido un error inesperado. Por favor, intenta de nuevo.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={reset}
                type="button"
                className="px-6 py-2 bg-primary text-white rounded-none cursor-pointer"
              >
                Intentar de nuevo
              </button>
              <button
                onClick={() => {
                  window.location.href = "/";
                }}
                type="button"
                className="px-6 py-2 border border-white text-white rounded-none cursor-pointer"
              >
                Volver al inicio
              </button>
            </div>
            {error.digest && (
              <p className="text-white/40 text-sm mt-8">
                Codigo de error: {error.digest}
              </p>
            )}
          </div>
        </main>
      </body>
    </html>
  );
}
