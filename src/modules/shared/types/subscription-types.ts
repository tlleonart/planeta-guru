import type { ApiMessage, ApiPagination } from "./api-types";

export interface SubscriptionApiModel {
  status: string;
  external_user_account: string;
  service_name: string;
  provider_name: string;
  operator_name: string;
  valid: boolean;
}

export interface Subscription {
  status: string;
  externalUserAccount: string;
  serviceName: string;
  providerName: string;
  operatorName: string;
  valid: boolean;
}

export interface GetSubscriptionResponse {
  subscription_data: SubscriptionApiModel;
  pagination: ApiPagination;
  message: ApiMessage;
}
