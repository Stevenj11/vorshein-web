import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { ManualIcon } from "@/components/icons/ManualIcon";
import { Container } from "@/components/ui/Container";
import { SectionLabel } from "@/components/ui/SectionLabel";
import { MODULE_NUMBERS } from "@/lib/manual";

export function SystemTeaser() {
  const t = useTranslations("home.system");
  const tm = useTranslations("manual");
  const preview = MODULE_NUMBERS.slice(0, 6);

  return (
    <section className="border-b border-line py-24 md:py-32">
      <Container>
        <div className="flex items-end justify-between">
          <SectionLabel index={t("index")}>{t("label")}</SectionLabel>
          <Link
            href="/system"
            className="hidden font-mono text-xs uppercase tracking-[0.2em] text-fg-muted transition-colors hover:text-fg md:block"
          >
            {t("viewFull")}
          </Link>
        </div>

        <h2 className="mt-8 max-w-2xl text-balance text-3xl font-semibold leading-tight md:text-4xl">
          {t("heading")}
        </h2>

        <div className="mt-10 grid grid-cols-1 divide-y divide-line border-t border-line sm:grid-cols-2 sm:divide-x sm:divide-y-0">
          {preview.map((n) => (
            <div key={n} className="flex items-center gap-4 py-5 sm:px-6">
              <span className="font-mono text-xs text-fg-faint">{n}</span>
              <ManualIcon n={n} className="h-5 w-5 shrink-0 text-fg-faint" />
              <span className="text-sm font-medium">{tm(`${n}.name`)}</span>
            </div>
          ))}
        </div>

        <Link
          href="/system"
          className="mt-8 inline-flex items-center gap-2 font-mono text-xs uppercase tracking-[0.2em] text-fg transition-colors hover:text-signal md:hidden"
        >
          {t("viewFull")}
        </Link>
      </Container>
    </section>
  );
}
