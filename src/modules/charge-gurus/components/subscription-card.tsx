"use client";

import { Star } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import type { FC } from "react";
import guruPlus from "@/public/guru-plus.svg";

/**
 * Client Component: Card de suscripción
 * - Muestra opción de suscripción con icono de estrella
 * - Redirige a portal externo para México (pgj_mx_url)
 * - Redirige a home para otros países
 * - Usa cookies para detectar país seleccionado
 * - Client Component por uso de router y navegación
 */
export const SubscriptionCard: FC = () => {
  const t = useTranslations("SubscriptionCard");
  const router = useRouter();
  const pgj_mx_url =
    "https://portal.shop/index.php/Hero-sub.html?utm_campaign=0-pid=pgj_portal-adn=pgj_mx";

  const handleRegister = () => {
    if (typeof window !== "undefined") {
      // Check country from cookies to redirect appropriately
      const cookies = document.cookie;
      const countryMatch = cookies.match(/selectedCountry=([^;]+)/);
      const countryCode = countryMatch ? countryMatch[1] : null;

      if (countryCode === "MX" || countryCode === "mx") {
        window.location.replace(pgj_mx_url);
      } else {
        router.push("/");
      }
    }
  };

  return (
    <button
      className="bg-white/20 w-full min-h-28 md:min-h-32 flex flex-col relative justify-center items-center p-4 cursor-pointer hover:bg-white/10 transition-all duration-300"
      onClick={handleRegister}
      type="button"
      data-testid="subscription-card"
    >
      <div className="absolute top-4 right-4">
        <Star fill="yellow" size={15} className="text-amber-300" />
      </div>
      <Image src={guruPlus} alt="Guru Plus" height={30} width={30} />
      <h1 className="text-base md:text-lg font-medium mt-2">
        {t("subscription")}
      </h1>
    </button>
  );
};
