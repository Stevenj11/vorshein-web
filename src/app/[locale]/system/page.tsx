import { getTranslations } from "next-intl/server";
import { ManualAccordion } from "@/components/system/ManualAccordion";
import { Container } from "@/components/ui/Container";
import { SectionLabel } from "@/components/ui/SectionLabel";
import { BRAND } from "@/lib/brand";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "systemPage" });
  return { title: `${t("label")} — ${BRAND.name}` };
}

export default async function SystemPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "systemPage" });

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

      <section className="py-16 md:py-20">
        <Container>
          <ManualAccordion />
        </Container>
      </section>
    </div>
  );
}
