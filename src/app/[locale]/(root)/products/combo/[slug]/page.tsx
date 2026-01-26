import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { cache } from "react";
import { api } from "@/app/server/server";
import { ComboPage } from "@/modules/products/combo/combo-page";

export interface ComboRouteProps {
  params: Promise<{
    slug: string;
  }>;
}

// Cache the product fetch to avoid duplicate calls between page and metadata
const getProduct = cache(async (slug: string) => {
  return api.product.getBySlug({ slug });
});

/**
 * Route Page: Combo [slug]
 * - Fetches product data server-side usando tRPC
 * - Genera metadata para SEO
 * - Delega renderizado a ComboPage (modulo)
 */
export default async function ComboRoute({ params }: ComboRouteProps) {
  const { slug } = await params;

  try {
    const product = await getProduct(slug);

    return <ComboPage product={product} />;
  } catch (error) {
    console.error(`[COMBO_PAGE] Error fetching product ${slug}:`, error);
    notFound();
  }
}

export async function generateMetadata({
  params,
}: ComboRouteProps): Promise<Metadata> {
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
