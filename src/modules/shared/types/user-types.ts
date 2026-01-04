import { ApiMessage, ApiPagination } from "./api-types"

export interface Subscription {
    status: string
    externalUserAccount: string
    serviceName: string
    providerName: string
    operatorName: string
    valid: boolean
}

export interface GetSubscriptionApiResponse {
    subscription_data: Subscription
    pagination: ApiPagination
    message: ApiMessage
}