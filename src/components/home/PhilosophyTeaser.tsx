import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { Container } from "@/components/ui/Container";
import { SectionLabel } from "@/components/ui/SectionLabel";

export function PhilosophyTeaser() {
  const t = useTranslations("home.philosophy");

  return (
    <section className="border-b border-line py-24 md:py-32">
      <Container>
        <SectionLabel index={t("index")}>{t("label")}</SectionLabel>

        <div className="mt-8 grid grid-cols-1 gap-10 md:grid-cols-12">
          <h2 className="text-balance text-3xl font-semibold leading-tight md:col-span-7 md:text-4xl">
            {t("heading")}
          </h2>
          <div className="md:col-span-5">
            <p className="text-fg-muted">{t("body")}</p>
            <Link
              href="/vorshein"
              className="mt-6 inline-flex items-center gap-2 font-mono text-xs uppercase tracking-[0.2em] text-fg transition-colors hover:text-signal"
            >
              {t("cta")}
            </Link>
          </div>
        </div>
      </Container>
    </section>
  );
}
