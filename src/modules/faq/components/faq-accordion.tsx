"use client";

import { useTranslations } from "next-intl";
import type { FC } from "react";
import { useState } from "react";

/**
 * Client Component: Acordeón de preguntas frecuentes
 * - Muestra lista de preguntas con respuestas expandibles
 * - State local para controlar item expandido
 * - Animaciones de transición suaves
 * - Client Component por uso de useState
 */
export const FAQAccordion: FC = () => {
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);
  const t = useTranslations("FAQ");

  const faqKeys = [
    "first",
    "second",
    "third",
    "fourth",
    "fifth",
    "sixth",
    "seventh",
    "eighth",
    "ninth",
    "tenth",
    "eleventh",
  ];

  const handleToggle = (index: number) => {
    setExpandedIndex((prev) => (prev === index ? null : index));
  };

  return (
    <div className="divide-y border rounded-none overflow-hidden">
      {faqKeys.map((key, index) => (
        <button
          key={key}
          type="button"
          className="w-full p-4 cursor-pointer bg-white hover:bg-gray-50 transition text-left"
          onClick={() => handleToggle(index)}
        >
          <h3 className="text-main font-semibold mb-2 flex justify-between items-center">
            {t(`${key}Title`)}
            <span className="ml-2 transform transition-transform duration-200 text-2xl">
              {expandedIndex === index ? "−" : "+"}
            </span>
          </h3>

          {expandedIndex === index && (
            <div className="text-base md:text-left text-main mt-2">
              {t(`${key}Description`)}
            </div>
          )}
        </button>
      ))}
    </div>
  );
};
