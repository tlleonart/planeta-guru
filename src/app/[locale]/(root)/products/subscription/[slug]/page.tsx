import { auth } from "@clerk/nextjs/server";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { cache } from "react";
import { api } from "@/app/server/server";
import { SubscriptionPage } from "@/modules/products/subscription/subscription-page";

export interface SubscriptionPageRouteProps {
  params: Promise<{
    slug: string;
  }>;
}

// Cache the product fetch to avoid duplicate calls between page and metadata
const getProduct = cache(async (slug: string) => {
  return api.product.getBySlug({ slug });
});

/**
 * Ruta de Subscription
 * - Fetch de producto desde API
 * - Renderiza SubscriptionPage
 */
export default async function SubscriptionPageRoute({
  params,
}: SubscriptionPageRouteProps) {
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
      <SubscriptionPage
        product={product}
        walletAmount={walletAmount}
        walletId={walletId}
      />
    );
  } catch (error) {
    console.error(`[SUBSCRIPTION_PAGE] Error fetching product ${slug}:`, error);
    notFound();
  }
}

/**
 * Metadata dinámica
 * - Título: nombre del producto
 * - Descripción: descripción corta del producto
 */
export async function generateMetadata({
  params,
}: SubscriptionPageRouteProps): Promise<Metadata> {
  const { slug } = await params;

  try {
    const product = await getProduct(slug);

    return {
      title: `${product.name} | Planeta Guru`,
      description:
        product.descriptions?.find((d) => d.descriptionTypeId === 1)?.text ||
        "",
    };
  } catch (_error) {
    return {
      title: "Producto no encontrado | Planeta Guru",
    };
  }
}
