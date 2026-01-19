"use client";

import { useEffect } from "react";

interface GlobalErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

/**
 * Global Error Boundary
 * Catches errors in root layout - this is the last resort error boundary
 * Must render its own html/body tags as it replaces the entire document
 */
export default function GlobalError({ error, reset }: GlobalErrorProps) {
  useEffect(() => {
    console.error("[GLOBAL_ERROR]", error);
  }, [error]);

  return (
    <html lang="es">
      <body
        style={{
          backgroundColor: "#0f172a",
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontFamily: "system-ui, sans-serif",
        }}
      >
        <main
          style={{
            textAlign: "center",
            maxWidth: "400px",
            padding: "20px",
          }}
        >
          <h1
            style={{ color: "white", fontSize: "2rem", marginBottom: "1rem" }}
          >
            Error critico
          </h1>
          <p style={{ color: "rgba(255,255,255,0.7)", marginBottom: "2rem" }}>
            Ha ocurrido un error grave. Por favor, recarga la pagina.
          </p>
          <div
            style={{ display: "flex", gap: "1rem", justifyContent: "center" }}
          >
            <button
              onClick={reset}
              type="button"
              style={{
                padding: "10px 20px",
                backgroundColor: "#7c3aed",
                color: "white",
                border: "none",
                cursor: "pointer",
              }}
            >
              Reintentar
            </button>
            <button
              onClick={() => {
                window.location.href = "/";
              }}
              type="button"
              style={{
                padding: "10px 20px",
                backgroundColor: "transparent",
                color: "white",
                border: "1px solid white",
                cursor: "pointer",
              }}
            >
              Ir al inicio
            </button>
          </div>
          {error.digest && (
            <p
              style={{
                color: "rgba(255,255,255,0.4)",
                fontSize: "0.75rem",
                marginTop: "2rem",
              }}
            >
              Codigo: {error.digest}
            </p>
          )}
        </main>
      </body>
    </html>
  );
}
