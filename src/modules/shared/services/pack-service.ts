import { BaseService } from "@/modules/http/base-service";
import { GetPacksParams, GetPacksResponse } from "../types/pack-types";
import { RequestContext } from "@/modules/http";
import { mapPack } from "../mappers/pack-mapper";

class PackService extends BaseService {
    private readonly basePath = '/games-management'

    async getPacks(params: GetPacksParams, context: RequestContext) {
        const response = await this.http.get<GetPacksResponse>(
            `${this.basePath}/guru-packs`,
            {
                params: {
                    ...this.buildQueryParams(params),
                },
                context
            }
        )

        return {
            items: response.data.guru_packs.map(mapPack),
            pagination: this.mapPagination(response.data.pagination)
        }
    }
}

export const packService = new PackService()
