import type { FC } from "react";
import { Badge } from "@/modules/shared/components/ui/badge";
import type { Spec } from "@/modules/shared/types/product-types";
import { getSystem } from "../lib/get-specs";
import { ProductIcon } from "./product-icon";

export interface ProductHeaderProps {
  type: string;
  typeId: number;
  storeId: number;
  specs: Spec[];
  region: string;
}

/**
 * Server Component: Header del producto con badges
 * - Badge de tipo de producto
 * - Badge de región
 * - Badge(s) de sistema/store:
 *   - Si es Game Key (typeId: 2): muestra badges de sistemas compatibles
 *   - Para otros tipos: muestra badge único de store
 */
export const ProductHeader: FC<ProductHeaderProps> = ({
  type,
  typeId,
  storeId,
  specs,
  region,
}) => {
  const className =
    "flex text-xs md:text-base md:gap-2 py-1 md:py-2 my-0 md:my-2 md:px-4";
  const systems = getSystem(specs);

  return (
    <div className="flex flex-row gap-2">
      <Badge className={className}>{type}</Badge>
      <Badge className={className}>{region}</Badge>
      {typeId === 2 ? (
        // Game Key - mostrar badges de sistemas
        systems.map((system) => (
          <Badge key={system.id} className={`${className} md:px-3`}>
            <ProductIcon
              typeId={typeId}
              storeId={storeId}
              system={system.specValue?.name}
            />
          </Badge>
        ))
      ) : (
        // Otros tipos - badge único de store
        <Badge className={`${className} md:px-3`}>
          <ProductIcon typeId={typeId} storeId={storeId} />
        </Badge>
      )}
    </div>
  );
};
