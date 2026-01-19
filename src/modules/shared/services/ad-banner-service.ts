import type { RequestContext } from "@/modules/http";
import { BaseService } from "@/modules/http/base-service";
import { mapAdBannerResponse } from "../mappers/ad-banner-mapper";
import type { Ad, AdApiResponse } from "../types/ad-types";

class AdBannerService extends BaseService {
  private readonly basePath = "/products";

  async getAdBanner(context: RequestContext): Promise<Ad> {
    const response = await this.http.get<AdApiResponse>(
      `${this.basePath}/featured-products?section_id=2`,
      { context },
    );

    return mapAdBannerResponse(response.data);
  }
}

export const adBannerService = new AdBannerService();
