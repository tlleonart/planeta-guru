"use client";

import { useUser } from "@clerk/nextjs";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { type FC, useState } from "react";
import { useModalStore } from "@/modules/shared/providers/modal-store-provider";
import guruCoin from "@/public/guru-coin.svg";

interface PackCardProps {
  id: number;
  value: string;
  origin?: string;
}

/**
 * Client Component: Card de pack de gurús
 * - Muestra cantidad de gurús con icono
 * - Al hacer clic, llama a la API de pago y redirige a MercadoPago
 * - Muestra estado de carga durante el proceso
 */
export const PackCard: FC<PackCardProps> = ({ id, value, origin }) => {
  const [loading, setLoading] = useState(false);
  const parsedValue = parseFloat(value).toFixed(0);
  const openModal = useModalStore((state) => state.openModal);
  const t = useTranslations("ErrorModal");
  const { isSignedIn } = useUser();

  const handleClick = async () => {
    // Check authentication first
    if (!isSignedIn) {
      openModal("Authenticate", { returnUrl: window.location.pathname });
      return;
    }

    setLoading(true);

    try {
      const customSuccessUrl = origin
        ? `${window.location.origin}${origin}`
        : undefined;

      const payload = {
        guru_pack_id: id,
        payment_method: "CARD",
        custom_success_url: customSuccessUrl ?? null,
        user_ip_address: null,
      };

      const response = await fetch("/api/payment", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Payment failed");
      }

      const data = await response.json();

      // Redirect directly to MercadoPago
      const link = data.id?.purchase_link || data.link;
      if (link) {
        window.location.href = link;
      } else {
        throw new Error("No payment link received");
      }
    } catch (error) {
      console.error("Error processing payment:", error);
      setLoading(false);
      openModal("Error", {
        message: t("defaultMessage"),
      });
    }
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={loading}
      data-testid="pack-card"
      className="w-full"
    >
      <div className="bg-white/20 w-full min-h-28 md:min-h-32 flex flex-col relative justify-center items-center p-4 cursor-pointer hover:bg-white/10 transition-all duration-300 gap-2 disabled:opacity-50 disabled:cursor-progress">
        {loading ? (
          <>
            <div className="w-8 h-8 border-2 border-white border-t-transparent rounded-full animate-spin" />
            <span className="text-sm opacity-80">Procesando...</span>
          </>
        ) : (
          <>
            <Image src={guruCoin} alt="Guru Coin" height={30} width={30} />
            <h1 className="text-2xl md:text-3xl font-bold">{parsedValue}</h1>
            <span className="text-sm opacity-80">GURUs</span>
          </>
        )}
      </div>
    </button>
  );
};
