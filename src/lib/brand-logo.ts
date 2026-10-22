/** Client lockup with tagline — `public/logo/Captured-yxe-lockup.png` */
export const BRAND_LOGO_LOCKUP = "/logo/Captured-yxe-lockup.png";

/** Header lockup — same artwork, transparent background. */
export const BRAND_LOGO_HEADER = "/logo/Captured-yxe-header.png";
export const BRAND_LOGO_HEADER_WIDTH = 1412;
export const BRAND_LOGO_HEADER_HEIGHT = 392;

/** Legacy SVG fallback (optional). */
export const BRAND_LOGO_DARK = "/logo/Captured-yxe-dark.svg";
export const BRAND_LOGO_WHITE = "/logo/Captured-yxe-white.svg";

/** Default / CMS `logoUrl` and Open Graph fallbacks. */
export const BRAND_LOGO_PATH = BRAND_LOGO_LOCKUP;

/** Intrinsic aspect of lockup PNG (tagline included). */
export const BRAND_LOGO_WIDTH = 1200;
export const BRAND_LOGO_HEIGHT = 320;

export type BrandLogoVariant = "header" | "footer";

/** Header: transparent lockup PNG. Footer: lockup on ivory chip. */
export function getBrandLogoSrc(variant: BrandLogoVariant): string {
  return variant === "header" ? BRAND_LOGO_HEADER : BRAND_LOGO_LOCKUP;
}
