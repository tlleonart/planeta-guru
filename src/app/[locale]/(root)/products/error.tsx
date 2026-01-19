"use client";

import { useEffect } from "react";
import { Link } from "@/i18n/navigation";
import { Button } from "@/modules/shared/components/ui/button";

interface ErrorPageProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function ProductErrorPage({ error, reset }: ErrorPageProps) {
  useEffect(() => {
    console.error("[PRODUCT_ERROR]", error);
  }, [error]);

  return (
    <main className="flex flex-col items-center justify-center min-h-[60vh] px-4">
      <div className="text-center max-w-md">
        <h1 className="text-3xl font-bold text-white mb-4">
          Producto no disponible
        </h1>
        <p className="text-white/70 mb-8">
          No pudimos cargar este producto. Puede que no esté disponible en tu
          región o haya ocurrido un error temporal.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button onClick={reset} className="rounded-none">
            Reintentar
          </Button>
          <Link href="/categories">
            <Button variant="outline" className="rounded-none">
              Ver categorías
            </Button>
          </Link>
        </div>
      </div>
    </main>
  );
}
