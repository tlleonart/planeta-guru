"use client";

import { useEffect } from "react";
import { Button } from "@/modules/shared/components/ui/button";

interface ErrorPageProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function ErrorPage({ error, reset }: ErrorPageProps) {
  useEffect(() => {
    // Log error to monitoring service
    console.error("[ROOT_ERROR]", error);
  }, [error]);

  return (
    <main className="flex flex-col items-center justify-center min-h-[60vh] px-4">
      <div className="text-center max-w-md">
        <h1 className="text-4xl font-bold text-white mb-4">
          ¡Oops! Algo salió mal
        </h1>
        <p className="text-white/70 mb-8">
          Ha ocurrido un error inesperado. Por favor, intenta de nuevo.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button onClick={reset} className="rounded-none">
            Intentar de nuevo
          </Button>
          <Button
            onClick={() => {
              window.location.href = "/";
            }}
            variant="outline"
            className="rounded-none"
          >
            Volver al inicio
          </Button>
        </div>
        {error.digest && (
          <p className="text-white/40 text-sm mt-8">
            Código de error: {error.digest}
          </p>
        )}
      </div>
    </main>
  );
}
