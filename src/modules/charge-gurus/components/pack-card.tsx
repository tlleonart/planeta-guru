import Image from "next/image";
import type { FC } from "react";
import { Link } from "@/i18n/navigation";
import guruCoin from "@/public/guru-coin.svg";

interface PackCardProps {
  id: number;
  value: string;
  price: number;
  transactionCost: number;
  totalPrice: number;
  origin?: string;
}

/**
 * Server Component: Card de pack de gurús
 * - Muestra cantidad de gurús con icono
 * - Link a página de pago con todos los parámetros en URL
 * - Estilos con hover y transición
 * - Formato de valor parseado a número entero
 */
export const PackCard: FC<PackCardProps> = ({
  id,
  value,
  price,
  transactionCost,
  totalPrice,
  origin,
}) => {
  const parsedValue = parseFloat(value).toFixed(0);
  // Bug #7: Go directly to payment summary modal with CARD method (skip payment method selection)
  const baseUrl = `/charge-gurus/payments/${parsedValue}/${id}/${price}/${transactionCost}/${totalPrice}/CARD`;
  const href = origin
    ? `${baseUrl}?payment-modal=true&origin=${encodeURIComponent(origin)}`
    : `${baseUrl}?payment-modal=true`;

  return (
    <Link href={href}>
      <div className="bg-white/20 w-32 md:w-60 min-h-28 flex flex-col relative justify-center items-center p-4 cursor-pointer hover:bg-white/10 transition-all duration-300 gap-2">
        <Image src={guruCoin} alt="Guru Coin" height={30} width={30} />
        <h1 className="text-2xl md:text-3xl font-bold">{parsedValue}</h1>
        <span className="text-sm opacity-80">GURUs</span>
      </div>
    </Link>
  );
};
