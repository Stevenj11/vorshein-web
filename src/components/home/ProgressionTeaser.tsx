import { getTranslations } from "next-intl/server";
import { Container } from "@/components/ui/Container";
import { SectionLabel } from "@/components/ui/SectionLabel";

export async function ProgressionTeaser({ locale }: { locale: string }) {
  const t = await getTranslations({ locale, namespace: "home.progression" });
  const steps = ["entry", "foundation", "performance", "tactical", "competition"];

  return (
    <section className="border-b border-line py-20 md:py-28">
      <Container>
        <SectionLabel index={t("index")}>{t("label")}</SectionLabel>
        <h2 className="mt-6 max-w-2xl text-balance text-3xl font-extrabold tracking-tight md:text-4xl">
          {t("heading")}
        </h2>
        <div className="mt-10 flex flex-wrap items-center gap-3">
          {steps.map((step, i) => (
            <div key={step} className="flex items-center gap-3">
              <span className="border border-line-strong px-4 py-2 font-mono text-xs uppercase tracking-[0.15em] text-fg">
                {t(step)}
              </span>
              {i < steps.length - 1 && <span className="text-fg-faint">→</span>}
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}
