import type { RequestContext } from "@/modules/http";
import { BaseService } from "@/modules/http/base-service";
import { mapPack } from "../mappers/pack-mapper";
import type {
  GetPacksParams,
  GetPacksResponse,
  Pack,
} from "../types/pack-types";

class PackService extends BaseService {
  private readonly basePath = "/games-management";

  async getPacks(params: GetPacksParams, context: RequestContext) {
    const response = await this.http.get<GetPacksResponse>(
      `${this.basePath}/guru-packs`,
      {
        params: {
          ...this.buildQueryParams(params),
        },
        context,
      },
    );

    // Filter out packs without pricing data for the current country
    const items = response.data.guru_packs
      .map(mapPack)
      .filter((pack): pack is Pack => pack !== null);

    return {
      items,
      pagination: this.mapPagination(response.data.pagination),
    };
  }
}

export const packService = new PackService();
