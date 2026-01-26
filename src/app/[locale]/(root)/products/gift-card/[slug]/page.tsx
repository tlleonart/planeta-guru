import { auth } from "@clerk/nextjs/server";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { cache } from "react";
import { api } from "@/app/server/server";
import { GiftCardPage } from "@/modules/products/gift-card/gift-card-page";

export interface GiftCardPageRouteProps {
  params: Promise<{
    slug: string;
  }>;
}

// Cache the product fetch to avoid duplicate calls between page and metadata
const getProduct = cache(async (slug: string) => {
  return api.product.getBySlug({ slug });
});

/**
 * Route Page: Gift Card [slug]
 * - Fetches product data server-side usando tRPC
 * - Genera metadata para SEO
 * - Delega renderizado a GiftCardPage (módulo)
 */
export default async function GiftCardPageRoute({
  params,
}: GiftCardPageRouteProps) {
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
      <GiftCardPage
        product={product}
        walletAmount={walletAmount}
        walletId={walletId}
      />
    );
  } catch (error) {
    console.error(`[GIFT_CARD_PAGE] Error fetching product ${slug}:`, error);
    notFound();
  }
}

export async function generateMetadata({
  params,
}: GiftCardPageRouteProps): Promise<Metadata> {
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
