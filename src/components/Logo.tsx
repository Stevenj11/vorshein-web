import Image from "next/image";

type LogoProps = {
  size?: number;
  variant?: "dark" | "light";
  className?: string;
};

/**
 * "dark" (default, used everywhere in this product) renders
 * logo-mark-alpha.png — a pre-baked PNG with a real alpha channel
 * (generated from logo-mark.jpeg via scripts/make-alpha-logo.cjs) so the
 * mark shows with a genuinely transparent background. No filter/blend-mode
 * trick: those combos are unreliable across browsers (notably Safari,
 * which can fail to composite `filter` + `mix-blend-mode` on one element),
 * where a real alpha channel always just works.
 * "light" keeps the original blend approach for any future light-panel
 * context (unused today).
 */
export function Logo({ size = 32, variant = "dark", className }: LogoProps) {
  const isDark = variant === "dark";

  if (isDark) {
    return (
      <Image
        src="/brand/logo-mark-alpha.png"
        alt="Vorshein"
        width={size}
        height={size}
        priority
        className={className}
        style={{ width: size, height: size }}
      />
    );
  }

  return (
    <Image
      src="/brand/logo-mark.jpeg"
      alt="Vorshein"
      width={size}
      height={size}
      priority
      className={className}
      style={{ width: size, height: size, mixBlendMode: "multiply" }}
    />
  );
}
