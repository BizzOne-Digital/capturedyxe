import Image from "next/image";
import {
  BRAND_LOGO_HEIGHT,
  BRAND_LOGO_PATH,
  BRAND_LOGO_WIDTH,
  getBrandLogoSrc,
} from "@/lib/brand-logo";

export { BRAND_LOGO_PATH };

const logoImageClass =
  "block h-11 w-auto max-w-full object-contain object-left sm:h-12 sm:max-w-[280px] md:h-[3.25rem] md:max-w-[320px]";

type SiteLogoProps = {
  siteName: string;
  variant: "header" | "footer";
  priority?: boolean;
};

export function SiteLogo({ siteName, variant, priority }: SiteLogoProps) {
  const src = getBrandLogoSrc(variant);
  const onDarkFooter = variant === "footer";

  const image = (
    <Image
      src={src}
      alt={siteName}
      width={BRAND_LOGO_WIDTH}
      height={BRAND_LOGO_HEIGHT}
      className={`${logoImageClass} ${onDarkFooter ? "" : "mix-blend-multiply"}`}
      priority={priority ?? variant === "header"}
      sizes="(max-width: 640px) 240px, 320px"
    />
  );

  if (onDarkFooter) {
    return (
      <span className="inline-flex items-center rounded-sm bg-ivory px-2.5 py-1.5 sm:px-3 sm:py-2">
        {image}
      </span>
    );
  }

  return image;
}
