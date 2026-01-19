import type {
  ApiPagination,
  PaginatedResponse,
  PaginationParams,
} from "./api-types";

export interface Wallet {
  id: number;
  userId: number;
  amount: number;
  deleted: boolean;
}

export interface WalletOutcome {
  id: number;
  walletId: number;
  amount: number;
  productId: number;
  percentageDiscount: number;
  createdAt: string;
  deleted: boolean;
  voucherId: string;
  productName: string;
}

export interface WalletIncome {
  id: number;
  walletId: number;
  purchase: number;
  amount: number;
  incomeTypeId: number;
  currency: string;
  createdAt: string;
  deleted: boolean;
}

export interface WalletApiModel {
  id: number;
  user_id: number;
  amount: number;
  deleted: boolean;
}

export interface WalletOutcomeApiModel {
  id: number;
  wallet_id: number;
  amount: number;
  product_id: number;
  percentage_discount: number;
  created_at: string;
  deleted: boolean;
  voucher_id: string;
  product_name: string;
}

export interface WalletIncomeApiModel {
  id: number;
  wallet_id: number;
  purchase: number;
  amount: number;
  income_type_id: number;
  currency: string;
  created_at: string;
  deleted: boolean;
}

export interface GetWalletApiResponse {
  wallet: WalletApiModel;
}

export interface GetWalletOutcomesApiResponse {
  outcomes: WalletOutcomeApiModel[];
  pagination: ApiPagination;
}

export interface GetWalletIncomesApiResponse {
  incomes: WalletIncomeApiModel[];
  pagination: ApiPagination;
}

export interface GetWalletHistoryParams extends PaginationParams {
  fromDate?: string;
  toDate?: string;
}

export type PaginatedOutcomes = PaginatedResponse<WalletOutcome>;
export type PaginatedIncomes = PaginatedResponse<WalletIncome>;
