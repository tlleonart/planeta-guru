import type { Ad, AdApiModel, AdApiResponse } from "../types/ad-types";
import { mapDescription, mapMedia } from "./product-mapper";

export function adBannerMapper(api: AdApiModel): Ad {
  return {
    id: api.id,
    productId: api.product_id,
    sectionId: api.section_id,
    position: api.position,
    descriptions: api.descriptions?.map(mapDescription),
    media: api.media?.map(mapMedia),
  };
}

export function mapAdBannerResponse(response: AdApiResponse): Ad {
  return adBannerMapper(response.featured_products[0]);
}
