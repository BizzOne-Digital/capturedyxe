/** Client-safe image helpers (no database imports). */
export const IMAGE_PLACEHOLDER = "/logo.png";

/** Legacy /uploads/... files no longer exist on serverless hosts: show a placeholder. */
export function safeImageSrc(
  url: string | undefined | null,
  fallback: string = IMAGE_PLACEHOLDER
): string {
  if (!url) return fallback;
  if (url.startsWith("/uploads/")) return fallback;
  return url;
}
