import type { ApiPagination } from "../shared/types/api-types";
import {
  type HttpClientConfig,
  HttpClientError,
  type HttpRequestOptions,
  type HttpResponse,
  type RequestContext,
} from "./types";

export class HttpClient {
  private readonly baseUrl: string;
  private readonly platformKey: string;
  private readonly timeout: number;

  constructor(config: HttpClientConfig) {
    this.baseUrl = config.baseUrl.replace(/\/+$/, "");
    this.platformKey = config.platformKey;
    this.timeout = config.timeout ?? 30000;
  }

  private buildHeaders(context?: RequestContext): Headers {
    const headers = new Headers({
      "Content-Type": "application/json",
      "Platform-Key": this.platformKey,
    });

    if (context?.selectedCountry) {
      headers.set("Selected-Country", context.selectedCountry);
    }

    if (context?.selectedLanguage) {
      headers.set("Selected-Language", context.selectedLanguage);
    }

    if (context?.authToken) {
      headers.set("Authorization", `Bearer ${context.authToken}`);
    }

    if (context?.msisdn) {
      headers.set("Msisdn", context.msisdn);
    }

    return headers;
  }

  private buildUrl(
    endpoint: string,
    params?: Record<string, string | number | boolean | undefined>,
  ): string {
    const url = new URL(`${this.baseUrl}/${endpoint}`);

    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined) {
          url.searchParams.append(key, String(value));
        }
      });
    }

    return url.toString();
  }

  private async executeRequest<T>(
    url: string,
    options: HttpRequestOptions,
  ): Promise<HttpResponse<T>> {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), this.timeout);

    try {
      const response = await fetch(url, {
        ...options,
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        const errorBody = await response.json().catch(() => ({}));

        throw new HttpClientError(
          errorBody.message ?? `HTTP Error: ${response.status}`,
          response.status,
          errorBody.code,
          errorBody.details,
        );
      }

      if (response.status === 204) {
        return {
          data: null as unknown as T,
          status: response.status,
          headers: response.headers,
        };
      }

      const data = await response.json();

      return {
        data,
        status: response.status,
        headers: response.headers,
      };
    } catch (error) {
      clearTimeout(timeoutId);

      if (error instanceof HttpClientError) {
        throw error;
      }

      if (error instanceof Error && error.name === "AbortError") {
        throw new HttpClientError("Request timed out", 408, "TIMEOUT");
      }

      throw new HttpClientError(
        error instanceof Error ? error.message : "Unknown error occurred",
        500,
        "UNKNOWN_ERROR",
      );
    }
  }

  async get<T>(
    endpoint: string,
    options: HttpRequestOptions = {},
  ): Promise<HttpResponse<T>> {
    const { params, context, ...fetchOptions } = options;
    const url = this.buildUrl(endpoint, params);
    const headers = this.buildHeaders(context);

    return this.executeRequest<T>(url, {
      ...fetchOptions,
      method: "GET",
      headers,
    });
  }

  /**
   * POST request
   */
  async post<T, B = unknown>(
    endpoint: string,
    body?: B,
    options: HttpRequestOptions = {},
  ): Promise<HttpResponse<T>> {
    const { params, context, ...fetchOptions } = options;
    const url = this.buildUrl(endpoint, params);
    const headers = this.buildHeaders(context);

    return this.executeRequest<T>(url, {
      ...fetchOptions,
      method: "POST",
      headers,
      body: body ? JSON.stringify(body) : undefined,
    });
  }

  async put<T, B = unknown>(
    endpoint: string,
    body?: B,
    options: HttpRequestOptions = {},
  ): Promise<HttpResponse<T>> {
    const { params, context, ...fetchOptions } = options;
    const url = this.buildUrl(endpoint, params);
    const headers = this.buildHeaders(context);

    return this.executeRequest<T>(url, {
      ...fetchOptions,
      method: "PUT",
      headers,
      body: body ? JSON.stringify(body) : undefined,
    });
  }

  async patch<T, B = unknown>(
    endpoint: string,
    body?: B,
    options: HttpRequestOptions = {},
  ): Promise<HttpResponse<T>> {
    const { params, context, ...fetchOptions } = options;
    const url = this.buildUrl(endpoint, params);
    const headers = this.buildHeaders(context);

    return this.executeRequest<T>(url, {
      ...fetchOptions,
      method: "PATCH",
      headers,
      body: body ? JSON.stringify(body) : undefined,
    });
  }

  async delete<T>(
    endpoint: string,
    options: HttpRequestOptions = {},
  ): Promise<HttpResponse<T>> {
    const { params, context, ...fetchOptions } = options;
    const url = this.buildUrl(endpoint, params);
    const headers = this.buildHeaders(context);

    return this.executeRequest<T>(url, {
      ...fetchOptions,
      method: "DELETE",
      headers,
    });
  }

  async getPaginated<T, K extends string>(
    endpoint: string,
    dataKey: K,
    options: HttpRequestOptions = {},
  ): Promise<{
    data: T[];
    pagination: ApiPagination;
  }> {
    const response = await this.get<
      Record<K, T[]> & { pagination: ApiPagination }
    >(endpoint, options);

    return {
      data: response.data[dataKey],
      pagination: response.data.pagination,
    };
  }
}
