import Image from "next/image";
import type { FC } from "react";
import { getStoreIcon, getSystemIcon } from "../lib/get-icons";

export interface ProductIconProps {
  typeId: number;
  storeId: number;
  system?: string;
}

/**
 * Server Component: Ícono de store o sistema del producto
 * - Si es Game Key (typeId: 2), muestra ícono de sistema (Windows/Mac)
 * - Para otros tipos, muestra ícono de la store
 * - Usa Next/Image para optimización automática
 */
export const ProductIcon: FC<ProductIconProps> = ({
  typeId,
  storeId,
  system,
}) => {
  // Game Key - mostrar ícono de sistema si está disponible
  if (typeId === 2 && system) {
    const systemIcon = getSystemIcon(system);
    if (systemIcon) {
      return (
        <Image
          src={systemIcon}
          alt={system}
          className="w-4 h-4 md:w-5 md:h-5"
        />
      );
    }
  }

  // Para otros tipos o si no hay sistema, mostrar ícono de store
  const storeIcon = getStoreIcon(storeId);

  return (
    <Image src={storeIcon} alt="Store icon" className="w-4 h-4 md:w-5 md:h-5" />
  );
};
