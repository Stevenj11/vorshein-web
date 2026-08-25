import { getTranslations } from "next-intl/server";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { SectionLabel } from "@/components/ui/SectionLabel";
import { getActiveGeneration } from "@/lib/generation";

export async function PricingTeaser({ locale }: { locale: string }) {
  const t = await getTranslations({ locale, namespace: "home.pricing" });
  const generation = await getActiveGeneration();

  return (
    <section className="border-b border-line py-20 md:py-28">
      <Container>
        <SectionLabel index={t("index")}>{t("label")}</SectionLabel>
        <div className="mt-8 flex flex-col items-start justify-between gap-8 border border-line-strong p-8 md:flex-row md:items-center md:p-12">
          <div>
            <p className="font-mono text-5xl font-medium text-signal tabular-nums">
              {generation.currency} {generation.price}
              <span className="ml-2 text-lg text-fg-faint">/ {t("cycle")}</span>
            </p>
            <p className="mt-3 text-sm text-fg-muted">
              {t("detail", {
                weeks: generation.cycle.weeks,
                sessions: generation.cycle.sessions,
                hours: generation.cycle.hours,
              })}
            </p>
          </div>
          <Button href="/apply">{t("cta")}</Button>
        </div>
      </Container>
    </section>
  );
}
