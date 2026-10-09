import Image from "next/image";
import {
  BRAND_LOGO_HEIGHT,
  BRAND_LOGO_PATH,
  BRAND_LOGO_WIDTH,
  getBrandLogoSrc,
} from "@/lib/brand-logo";

export { BRAND_LOGO_PATH };

const logoImageClass =
  "block h-10 w-auto max-w-full object-contain object-left sm:h-11 sm:max-w-[260px] md:h-12 md:max-w-[300px]";

type SiteLogoProps = {
  siteName: string;
  variant: "header" | "footer";
  priority?: boolean;
};

export function SiteLogo({ siteName, variant, priority }: SiteLogoProps) {
  const src = getBrandLogoSrc(variant);

  return (
    <Image
      src={src}
      alt={siteName}
      width={BRAND_LOGO_WIDTH}
      height={BRAND_LOGO_HEIGHT}
      className={logoImageClass}
      priority={priority ?? variant === "header"}
      sizes="(max-width: 640px) 220px, 300px"
    />
  );
}
