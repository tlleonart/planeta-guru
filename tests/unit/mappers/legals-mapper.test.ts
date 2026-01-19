import { describe, expect, it } from "vitest";
import {
  extractPrivacyUrl,
  extractTermsUrl,
  mapLegal,
  mapLegalsListResponse,
  mapLegalsUrlResponse,
} from "@/modules/shared/mappers/legals-mapper";
import type { Legal, LegalApiModel } from "@/modules/shared/types/legals-types";

describe("legals-mapper", () => {
  describe("mapLegal", () => {
    it("should map API model to domain model", () => {
      const apiModel: LegalApiModel = {
        id: 1,
        title: "Terms of Service",
        content: "Legal content here",
        type: "terms",
        terms_url: "https://example.com/terms",
        version: "1.0",
        updated_at: "2024-01-01T00:00:00Z",
      };

      const result = mapLegal(apiModel);

      expect(result).toEqual({
        id: 1,
        title: "Terms of Service",
        content: "Legal content here",
        type: "terms",
        terms_url: "https://example.com/terms",
        version: "1.0",
        updatedAt: "2024-01-01T00:00:00Z",
      });
    });

    it("should map unknown type to other", () => {
      const apiModel: LegalApiModel = {
        id: 1,
        title: "Unknown Legal",
        content: "Content",
        type: "unknown_type",
        terms_url: "",
        version: "1.0",
        updated_at: "2024-01-01T00:00:00Z",
      };

      const result = mapLegal(apiModel);

      expect(result.type).toBe("other");
    });
  });

  describe("mapLegalsListResponse", () => {
    it("should map array of legals", () => {
      const response = {
        legals: [
          {
            id: 1,
            title: "Terms",
            content: "Terms content",
            type: "terms",
            terms_url: "https://example.com/terms",
            version: "1.0",
            updated_at: "2024-01-01T00:00:00Z",
          },
          {
            id: 2,
            title: "Privacy",
            content: "Privacy content",
            type: "privacy",
            terms_url: "",
            version: "1.0",
            updated_at: "2024-01-01T00:00:00Z",
          },
        ],
      };

      const result = mapLegalsListResponse(response);

      expect(result).toHaveLength(2);
      expect(result[0].type).toBe("terms");
      expect(result[1].type).toBe("privacy");
    });
  });

  describe("mapLegalsUrlResponse", () => {
    it("should map URL response", () => {
      const response = {
        url: "https://example.com",
        terms_url: "https://example.com/terms",
        privacy_url: "https://example.com/privacy",
      };

      const result = mapLegalsUrlResponse(response);

      expect(result.termsUrl).toBe("https://example.com/terms");
      expect(result.privacyUrl).toBe("https://example.com/privacy");
    });

    it("should fallback to url if terms_url is missing", () => {
      const response = {
        url: "https://example.com/fallback",
      };

      const result = mapLegalsUrlResponse(response);

      expect(result.termsUrl).toBe("https://example.com/fallback");
      expect(result.privacyUrl).toBeNull();
    });
  });

  describe("extractTermsUrl", () => {
    it("should extract terms URL from legals array", () => {
      const legals: Legal[] = [
        {
          id: 1,
          title: "Terms",
          content: "Content",
          type: "terms",
          terms_url: "https://example.com/terms",
          version: "1.0",
          updatedAt: "2024-01-01",
        },
      ];

      const result = extractTermsUrl(legals);

      expect(result).toBe("https://example.com/terms");
    });

    it("should return null if no terms found", () => {
      const legals: Legal[] = [];

      const result = extractTermsUrl(legals);

      expect(result).toBeNull();
    });
  });

  describe("extractPrivacyUrl", () => {
    it("should extract privacy content from legals array", () => {
      const legals: Legal[] = [
        {
          id: 1,
          title: "Privacy",
          content: "Privacy policy content",
          type: "privacy",
          terms_url: "",
          version: "1.0",
          updatedAt: "2024-01-01",
        },
      ];

      const result = extractPrivacyUrl(legals);

      expect(result).toBe("Privacy policy content");
    });

    it("should return null if no privacy found", () => {
      const legals: Legal[] = [];

      const result = extractPrivacyUrl(legals);

      expect(result).toBeNull();
    });
  });
});
