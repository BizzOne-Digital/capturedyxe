/** Client lockup with tagline — `public/logo/Captured-yxe-lockup.png` */
export const BRAND_LOGO_LOCKUP = "/logo/Captured-yxe-lockup.png";

/** Legacy SVG fallback (optional). */
export const BRAND_LOGO_DARK = "/logo/Captured-yxe-dark.svg";
export const BRAND_LOGO_WHITE = "/logo/Captured-yxe-white.svg";

/** Default / CMS `logoUrl` and Open Graph fallbacks. */
export const BRAND_LOGO_PATH = BRAND_LOGO_LOCKUP;

/** Intrinsic aspect of lockup PNG (tagline included). */
export const BRAND_LOGO_WIDTH = 1200;
export const BRAND_LOGO_HEIGHT = 320;

export type BrandLogoVariant = "header" | "footer";

export function getBrandLogoSrc(_variant: BrandLogoVariant): string {
  return BRAND_LOGO_LOCKUP;
}
