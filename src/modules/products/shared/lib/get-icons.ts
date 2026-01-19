import type { StaticImageData } from "next/image";
import AppleIcon from "@/modules/products/shared/assets/apple-logo.svg";
import BlizzardIcon from "@/modules/products/shared/assets/blizzard-logo.svg";
import GarenaIcon from "@/modules/products/shared/assets/garena-logo.svg";
import GooglePlayIcon from "@/modules/products/shared/assets/google-play-logo.svg";
import MinecraftIcon from "@/modules/products/shared/assets/minecraft-logo.svg";
import NintendoSwitchIcon from "@/modules/products/shared/assets/nintendo-switch-logo.svg";
import PGIcon from "@/modules/products/shared/assets/pg-logo.png";
import RobloxIcon from "@/modules/products/shared/assets/roblox-logo.svg";
import SteamIcon from "@/modules/products/shared/assets/steam-logo.svg";
import WindowsIcon from "@/modules/products/shared/assets/windows-logo.svg";
import XboxIcon from "@/modules/products/shared/assets/xbox-logo.svg";

/**
 * Obtiene el ícono correspondiente a una store según su ID
 * @param storeId - ID de la store
 * @returns Ícono SVG/PNG de la store
 */
export const getStoreIcon = (storeId: number): StaticImageData => {
  if (storeId === 3 || storeId === 5) return NintendoSwitchIcon;
  if (storeId === 4) return XboxIcon;
  if (storeId === 2) return BlizzardIcon;
  if (storeId === 10) return GarenaIcon;
  if (storeId === 9) return GooglePlayIcon;
  if (storeId === 8) return MinecraftIcon;
  if (storeId === 6) return RobloxIcon;
  if (storeId === 7) return SteamIcon;
  return PGIcon;
};

/**
 * Obtiene el ícono correspondiente a un sistema operativo
 * @param system - Nombre del sistema operativo
 * @returns Ícono SVG del sistema o undefined si no se reconoce
 */
export const getSystemIcon = (system: string): StaticImageData | undefined => {
  const lowerSystem = system.toLowerCase();

  if (lowerSystem.includes("windows")) return WindowsIcon;
  if (
    lowerSystem.includes("mac") ||
    lowerSystem.includes("apple") ||
    lowerSystem.includes("osx")
  )
    return AppleIcon;

  return undefined;
};
