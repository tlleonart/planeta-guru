"use server";

import { revalidatePath } from "next/cache";
import { api } from "@/app/server/server";

/**
 * Server action para agregar un producto a favoritos
 * Usa tRPC para comunicación type-safe con el backend
 */
export async function addFavoriteAction(productId: number) {
  try {
    const favorite = await api.product.addFavorite({ productId });

    // Revalidar rutas que dependen de favoritos
    revalidatePath("/[locale]/(root)/profile/favorites", "page");
    revalidatePath("/[locale]/(root)", "layout");

    return {
      success: true,
      data: favorite,
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to add favorite",
    };
  }
}

/**
 * Server action para remover un producto de favoritos
 * Usa tRPC para comunicación type-safe con el backend
 */
export async function removeFavoriteAction(favoriteId: number) {
  try {
    await api.product.removeFavorite({ favoriteId });

    // Revalidar rutas que dependen de favoritos
    revalidatePath("/[locale]/(root)/profile/favorites", "page");
    revalidatePath("/[locale]/(root)", "layout");

    return {
      success: true,
    };
  } catch (error) {
    return {
      success: false,
      error:
        error instanceof Error ? error.message : "Failed to remove favorite",
    };
  }
}
