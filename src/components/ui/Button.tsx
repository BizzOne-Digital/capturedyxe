import Link from "next/link";
import type { ComponentProps } from "react";

const base =
  "inline-flex items-center justify-center gap-2 rounded-full px-6 py-3 text-sm font-medium tracking-wide transition-[transform,background-color,color,box-shadow] duration-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-champagne";

const variants = {
  primary: `${base} btn-shimmer bg-ink text-porcelain hover:bg-ink/90 hover:-translate-y-1 hover:scale-[1.03] active:scale-95`,
  secondary: `${base} border border-champagne/50 bg-transparent text-ink hover:border-champagne hover:bg-sand/40 hover:-translate-y-1 hover:scale-[1.02]`,
  light: `${base} bg-porcelain text-ink hover:bg-white hover:-translate-y-1 hover:scale-[1.03]`,
  ghost: `${base} text-porcelain border border-porcelain/30 hover:bg-porcelain/10`,
};

type ButtonProps = ComponentProps<"button"> & {
  variant?: keyof typeof variants;
};

export function Button({
  variant = "primary",
  className = "",
  ...props
}: ButtonProps) {
  return (
    <button
      className={`${variants[variant]} ${className}`}
      type={props.type ?? "button"}
      {...props}
    />
  );
}

type ButtonLinkProps = ComponentProps<typeof Link> & {
  variant?: keyof typeof variants;
};

export function ButtonLink({
  variant = "primary",
  className = "",
  ...props
}: ButtonLinkProps) {
  return <Link className={`${variants[variant]} ${className}`} {...props} />;
}
