import { HttpClient } from "./client";

export * from "./client";
export * from "./types";

let httpClientInstance: HttpClient | null = null;

export function getHttpClient(): HttpClient {
  if (!httpClientInstance) {
    const baseUrl = process.env.NEXT_PUBLIC_BASE_API_URL;
    const platformKey = process.env.PLATFORM_KEY;

    if (!baseUrl || !platformKey) {
      throw new Error(
        "Faltan las variables de entorno requeridas NEXT_PUBLIC_BASE_API_URL o PLATFORM_KEY",
      );
    }

    httpClientInstance = new HttpClient({
      baseUrl,
      platformKey,
      timeout: Number(process.env.API_TIMEOUT) || 30000,
    });
  }

  return httpClientInstance;
}
