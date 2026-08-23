import { ReactNode } from "react";
import { Link } from "@/i18n/navigation";

type BaseProps = {
  children: ReactNode;
  variant?: "primary" | "ghost";
  className?: string;
};

const base =
  "inline-flex items-center justify-center gap-2 px-7 py-3.5 text-xs font-mono uppercase tracking-[0.2em] transition-colors duration-200 disabled:opacity-40 disabled:pointer-events-none";

const variants = {
  primary: "bg-fg text-void hover:bg-signal",
  ghost:
    "border border-line-strong text-fg hover:border-signal hover:text-signal",
};

export function Button({
  children,
  variant = "primary",
  className = "",
  href,
  onClick,
  type = "button",
  disabled = false,
}: BaseProps & {
  href?: string;
  onClick?: () => void;
  type?: "button" | "submit";
  disabled?: boolean;
}) {
  const cls = `${base} ${variants[variant]} ${className}`;

  if (href) {
    return (
      <Link href={href} className={cls}>
        {children}
      </Link>
    );
  }

  return (
    <button type={type} onClick={onClick} disabled={disabled} className={cls}>
      {children}
    </button>
  );
}
