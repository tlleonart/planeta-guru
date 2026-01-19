"use client";

import { type FC, useLayoutEffect, useRef, useState } from "react";

export interface ReadMoreProps {
  text: string;
  maxLength?: number;
  readMoreLabel?: string;
  readLessLabel?: string;
}

/**
 * Client Component: Componente de leer más/menos optimizado
 * - Trunca texto largo y permite expandir/contraer
 * - Animación suave con transición CSS
 * - Calcula altura automáticamente con useLayoutEffect
 * - Solo se muestra si el texto excede maxLength
 */
export const ReadMore: FC<ReadMoreProps> = ({
  text,
  maxLength = 200,
  readMoreLabel = "Leer más",
  readLessLabel = "Leer menos",
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [collapsedHeight, setCollapsedHeight] = useState<number>(0);
  const contentRef = useRef<HTMLDivElement>(null);
  const hiddenRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    if (hiddenRef.current) {
      setCollapsedHeight(hiddenRef.current.scrollHeight);
    }
  }, []);

  const toggleReadMore = () => {
    setIsExpanded((prev) => !prev);
  };

  // Si el texto es corto, renderizar directamente
  if (text.length <= maxLength) {
    return <>{text}</>;
  }

  return (
    <div>
      <div
        ref={contentRef}
        style={{
          maxHeight: isExpanded
            ? contentRef.current?.scrollHeight
            : collapsedHeight,
          overflow: "hidden",
          transition: "max-height 0.5s ease",
        }}
      >
        {text}
      </div>
      <div
        ref={hiddenRef}
        style={{
          position: "absolute",
          visibility: "hidden",
          overflow: "hidden",
          whiteSpace: "normal",
          width: contentRef.current
            ? contentRef.current.getBoundingClientRect().width
            : "auto",
        }}
      >
        {text.substring(0, maxLength)}
        {"..."}
      </div>
      <button
        type="button"
        className="text-sky-500 text-sm md:text-base cursor-pointer hover:underline"
        onClick={toggleReadMore}
      >
        {isExpanded ? readLessLabel : readMoreLabel}
      </button>
    </div>
  );
};
