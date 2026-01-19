"use client";

import { useUser } from "@clerk/nextjs";
import Image from "next/image";
import { type FC, useState, useTransition } from "react";
import { ImSpinner9 } from "react-icons/im";
import {
  addFavoriteAction,
  removeFavoriteAction,
} from "@/modules/products/shared/actions/favorite-actions";
import FavoriteIcon from "@/modules/shared/assets/favorite.svg";
import FavoriteSelectedIcon from "@/modules/shared/assets/favorite-selected.svg";

export interface FavoriteButtonProps {
  productId: number;
  initialFavoriteId?: number;
  initialIsFavorite?: boolean;
  size?: "small" | "default";
}

/**
 * Client Component: Botón de favoritos optimizado con React 19
 * - useTransition para transiciones optimistas
 * - Estado local mínimo
 * - Solo se renderiza si el usuario está autenticado
 */
export const FavoriteButton: FC<FavoriteButtonProps> = ({
  productId,
  initialFavoriteId,
  initialIsFavorite = false,
  size = "default",
}) => {
  const { isSignedIn, isLoaded } = useUser();
  const [isPending, startTransition] = useTransition();
  const [isFavorite, setIsFavorite] = useState(initialIsFavorite);
  const [favoriteId, setFavoriteId] = useState<number | undefined>(
    initialFavoriteId,
  );

  // Definir clases de icono antes del early return para mantener consistencia
  const iconClasses =
    size === "small"
      ? "mx-auto md:mx-2 h-3 md:h-4 w-3 md:w-4"
      : "mx-auto md:mx-1 h-3.5 md:h-5 w-3.5 md:w-5";

  // No renderizar si el usuario no está autenticado
  // Usar isLoaded para evitar hydration mismatch - renderizar placeholder mientras carga
  if (!isLoaded) {
    return (
      <div className="flex items-center">
        <div className={iconClasses} />
      </div>
    );
  }

  if (!isSignedIn) {
    return null;
  }

  const handleToggleFavorite = () => {
    startTransition(async () => {
      try {
        if (isFavorite && favoriteId) {
          // Optimistic update: quitar de favoritos
          setIsFavorite(false);
          const result = await removeFavoriteAction(favoriteId);

          if (!result.success) {
            // Revertir si falla
            setIsFavorite(true);
            console.error("Failed to remove favorite:", result.error);
          }
        } else {
          // Optimistic update: agregar a favoritos
          setIsFavorite(true);
          const result = await addFavoriteAction(productId);

          if (result.success && result.data) {
            setFavoriteId(result.data.id);
          } else {
            // Revertir si falla
            setIsFavorite(false);
            console.error("Failed to add favorite:", result.error);
          }
        }
      } catch (error) {
        // Revertir en caso de error
        setIsFavorite(!isFavorite);
        console.error("Unexpected error:", error);
      }
    });
  };

  return (
    <div className="flex items-center">
      <button
        className="cursor-pointer"
        type="button"
        onClick={handleToggleFavorite}
        disabled={isPending}
        aria-label={isFavorite ? "Remove from favorites" : "Add to favorites"}
      >
        {isPending ? (
          <ImSpinner9 className={`${iconClasses} animate-spin`} />
        ) : isFavorite ? (
          <Image
            src={FavoriteSelectedIcon}
            alt="Favorite selected"
            className={iconClasses}
          />
        ) : (
          <Image src={FavoriteIcon} alt="Favorite" className={iconClasses} />
        )}
      </button>
    </div>
  );
};
