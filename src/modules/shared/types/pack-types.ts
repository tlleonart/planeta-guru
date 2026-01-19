import type {
  ApiMessage,
  ApiPagination,
  PaginationParams,
  SortParams,
} from "./api-types";

export interface GuruPackCountryPriceApiModel {
  guru_pack_id: number;
  country_id: number;
  currency_id: number;
  price: number;
  transaction_cost: number;
  transaction_percentage: string;
  total_price: number;
}

export interface GuruPackCountryPrice {
  guruPackId: number;
  countryId: number;
  currencyId: number;
  price: number;
  transactionCost: number;
  transactionPercentage: string;
  totalPrice: number;
}

export interface PackApiModel {
  id: number;
  name: string;
  guru_amount: string;
  usd_amount: string;
  country_id: number;
  offered: boolean;
  prices: GuruPackCountryPriceApiModel | null;
}

export interface Pack {
  id: number;
  name: string;
  guruAmount: string;
  usdAmount: string;
  countryId: number;
  offered: boolean;
  prices: GuruPackCountryPrice;
}

export type PackList = Pack[];

export type PackListApiModel = PackApiModel[];

export interface GetPacksResponse {
  guru_packs: PackListApiModel;
  pagination: ApiPagination;
  messagE: ApiMessage;
}

export interface GetPacksParams extends PaginationParams, SortParams {}
