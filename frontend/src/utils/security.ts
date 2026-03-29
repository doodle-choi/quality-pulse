/**
 * Sanitizes URLs to prevent XSS attacks via javascript: or data: protocols.
 * Ensures the URL only uses safe protocols (http: or https:).
 * Relative URLs are allowed as they will default to the base URL's protocol.
 */
export function sanitizeUrl(url: string | undefined | null): string {
  if (!url) return '#';

  try {
    // Use a dummy base URL to handle relative URLs
    const parsed = new URL(url, 'https://fallback.example.com');

    // Only allow http: and https: protocols
    if (parsed.protocol === 'http:' || parsed.protocol === 'https:') {
      return url;
    }
  } catch {
    // If URL parsing fails, consider it unsafe
    return '#';
  }

  // Return safe fallback for unsafe protocols like javascript:, data:, vbscript:
  return '#';
}
