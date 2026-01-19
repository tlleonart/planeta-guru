import { describe, expect, it } from "vitest";
import {
  mapGuruPackCountryPrice,
  mapPack,
  mapPackList,
} from "@/modules/shared/mappers/pack-mapper";

describe("pack-mapper", () => {
  describe("mapGuruPackCountryPrice", () => {
    it("should map country price from snake_case to camelCase", () => {
      const apiModel = {
        guru_pack_id: 10,
        country_id: 1,
        currency_id: 2,
        price: 100,
        transaction_cost: 10,
        transaction_percentage: 5,
        total_price: 110,
      };

      const result = mapGuruPackCountryPrice(apiModel);

      expect(result).toEqual({
        guruPackId: 10,
        countryId: 1,
        currencyId: 2,
        price: 100,
        transactionCost: 10,
        transactionPercentage: 5,
        totalPrice: 110,
      });
    });
  });

  describe("mapPack", () => {
    it("should map pack with prices", () => {
      const apiModel = {
        id: 1,
        name: "Pack 100",
        guru_amount: 100,
        usd_amount: 10,
        country_id: 1,
        offered: true,
        prices: {
          guru_pack_id: 1,
          country_id: 1,
          currency_id: 2,
          price: 50,
          transaction_cost: 5,
          transaction_percentage: 10,
          total_price: 55,
        },
      };

      const result = mapPack(apiModel);

      expect(result.id).toBe(1);
      expect(result.name).toBe("Pack 100");
      expect(result.guruAmount).toBe(100);
      expect(result.prices.price).toBe(50);
      expect(result.prices.transactionCost).toBe(5);
      expect(result.prices.totalPrice).toBe(55);
    });
  });

  describe("mapPackList", () => {
    it("should map array of packs", () => {
      const apiModels = [
        {
          id: 1,
          name: "Pack 100",
          guru_amount: 100,
          usd_amount: 10,
          country_id: 1,
          offered: true,
          prices: {
            guru_pack_id: 1,
            country_id: 1,
            currency_id: 2,
            price: 50,
            transaction_cost: 5,
            transaction_percentage: 10,
            total_price: 55,
          },
        },
        {
          id: 2,
          name: "Pack 500",
          guru_amount: 500,
          usd_amount: 50,
          country_id: 1,
          offered: true,
          prices: {
            guru_pack_id: 2,
            country_id: 1,
            currency_id: 2,
            price: 200,
            transaction_cost: 10,
            transaction_percentage: 5,
            total_price: 210,
          },
        },
      ];

      const result = mapPackList(apiModels);

      expect(result).toHaveLength(2);
      expect(result[0].guruAmount).toBe(100);
      expect(result[1].guruAmount).toBe(500);
    });
  });
});
