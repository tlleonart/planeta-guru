import { notFound } from "next/navigation";
import { api } from "@/app/server/server";
import { GameHTMLPage } from "@/modules/products/game-html/game-html-page";

interface GameHTMLPageRouteProps {
  params: Promise<{
    locale: string;
    slug: string;
  }>;
}

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
    // Fetch producto usando tRPC
    const product = await api.product.getBySlug({ slug });

    // TODO: Fetch wallet amount si el usuario está autenticado
    // const wallet = await api.wallet.get();
    const walletAmount = 0;

    return <GameHTMLPage product={product} walletAmount={walletAmount} />;
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
    const product = await api.product.getBySlug({ slug });

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
