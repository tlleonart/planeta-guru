export interface HttpClientConfig {
  baseUrl: string;
  platformKey: string;
  timeout?: number;
}

export interface RequestContext {
  selectedCountry?: string;
  selectedLanguage?: string;
  authToken?: string;
  msisdn?: string;
}

export interface HttpRequestOptions extends RequestInit {
  params?: Record<string, string | number | boolean | undefined>;
  context?: RequestContext;
}

export interface HttpResponse<T> {
  data: T;
  status: number;
  headers: Headers;
}

export interface HttpError {
  message: string;
  status: number;
  code?: string;
  details?: unknown;
}

export class HttpClientError extends Error {
  constructor(
    message: string,
    public readonly status: number,
    public readonly code?: string,
    public readonly details?: unknown
  ) {
    super(message);
    this.name = "HttpClientError";
  }
}
