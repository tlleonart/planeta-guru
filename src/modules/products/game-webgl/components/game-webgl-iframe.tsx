"use client";

import { Maximize } from "lucide-react";
import { type FC, useRef } from "react";

export interface GameWebGLIframeProps {
  src: string;
  title: string;
}

interface FullscreenIframe extends HTMLIFrameElement {
  webkitRequestFullscreen?: () => Promise<void>;
  mozRequestFullScreen?: () => Promise<void>;
  msRequestFullscreen?: () => Promise<void>;
}

/**
 * Client Component: Iframe para juegos WebGL
 * - Renderiza iframe con el juego
 * - Botón de fullscreen con soporte cross-browser
 * - Ocupa todo el viewport
 * - Client-only (no SSR) porque usa refs y browser APIs
 */
export const GameWebGLIframe: FC<GameWebGLIframeProps> = ({ src, title }) => {
  const iframeRef = useRef<FullscreenIframe>(null);

  const enterFullscreen = () => {
    const iframe = iframeRef.current;
    if (!iframe) return;

    if (iframe.requestFullscreen) void iframe.requestFullscreen();
    else if (iframe.webkitRequestFullscreen)
      void iframe.webkitRequestFullscreen();
    else if (iframe.mozRequestFullScreen) void iframe.mozRequestFullScreen();
    else if (iframe.msRequestFullscreen) void iframe.msRequestFullscreen();
  };

  return (
    <div className="w-full h-4/5 mt-28 flex flex-row justify-center items-center">
      <div className="h-full w-full md:aspect-video relative">
        <button
          type="button"
          onClick={enterFullscreen}
          className="absolute top-2 right-2 md:right-20 z-10 p-2 bg-black/30 rounded hover:bg-black/80 text-white"
          title="Pantalla completa"
        >
          <Maximize size={20} />
        </button>

        <iframe
          ref={iframeRef}
          src={src}
          allowFullScreen
          title={`Juego: ${title}`}
          className="w-full h-full rounded-lg shadow-lg border-none"
        />
      </div>
    </div>
  );
};
