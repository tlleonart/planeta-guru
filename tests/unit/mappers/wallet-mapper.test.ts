import { describe, expect, it } from "vitest";
import {
  mapIncome,
  mapOutcome,
  mapWallet,
  mapWalletResponse,
} from "@/modules/shared/mappers/wallet-mapper";

describe("wallet-mapper", () => {
  describe("mapWallet", () => {
    it("should map wallet from API response", () => {
      const apiModel = {
        id: 1,
        user_id: 123,
        amount: 1500,
        deleted: false,
      };

      const result = mapWallet(apiModel);

      expect(result).toEqual({
        id: 1,
        userId: 123,
        amount: 1500,
        deleted: false,
      });
    });
  });

  describe("mapWalletResponse", () => {
    it("should extract and map wallet from response", () => {
      const response = {
        wallet: {
          id: 1,
          user_id: 123,
          amount: 1500,
          deleted: false,
        },
      };

      const result = mapWalletResponse(response);

      expect(result).toEqual({
        id: 1,
        userId: 123,
        amount: 1500,
        deleted: false,
      });
    });
  });

  describe("mapOutcome", () => {
    it("should map outcome transaction", () => {
      const apiModel = {
        id: 1,
        wallet_id: 10,
        amount: 100,
        product_id: 5,
        percentage_discount: 10,
        created_at: "2024-01-01T00:00:00Z",
        deleted: false,
        voucher_id: null,
        product_name: "Test Game",
      };

      const result = mapOutcome(apiModel);

      expect(result).toEqual({
        id: 1,
        walletId: 10,
        amount: 100,
        productId: 5,
        percentageDiscount: 10,
        createdAt: "2024-01-01T00:00:00Z",
        deleted: false,
        voucherId: null,
        productName: "Test Game",
      });
    });
  });

  describe("mapIncome", () => {
    it("should map income transaction", () => {
      const apiModel = {
        id: 1,
        wallet_id: 10,
        purchase: "Pack 100",
        amount: 500,
        income_type_id: 1,
        currency: "MXN",
        created_at: "2024-01-01T00:00:00Z",
        deleted: false,
      };

      const result = mapIncome(apiModel);

      expect(result).toEqual({
        id: 1,
        walletId: 10,
        purchase: "Pack 100",
        amount: 500,
        incomeTypeId: 1,
        currency: "MXN",
        createdAt: "2024-01-01T00:00:00Z",
        deleted: false,
      });
    });
  });
});
