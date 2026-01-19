import type { Description } from "@/modules/shared/types/product-types";

/**
 * Obtiene la descripción del producto, priorizando la larga sobre la corta
 * @param descriptions - Array de descripciones del producto
 * @returns Texto de la descripción o string vacío
 */
export const getDescription = (descriptions: Description[]): string => {
  // Intenta obtener descripción larga (type_id: 2)
  const long = descriptions?.find(
    (description) => description.descriptionTypeId === 2,
  )?.text;

  if (long?.trim()) {
    return long;
  }

  // Si no hay larga, obtiene la corta (type_id: 1)
  const short = descriptions?.find(
    (description) => description.descriptionTypeId === 1,
  )?.text;

  return short || "";
};

/**
 * Obtiene los puntos destacados del producto desde las descripciones
 * @param descriptions - Array de descripciones del producto
 * @returns Array de strings con los puntos destacados formateados
 */
export const getBullets = (descriptions: Description[]): string[] => {
  const text = descriptions?.find(
    (description) => description.descriptionTypeId === 5,
  )?.text;

  return text
    ? text
        .split(/\d+-\s*/)
        .filter(Boolean)
        .map((segment) => segment.trim())
    : [];
};

/**
 * Obtiene las instrucciones del producto desde las descripciones
 * @param descriptions - Array de descripciones del producto
 * @returns Array de strings con las instrucciones formateadas
 */
export const getInstructions = (descriptions: Description[]): string[] => {
  const text = descriptions?.find(
    (description) => description.descriptionTypeId === 4,
  )?.text;

  return text
    ? text
        .split(/\d+-\s*/)
        .filter(Boolean)
        .map((segment) => segment.trim())
    : [];
};
