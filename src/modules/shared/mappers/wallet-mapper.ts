import type {
  GetWalletApiResponse,
  Wallet,
  WalletApiModel,
  WalletIncome,
  WalletIncomeApiModel,
  WalletOutcome,
  WalletOutcomeApiModel,
} from "../types/wallet-types";

export function mapWallet(api: WalletApiModel): Wallet {
  return {
    id: api.id,
    userId: api.user_id,
    amount: api.amount,
    deleted: api.deleted,
  };
}

export function mapWalletResponse(response: GetWalletApiResponse): Wallet {
  return mapWallet(response.wallet);
}

export function mapOutcome(api: WalletOutcomeApiModel): WalletOutcome {
  return {
    id: api.id,
    walletId: api.wallet_id,
    amount: api.amount,
    productId: api.product_id,
    percentageDiscount: api.percentage_discount,
    createdAt: api.created_at,
    deleted: api.deleted,
    voucherId: api.voucher_id,
    productName: api.product_name,
  };
}

export function mapIncome(api: WalletIncomeApiModel): WalletIncome {
  return {
    id: api.id,
    walletId: api.wallet_id,
    purchase: api.purchase,
    amount: api.amount,
    incomeTypeId: api.income_type_id,
    currency: api.currency,
    createdAt: api.created_at,
    deleted: api.deleted,
  };
}
