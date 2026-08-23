import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { SectionLabel } from "@/components/ui/SectionLabel";

export function AssessmentBanner() {
  const t = useTranslations("home.assessment");

  return (
    <section className="relative overflow-hidden border-b border-line py-24 md:py-32">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_50%_0%,rgba(76,201,240,0.10),transparent_55%)]" />
      <Container className="relative flex flex-col items-center text-center">
        <SectionLabel index={t("index")}>{t("label")}</SectionLabel>
        <h2 className="mt-8 max-w-2xl text-balance text-4xl font-extrabold tracking-tight md:text-5xl">
          {t("heading")}
        </h2>
        <p className="mt-5 max-w-md text-fg-muted">{t("body")}</p>
        <div className="mt-9">
          <Button href="/assessment">{t("cta")}</Button>
        </div>
      </Container>
    </section>
  );
}
