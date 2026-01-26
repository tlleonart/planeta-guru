import { auth } from "@clerk/nextjs/server";
import { notFound } from "next/navigation";
import { cache } from "react";
import { api } from "@/app/server/server";
import { GameHTMLPage } from "@/modules/products/game-html/game-html-page";

interface GameHTMLPageRouteProps {
  params: Promise<{
    locale: string;
    slug: string;
  }>;
}

// Cache the product fetch to avoid duplicate calls between page and metadata
const getProduct = cache(async (slug: string) => {
  return api.product.getBySlug({ slug });
});

/**
 * Página de producto Game HTML
 * - Server Component que fetches data
 * - Usa tRPC para obtener producto por slug
 * - Maneja 404 si no existe
 */
export default async function GameHTMLPageRoute({
  params,
}: GameHTMLPageRouteProps) {
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
      <GameHTMLPage
        product={product}
        walletAmount={walletAmount}
        walletId={walletId}
      />
    );
  } catch (error) {
    console.error(`[GAME_HTML_PAGE] Error fetching product ${slug}:`, error);
    notFound();
  }
}

/**
 * Metadata dinámica para SEO
 */
export async function generateMetadata({ params }: GameHTMLPageRouteProps) {
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
