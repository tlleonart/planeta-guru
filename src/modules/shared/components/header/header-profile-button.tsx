/** biome-ignore-all lint/a11y/useSemanticElements: Custom dropdown trigger requires div wrapper */

import Image from "next/image";
import { type FC, Suspense } from "react";
import { api } from "@/app/server/server";
import { Link } from "@/i18n/navigation";
import guruCoinIcon from "@/public/guru-coin.svg";
import { cn } from "../../lib/utils";
import { Button } from "../ui/button";

const HeaderProfileButtonSkeleton: FC = () => (
  <div
    className="w-16 h-8 sm:h-9 md:h-10 rounded bg-gray-700/50 animate-pulse"
    aria-label="Cargando balance..."
    role="status"
  />
);

function formatBalance(amount: number): string {
  if (amount >= 10000) {
    return new Intl.NumberFormat("es", {
      notation: "compact",
      maximumFractionDigits: 1,
    }).format(amount);
  }

  return new Intl.NumberFormat("es", {
    maximumFractionDigits: 0,
  }).format(amount);
}

async function HeaderProfileButtonContent() {
  try {
    const wallet = await api.wallet.getWallet();

    const formattedBalance = formatBalance(wallet.amount);
    const hasBalance = wallet.amount > 0;

    return (
      <Button
        asChild
        variant="default"
        className={cn(
          "flex items-center gap-1.5 rounded-none",
          "h-8 sm:h-9 md:h-10",
          "px-3 sm:px-3 md:px-4",
          "text-xs sm:text-sm md:text-base",
          "bg-primary text-primary-foreground",
          "shadow-xs hover:bg-primary/90 transition-colors",
          !hasBalance && "opacity-75",
        )}
      >
        <Link
          href="/profile"
          aria-label={`Ver perfil. Balance actual: ${formattedBalance} Guru Coins`}
        >
          <Image
            src={guruCoinIcon}
            alt=""
            width={20}
            height={20}
            className="w-4 h-4 sm:w-5 sm:h-5"
          />
          <span className="font-semibold">{formattedBalance}</span>
        </Link>
      </Button>
    );
  } catch (error) {
    console.error("Error al cargar el balance", error);
    return <div>Error al cargar el balance</div>;
  }
}

export const HeaderProfileButton: FC = () => {
  return (
    <Suspense fallback={<HeaderProfileButtonSkeleton />}>
      <HeaderProfileButtonContent />
    </Suspense>
  );
};
