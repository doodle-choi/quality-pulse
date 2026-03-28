/**
 * Sanitizes URLs to prevent Cross-Site Scripting (XSS) attacks.
 * Only permits URLs with safe protocols (http: or https:).
 *
 * @param url The URL to sanitize
 * @returns The sanitized URL or '#' if unsafe
 */
export function sanitizeUrl(url: string | undefined | null): string {
  if (!url) return '#';

  // Remove leading/trailing whitespace and control characters
  const cleanedUrl = url.trim();

  try {
    const parsed = new URL(cleanedUrl);
    // Only allow http and https protocols
    if (parsed.protocol === 'http:' || parsed.protocol === 'https:') {
      return parsed.href;
    }
    return '#';
  } catch {
    // If URL parsing fails (e.g., relative URLs not allowed for external links)
    // or malformed, reject it.
    return '#';
  }
}
