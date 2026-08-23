import { getTranslations } from "next-intl/server";
import { CompetitionStatusPanel } from "@/components/events/CompetitionStatusPanel";
import { Container } from "@/components/ui/Container";
import { SectionLabel } from "@/components/ui/SectionLabel";
import { BRAND } from "@/lib/brand";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "eventsPage" });
  return { title: `${t("label")} — ${BRAND.name}` };
}

export default async function EventsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "eventsPage" });
  const components = t.raw("components") as string[];
  const pathSteps = t.raw("pathSteps") as string[];

  return (
    <div>
      <section className="border-b border-line py-24 md:py-28">
        <Container>
          <SectionLabel index="00">{t("label")}</SectionLabel>
          <h1 className="mt-8 max-w-2xl text-balance text-4xl font-extrabold tracking-tight md:text-6xl">
            {t("heading")}
          </h1>
          <p className="mt-6 max-w-xl text-fg-muted">{t("sub")}</p>
        </Container>
      </section>

      <section className="border-b border-line py-16 md:py-20">
        <Container>
          <div className="flex flex-col items-start justify-between gap-3 border border-dashed border-line-strong p-8 sm:flex-row sm:items-center md:p-10">
            <div>
              <span className="font-mono text-xs uppercase tracking-[0.2em] text-fg-faint">
                {t("nextEvent")}
              </span>
              <p className="mt-2 font-mono text-2xl uppercase tracking-[0.1em] text-fg-muted">
                {t("comingStatus")}
              </p>
            </div>
          </div>
        </Container>
      </section>

      <section className="border-b border-line py-20 md:py-28">
        <Container>
          <SectionLabel index="01">{t("manualHeading")}</SectionLabel>
          <p className="mt-6 max-w-2xl text-fg-muted">{t("manualIntro")}</p>

          <div className="mt-8 grid grid-cols-1 gap-px overflow-hidden border border-line bg-line sm:grid-cols-2 lg:grid-cols-3">
            {components.map((item, i) => (
              <div
                key={item}
                className="flex items-start gap-4 bg-void px-6 py-5 text-sm text-fg-muted"
              >
                <span className="mt-0.5 font-mono text-[10px] text-signal">
                  {String(i + 1).padStart(2, "0")}
                </span>
                {item}
              </div>
            ))}
          </div>

          <h3 className="mt-16 font-mono text-xs uppercase tracking-[0.2em] text-fg-faint">
            {t("pathHeading")}
          </h3>
          <ol className="mt-6 flex flex-col gap-4">
            {pathSteps.map((step, i) => (
              <li key={step} className="flex items-start gap-4">
                <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center border border-line-strong font-mono text-[10px] text-fg-faint">
                  {i + 1}
                </span>
                <span className="text-fg-muted">{step}</span>
              </li>
            ))}
          </ol>

          <p className="mt-10 border-t border-line pt-6 font-mono text-xs text-fg-faint">
            {t("disclaimer")}
          </p>
        </Container>
      </section>

      <section className="py-16 md:py-20">
        <Container>
          <CompetitionStatusPanel />
        </Container>
      </section>
    </div>
  );
}
