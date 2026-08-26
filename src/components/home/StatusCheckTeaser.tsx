import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { SectionLabel } from "@/components/ui/SectionLabel";

export function StatusCheckTeaser() {
  const t = useTranslations("home.statusCheck");

  return (
    <section className="border-b border-line py-20 md:py-24">
      <Container className="flex flex-col items-center text-center">
        <SectionLabel index={t("index")}>{t("label")}</SectionLabel>
        <h2 className="mt-6 max-w-xl text-balance text-2xl font-semibold tracking-tight md:text-3xl">
          {t("heading")}
        </h2>
        <p className="mt-3 max-w-sm text-sm text-fg-muted">{t("body")}</p>
        <div className="mt-7">
          <Button href="/estado" variant="ghost">
            {t("cta")}
          </Button>
        </div>
      </Container>
    </section>
  );
}
