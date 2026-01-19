import type { FC } from "react";
import { getBullets } from "@/modules/products/shared/lib/get-descriptions";
import type { Description } from "@/modules/shared/types/product-types";
import { ListedDescription } from "./listed-description";

export interface BulletsProps {
  descriptions: Description[];
}

/**
 * Server Component: Puntos destacados del producto
 * - Extrae bullets desde descriptions (type_id: 5)
 * - Renderiza como lista con viñetas
 * - No se renderiza si no hay bullets
 */
export const Bullets: FC<BulletsProps> = ({ descriptions }) => {
  const bullets = getBullets(descriptions);

  if (bullets.length === 0) {
    return null;
  }

  return <ListedDescription type="bullets" description={bullets} />;
};
