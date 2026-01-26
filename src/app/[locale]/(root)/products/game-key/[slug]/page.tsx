import { auth } from "@clerk/nextjs/server";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { cache } from "react";
import { api } from "@/app/server/server";
import { GameKeyPage } from "@/modules/products/game-key/game-key-page";

export interface GameKeyPageRouteProps {
  params: Promise<{
    slug: string;
  }>;
}

// Cache the product fetch to avoid duplicate calls between page and metadata
const getProduct = cache(async (slug: string) => {
  return api.product.getBySlug({ slug });
});

/**
 * Route Page: Game Key [slug]
 * - Fetches product data server-side usando tRPC
 * - Genera metadata para SEO
 * - Delega renderizado a GameKeyPage (módulo)
 */
export default async function GameKeyPageRoute({
  params,
}: GameKeyPageRouteProps) {
  const { slug } = await params;

  try {
    // Fetch auth and product in parallel for better performance
    const [{ userId }, product] = await Promise.all([auth(), getProduct(slug)]);

    // Fetch wallet if user is authenticated
    let walletAmount = 0;
    let walletId = 0;
    if (userId) {
      try {
        const wallet = await api.wallet.getWallet();
        walletAmount = wallet.amount;
        walletId = wallet.id;
      } catch {
        // User might not have a wallet yet - ignore error
      }
    }

    return (
      <GameKeyPage
        product={product}
        walletAmount={walletAmount}
        walletId={walletId}
      />
    );
  } catch (error) {
    console.error(`[GAME_KEY_PAGE] Error fetching product ${slug}:`, error);
    notFound();
  }
}

export async function generateMetadata({
  params,
}: GameKeyPageRouteProps): Promise<Metadata> {
  const { slug } = await params;

  try {
    const product = await getProduct(slug);

    return {
      title: `${product.name} | Planeta Guru`,
      description:
        product.descriptions?.find((d) => d.descriptionTypeId === 1)?.text ||
        `Compra ${product.name} en Planeta Guru`,
    };
  } catch (_error) {
    return {
      title: "Producto no encontrado | Planeta Guru",
    };
  }
}
