import { BaseService } from "@/modules/http/base-service";
import type { RequestContext } from "@/modules/http/types";
import type {
  GetSubscriptionResponse,
  Subscription,
  SubscriptionApiModel,
} from "../types/subscription-types";

/**
 * Servicio para gestión de suscripciones telco
 */
class SubscriptionService extends BaseService {
  /**
   * Mapper de SubscriptionApiModel a Subscription
   */
  private mapSubscription(apiModel: SubscriptionApiModel): Subscription {
    return {
      status: apiModel.status,
      externalUserAccount: apiModel.external_user_account,
      serviceName: apiModel.service_name,
      providerName: apiModel.provider_name,
      operatorName: apiModel.operator_name,
      valid: apiModel.valid,
    };
  }

  /**
   * Obtiene el estado de suscripción telco del usuario
   */
  async getSubscription(ctx: RequestContext): Promise<Subscription> {
    try {
      const response = await this.http.post<GetSubscriptionResponse>(
        "/ph/subscriptions/pg-status",
        {},
        { context: ctx, next: { revalidate: 3600 } },
      );

      return this.mapSubscription(response.data.subscription_data);
    } catch {
      // Retornar subscripción vacía/inválida en caso de error
      return {
        status: "INACTIVE",
        externalUserAccount: "",
        serviceName: "",
        providerName: "",
        operatorName: "",
        valid: false,
      };
    }
  }
}

export const subscriptionService = new SubscriptionService();
