import type { Spec } from "@/modules/shared/types/product-types";

/**
 * Extrae el desarrollador de las specs del producto
 * Busca specs con type_id 1 (información general) y spec_id 1 (developer)
 */
export const getDeveloper = (specs: Spec[]): string => {
  const developerSpec = specs.find(
    (spec) => spec.specTypeId === 1 && spec.specId === 1,
  );

  return developerSpec?.specValue?.name || "-";
};

/**
 * Obtiene el nombre del editor desde los specs
 * Busca spec con spec_id 20 (editor)
 */
export const getEditor = (specs: Spec[]): string => {
  const editorSpec = specs.find((spec) => spec.specId === 20);
  return editorSpec?.specValue?.name || "-";
};

/**
 * Obtiene la fecha de lanzamiento desde los specs
 * Busca spec con spec_id 21 (release date)
 */
export const getReleaseDate = (specs: Spec[]): string => {
  const releaseDateSpec = specs.find((spec) => spec.specId === 21);
  return releaseDateSpec?.specValue?.name || "-";
};

/**
 * Obtiene la clasificación del juego desde los specs
 * Busca spec con spec_id 35 (classification/rating)
 */
export const getClassification = (specs: Spec[]): string => {
  const classificationSpec = specs.find((spec) => spec.specId === 35);
  return classificationSpec?.specValue?.name || "-";
};

/**
 * Extrae idiomas disponibles de las specs
 * Busca specs con type_id 4 (language) y spec_id 16 (available languages)
 */
export const getLanguages = (specs: Spec[]): string[] => {
  const languageSpecs = specs.filter(
    (spec) => spec.spec?.id === 16 && spec.spec?.specTypeId === 4,
  );

  return languageSpecs
    .map((spec) => spec.specValue?.name)
    .filter((name): name is string => !!name);
};

/**
 * Obtiene los requisitos del sistema (mínimos o recomendados)
 * @param specs - Array de specs del producto
 * @param id - 1 para requisitos recomendados, 2 para mínimos
 * @returns Array de strings con formato HTML para mostrar requisitos
 */
export const getRequirements = (specs: Spec[], id: number): string[] => {
  return (
    specs
      ?.filter((spec) => spec.spec?.specTypeId === id)
      .map(
        (spec) =>
          `<span class='opacity-60'>${spec.spec?.specLanguages[0]?.name}</span>: ${spec.specValue?.name}`,
      ) || []
  );
};

/**
 * Obtiene el sistema operativo compatible del producto
 * Filtra por prioridad: primero Windows/Mac, luego otros sistemas
 * @returns Array con máximo 2 specs de sistema
 */
export const getSystem = (specs: Spec[]): Spec[] => {
  let filtered = specs.filter(
    (spec) =>
      spec.spec &&
      [1, 6, 2, 7].includes(spec.spec.specTypeId) &&
      [5, 29, 12, 34].includes(spec.spec.id),
  );

  // Si existe un spec con specTypeId 1 o 6, filtrar solo esos
  if (
    filtered.some((spec) => spec.spec && [1, 6].includes(spec.spec.specTypeId))
  ) {
    filtered = filtered.filter(
      (spec) => spec.spec && [1, 6].includes(spec.spec.specTypeId),
    );
  }

  // Si existe un spec con id 5 o 29, filtrar solo esos
  if (filtered.some((spec) => spec.spec && [5, 29].includes(spec.spec.id))) {
    filtered = filtered.filter(
      (spec) => spec.spec && [5, 29].includes(spec.spec.id),
    );
  }

  return filtered.slice(0, 2);
};
