import { mapIncome, mapOutcome, mapWalletResponse } from "../mappers/wallet-mapper";
import type { GetWalletApiResponse, GetWalletHistoryParams, GetWalletIncomesApiResponse, GetWalletOutcomesApiResponse, PaginatedIncomes, PaginatedOutcomes, Wallet } from "../types/wallet-types";
import { BaseService } from "@/modules/http/base-service";
import type { RequestContext } from "@/modules/http";

class WalletService extends BaseService {
  private readonly basePath = '/wallets';

  async getWallet(context: RequestContext): Promise<Wallet> {
    const response = await this.http.get<GetWalletApiResponse>(
      `${this.basePath}/wallet`,
      { context }
    );

    return mapWalletResponse(response.data);
  }

  async getBalance(context: RequestContext): Promise<number> {
    const wallet = await this.getWallet(context);
    return wallet.amount;
  }

  async getOutcomes(
    params: GetWalletHistoryParams = {},
    context: RequestContext
  ): Promise<PaginatedOutcomes> {
    const response = await this.http.get<GetWalletOutcomesApiResponse>(
      `${this.basePath}/outcomes`,
      {
        params: {
          ...this.buildPaginationParams(params),
          from_date: params.fromDate,
          to_date: params.toDate,
        },
        context,
      }
    );

    return {
      items: response.data.outcomes.map(mapOutcome),
      pagination: this.mapPagination(response.data.pagination),
    };
  }

  async getIncomes(
    params: GetWalletHistoryParams = {},
    context: RequestContext
  ): Promise<PaginatedIncomes> {
    const response = await this.http.get<GetWalletIncomesApiResponse>(
      `${this.basePath}/incomes`,
      {
        params: {
          ...this.buildPaginationParams(params),
          from_date: params.fromDate,
          to_date: params.toDate,
        },
        context,
      }
    );

    return {
      items: response.data.incomes.map(mapIncome),
      pagination: this.mapPagination(response.data.pagination),
    };
  }
}

export const walletService = new WalletService();