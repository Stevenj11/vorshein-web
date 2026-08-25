import { getTranslations } from "next-intl/server";
import { Container } from "@/components/ui/Container";
import { SectionLabel } from "@/components/ui/SectionLabel";

export async function HowItWorksTeaser({ locale }: { locale: string }) {
  const t = await getTranslations({ locale, namespace: "home.howItWorks" });
  const steps = ["step1", "step2", "step3"] as const;

  return (
    <section className="border-b border-line py-20 md:py-28">
      <Container>
        <SectionLabel index={t("index")}>{t("label")}</SectionLabel>
        <div className="mt-8 grid grid-cols-1 gap-px overflow-hidden border border-line bg-line sm:grid-cols-3">
          {steps.map((step, i) => (
            <div key={step} className="bg-void p-6">
              <span className="font-mono text-xs text-signal">{String(i + 1).padStart(2, "0")}</span>
              <h3 className="mt-3 text-lg font-semibold">{t(`${step}.title`)}</h3>
              <p className="mt-2 text-sm text-fg-muted">{t(`${step}.body`)}</p>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}
