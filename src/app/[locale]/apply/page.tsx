import { getTranslations } from "next-intl/server";
import { ApplicationForm } from "@/components/applications/ApplicationForm";
import { Container } from "@/components/ui/Container";
import { SectionLabel } from "@/components/ui/SectionLabel";
import { BRAND } from "@/lib/brand";
import { getActiveGeneration } from "@/lib/generation";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "apply" });
  return { title: `${t("label")} — ${BRAND.name}` };
}

export default async function ApplyPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "apply" });
  const generation = await getActiveGeneration();

  return (
    <Container className="py-24 md:py-32">
      <div className="mx-auto w-full max-w-xl">
        <SectionLabel index="00">{t("label")}</SectionLabel>
        <h1 className="mt-8 text-balance text-4xl font-extrabold tracking-tight md:text-5xl">
          {t("heading")}
        </h1>
        <p className="mt-5 text-fg-muted">{t("body")}</p>

        <div className="mt-12">
          <ApplicationForm
            price={generation.price}
            currency={generation.currency}
            whatsappNumber={generation.whatsappNumber}
          />
        </div>
      </div>
    </Container>
  );
}
