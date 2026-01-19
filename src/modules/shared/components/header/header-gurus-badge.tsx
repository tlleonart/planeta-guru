"use client";

import Image from "next/image";
import type { FC } from "react";
import { Link } from "@/i18n/navigation";
import { trpc } from "@/modules/shared/lib/trpc/client";
import { cn } from "@/modules/shared/lib/utils";
import guruCoinIcon from "@/public/guru-coin.svg";

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

const HeaderGurusBadgeSkeleton: FC = () => (
  <output
    className="w-20 h-8 rounded-md bg-purple-900/50 animate-pulse block"
    aria-label="Cargando balance..."
  />
);

export const HeaderGurusBadge: FC = () => {
  const {
    data: wallet,
    isLoading,
    isError,
  } = trpc.wallet.getWallet.useQuery(undefined, {
    retry: 1,
    retryDelay: 1000,
  });

  if (isLoading) {
    return <HeaderGurusBadgeSkeleton />;
  }

  const formattedBalance =
    wallet && !isError ? formatBalance(wallet.amount) : "0";

  return (
    <Link
      href="/profile"
      className={cn(
        "flex items-center gap-1.5 px-3 h-8 rounded-md",
        "bg-purple-600 hover:bg-purple-700 transition-colors",
        "text-white font-semibold text-sm",
      )}
      aria-label={`Ver perfil. Balance actual: ${formattedBalance} Guru Coins`}
    >
      <Image
        src={guruCoinIcon}
        alt=""
        width={18}
        height={18}
        className="w-[18px] h-[18px]"
      />
      <span>{formattedBalance}</span>
    </Link>
  );
};
