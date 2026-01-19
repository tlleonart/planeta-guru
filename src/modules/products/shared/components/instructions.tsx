import type { FC } from "react";
import { getInstructions } from "@/modules/products/shared/lib/get-descriptions";
import type { Description } from "@/modules/shared/types/product-types";
import { ListedDescription } from "./listed-description";

export interface InstructionsProps {
  descriptions: Description[];
}

/**
 * Server Component: Instrucciones de canje/activación
 * - Extrae instructions desde descriptions (type_id: 4)
 * - Renderiza como lista numerada
 * - No se renderiza si no hay instrucciones
 */
export const Instructions: FC<InstructionsProps> = ({ descriptions }) => {
  const instructions = getInstructions(descriptions);

  if (instructions.length === 0) {
    return null;
  }

  return (
    <ListedDescription
      type="instructions"
      description={instructions}
      size="large"
    />
  );
};
