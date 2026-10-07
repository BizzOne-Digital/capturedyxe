import Image from "next/image";

/** Header & footer always use this file — update `public/logo.png` to change the brand mark. */
export const BRAND_LOGO_PATH = "/logo.png";

const LOGO_WIDTH = 1024;
const LOGO_HEIGHT = 341;

/** Full lockup: Captured.yxe + camera + “VINTAGE SOUL, INSTANT ROLL” */
const logoImageClass =
  "block h-11 w-auto max-w-[min(100%,260px)] object-contain object-left sm:h-12 sm:max-w-[280px] md:h-14 md:max-w-[300px]";

type SiteLogoProps = {
  siteName: string;
  variant: "header" | "footer";
  priority?: boolean;
};

export function SiteLogo({ siteName, variant, priority }: SiteLogoProps) {
  const image = (
    <Image
      src={BRAND_LOGO_PATH}
      alt={siteName}
      width={LOGO_WIDTH}
      height={LOGO_HEIGHT}
      className={logoImageClass}
      priority={priority}
      sizes="(max-width: 640px) 240px, 300px"
    />
  );

  if (variant === "footer") {
    return (
      <span className="inline-block rounded-sm bg-porcelain px-2.5 py-2 sm:px-3 sm:py-2.5">
        {image}
      </span>
    );
  }

  return image;
}
