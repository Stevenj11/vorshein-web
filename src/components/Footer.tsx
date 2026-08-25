import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { BRAND } from "@/lib/brand";
import { Logo } from "./Logo";

export function Footer() {
  const t = useTranslations("nav");
  const tf = useTranslations("footer");
  const tb = useTranslations("brand");

  const links = [
    { href: "/vorshein", label: t("about") },
    { href: "/training", label: t("training") },
    { href: "/system", label: t("system") },
    { href: "/events", label: t("events") },
  ];

  return (
    <footer className="border-t border-line">
      <div className="mx-auto max-w-[1400px] px-6 py-16 md:px-10">
        <div className="flex flex-col justify-between gap-12 md:flex-row">
          <div className="max-w-sm">
            <div className="flex items-center gap-3">
              <Logo size={28} />
              <span className="font-mono text-sm tracking-[0.25em]">
                {BRAND.name}
              </span>
            </div>
            <p className="mt-4 text-sm leading-relaxed text-fg-muted">
              {tb("system")}
              <br />
              {tb("tagline")}
            </p>
          </div>

          <div className="grid grid-cols-2 gap-10 sm:grid-cols-3">
            <div className="flex flex-col gap-3">
              <span className="font-mono text-[11px] uppercase tracking-[0.25em] text-fg-faint">
                {tf("systemLabel")}
              </span>
              {links.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="text-sm text-fg-muted transition-colors hover:text-fg"
                >
                  {link.label}
                </Link>
              ))}
            </div>

            <div className="flex flex-col gap-3">
              <span className="font-mono text-[11px] uppercase tracking-[0.25em] text-fg-faint">
                {tf("startLabel")}
              </span>
              <Link
                href="/assessment"
                className="text-sm text-fg-muted transition-colors hover:text-fg"
              >
                {tf("findYourLevel")}
              </Link>
              <Link
                href="/events"
                className="text-sm text-fg-muted transition-colors hover:text-fg"
              >
                {tf("competitionStatus")}
              </Link>
              <Link
                href="/apply"
                className="text-sm text-fg-muted transition-colors hover:text-fg"
              >
                {tf("reserve")}
              </Link>
              <Link
                href="/estado"
                className="text-sm text-fg-muted transition-colors hover:text-fg"
              >
                {tf("checkStatus")}
              </Link>
            </div>
          </div>
        </div>

        <div className="mt-16 flex flex-col gap-3 border-t border-line pt-8 text-xs text-fg-faint sm:flex-row sm:items-center sm:justify-between">
          <span>
            &copy; {new Date().getFullYear()} {BRAND.name}. {tf("rights")}
          </span>
          <span>{tf("founded", { name: BRAND.founder })}</span>
        </div>
      </div>
    </footer>
  );
}
