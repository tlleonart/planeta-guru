import type { RequestContext } from "@/modules/http";
import { BaseService } from "@/modules/http/base-service";
import { mapLegalsUrlResponse } from "../mappers/legals-mapper";
import type {
  GetLegalsUrlApiResponse,
  LegalsUrls,
} from "../types/legals-types";

class LegalsService extends BaseService {
  private readonly basePath = "/landings/product-provider";

  async getLegalsUrls(context: RequestContext): Promise<LegalsUrls> {
    const response = await this.http.get<GetLegalsUrlApiResponse>(
      `${this.basePath}/selected-country`,
      { context },
    );

    return mapLegalsUrlResponse(response.data);
  }

  async getTermsUrl(context: RequestContext): Promise<string | null> {
    const urls = await this.getLegalsUrls(context);
    return urls.termsUrl;
  }

  async getPrivacyUrl(context: RequestContext): Promise<string | null> {
    const urls = await this.getLegalsUrls(context);
    return urls.privacyUrl;
  }
}

export const legalsService = new LegalsService();
