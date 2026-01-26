import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { cache } from "react";
import { api } from "@/app/server/server";
import { GameWebGLPage } from "@/modules/products/game-webgl/game-webgl-page";

export interface GamesViewPageRouteProps {
  params: Promise<{
    slug: string;
  }>;
}

// Cache the product fetch to avoid duplicate calls between page and metadata
const getProduct = cache(async (slug: string) => {
  return api.product.getBySlug({ slug });
});

/**
 * Route Page: Games View (WebGL) [slug]
 * - Fetches product data server-side usando tRPC
 * - Extrae URL del juego WebGL desde media (media_type_id: 9)
 * - Genera metadata para SEO
 * - Delega renderizado a GameWebGLPage (módulo)
 */
export default async function GamesViewPageRoute({
  params,
}: GamesViewPageRouteProps) {
  const { slug } = await params;

  try {
    const product = await getProduct(slug);

    // El juego WebGL está en media con media_type_id === 9
    const webglMedia = product.media?.find((media) => media.mediaTypeId === 9);

    if (!webglMedia?.url) {
      console.error(
        `[GAMES_VIEW_PAGE] No WebGL media found for product ${slug}`,
      );
      notFound();
    }

    return <GameWebGLPage url={webglMedia.url} title={product.name} />;
  } catch (error) {
    console.error(`[GAMES_VIEW_PAGE] Error fetching product ${slug}:`, error);
    notFound();
  }
}

export async function generateMetadata({
  params,
}: GamesViewPageRouteProps): Promise<Metadata> {
  const { slug } = await params;

  try {
    const product = await getProduct(slug);

    return {
      title: `${product.name} | Planeta Guru`,
      description:
        product.descriptions?.find((d) => d.descriptionTypeId === 1)?.text ||
        `Juega ${product.name} en Planeta Guru`,
    };
  } catch (_error) {
    return {
      title: "Producto no encontrado | Planeta Guru",
    };
  }
}
