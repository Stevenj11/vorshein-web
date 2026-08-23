import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { Container } from "@/components/ui/Container";
import { SectionLabel } from "@/components/ui/SectionLabel";

export function EventsTeaser() {
  const t = useTranslations("home.events");

  return (
    <section className="py-24 md:py-32">
      <Container className="flex flex-col items-start justify-between gap-8 md:flex-row md:items-end">
        <div>
          <SectionLabel index={t("index")}>{t("label")}</SectionLabel>
          <h2 className="mt-8 text-3xl font-semibold tracking-tight md:text-4xl">
            {t("heading")}
          </h2>
          <p className="mt-3 font-mono text-sm uppercase tracking-[0.2em] text-fg-faint">
            {t("status")}
          </p>
        </div>
        <Link
          href="/events"
          className="font-mono text-xs uppercase tracking-[0.2em] text-fg-muted transition-colors hover:text-fg"
        >
          {t("cta")}
        </Link>
      </Container>
    </section>
  );
}
