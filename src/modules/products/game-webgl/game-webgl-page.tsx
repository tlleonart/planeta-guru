"use client";

import dynamic from "next/dynamic";
import type { FC } from "react";

// Dynamic import para evitar SSR del iframe
const GameWebGLIframe = dynamic(
  () =>
    import("./components/game-webgl-iframe").then((mod) => mod.GameWebGLIframe),
  { ssr: false },
);

export interface GameWebGLPageProps {
  url: string;
  title: string;
}

/**
 * Client Component: Página de juego WebGL
 * - Renderiza fullscreen iframe con el juego
 * - Usa dynamic import para cargar iframe solo en client
 * - Mucho más simple que Game HTML/Key (solo iframe, sin card ni info)
 */
export const GameWebGLPage: FC<GameWebGLPageProps> = ({ url, title }) => {
  return (
    <div style={{ width: "100vw", height: "100vh" }}>
      <GameWebGLIframe src={url} title={title} />
    </div>
  );
};
