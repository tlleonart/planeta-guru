/**
 * Validates and sanitizes a redirect URL to prevent open redirect attacks
 * Only allows relative paths that start with /
 * Blocks protocol specifiers (http://, https://, //, javascript:, etc.)
 */
export function validateRedirectUrl(
  redirectUrl: string | null | undefined,
  locale: string,
  fallback = "/help",
): string {
  if (!redirectUrl) {
    return `/${locale}${fallback}`;
  }

  // Remove any leading/trailing whitespace
  const trimmed = redirectUrl.trim();

  // Block empty strings
  if (!trimmed) {
    return `/${locale}${fallback}`;
  }

  // Block protocol specifiers and absolute URLs
  const dangerousPatterns = [
    /^https?:/i, // http:// or https://
    /^\/\//, // Protocol-relative URLs //example.com
    /^[a-z]+:/i, // Any protocol (javascript:, data:, etc.)
  ];

  for (const pattern of dangerousPatterns) {
    if (pattern.test(trimmed)) {
      return `/${locale}${fallback}`;
    }
  }

  // Ensure the path starts with /
  const normalizedPath = trimmed.startsWith("/") ? trimmed : `/${trimmed}`;

  // Remove any potential double slashes at the start (which could be protocol-relative)
  const safePath = normalizedPath.replace(/^\/+/, "/");

  return `/${locale}${safePath}`;
}
