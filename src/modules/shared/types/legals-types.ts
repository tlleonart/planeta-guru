export interface Legal {
  id: number;
  title: string;
  content: string;
  type: LegalType;
  terms_url: string;
  version: string;
  updatedAt: string;
}

export type LegalType = "terms" | "privacy" | "cookies" | "other";

export interface LegalApiModel {
  id: number;
  title: string;
  content: string;
  type: string;
  terms_url: string;
  version: string;
  updated_at: string;
}

export interface GetLegalsUrlApiResponse {
  url: string;
  terms_url?: string;
  privacy_url?: string;
}

export interface GetLegalsListApiResponse {
  legals: LegalApiModel[];
}

export type GetLegalsApiResponse =
  | GetLegalsUrlApiResponse
  | GetLegalsListApiResponse;

export interface LegalsUrls {
  termsUrl: string | null;
  privacyUrl: string | null;
}
