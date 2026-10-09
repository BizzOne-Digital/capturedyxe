/** Brand lockups in `public/logo/` — dark for light backgrounds, white for dark footer. */
export const BRAND_LOGO_DARK = "/logo/Captured-yxe-dark.svg";
export const BRAND_LOGO_WHITE = "/logo/Captured-yxe-white.svg";

/** Default / CMS `logoUrl` and Open Graph fallbacks. */
export const BRAND_LOGO_PATH = BRAND_LOGO_DARK;

export const BRAND_LOGO_WIDTH = 2172;
export const BRAND_LOGO_HEIGHT = 724;

export type BrandLogoVariant = "header" | "footer";

export function getBrandLogoSrc(variant: BrandLogoVariant): string {
  return variant === "footer" ? BRAND_LOGO_WHITE : BRAND_LOGO_DARK;
}
