import { BaseService } from "@/modules/http/base-service";
import { PaginationParams } from "../types/api-types";
import { RequestContext } from "@/modules/http";
import { GetSubscriptionApiResponse, Subscription } from "../types/user-types";

class UserService extends BaseService {
    async getSubscription(
        params: PaginationParams = {},
        context: RequestContext
    ): Promise<Subscription> {
        const response = await this.http.get<GetSubscriptionApiResponse>(
            "/ph/subscriptions/pg-status",
            {
                params: {
                    ...this.buildQueryParams(params)
                },
                context
            }
        )

        return {
            status: response.data.subscription_data.status,
            externalUserAccount: response.data.subscription_data.externalUserAccount,
            serviceName: response.data.subscription_data.serviceName,
            providerName: response.data.subscription_data.providerName,
            operatorName: response.data.subscription_data.operatorName,
            valid: response.data.subscription_data.valid,
        }
    }
}

export const userService = new UserService();
