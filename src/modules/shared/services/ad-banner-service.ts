import { RequestContext } from "@/modules/http";
import { BaseService } from "@/modules/http/base-service";
import { Ad, AdApiResponse } from "../types/ad-types";
import { mapAdBannerResponse } from "../mappers/ad-banner-mapper";

class AdBannerService extends BaseService {
    private readonly basePath = "/products"

    async getAdBanner(context: RequestContext): Promise<Ad> {
        const response = await this.http.get<AdApiResponse>(
            `${this.basePath}/featured-products?section_id=2`,
            { context }
        )

        return mapAdBannerResponse(response.data)
    }
}

export const adBannerService = new AdBannerService()