import type {
  GetLegalsListApiResponse,
  GetLegalsUrlApiResponse,
  Legal,
  LegalApiModel,
  LegalsUrls,
  LegalType,
} from "../types/legals-types";

function mapLegalType(type: string): LegalType {
  const validTypes: LegalType[] = ["terms", "privacy", "cookies", "other"];
  return validTypes.includes(type as LegalType) ? (type as LegalType) : "other";
}

export function mapLegal(api: LegalApiModel): Legal {
  return {
    id: api.id,
    title: api.title,
    content: api.content,
    type: mapLegalType(api.type),
    terms_url: api.terms_url,
    version: api.version,
    updatedAt: api.updated_at,
  };
}

export function mapLegalsListResponse(
  response: GetLegalsListApiResponse,
): Legal[] {
  return response.legals.map(mapLegal);
}

export function mapLegalsUrlResponse(
  response: GetLegalsUrlApiResponse,
): LegalsUrls {
  return {
    termsUrl: response.terms_url ?? response.url ?? null,
    privacyUrl: response.privacy_url ?? null,
  };
}

export function extractTermsUrl(legals: Legal[]): string | null {
  const terms = legals.find((legal) => legal.type === "terms");
  return terms?.terms_url ?? null;
}

export function extractPrivacyUrl(legals: Legal[]): string | null {
  const privacy = legals.find((legal) => legal.type === "privacy");
  return privacy?.content ?? null;
}
