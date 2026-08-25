import { getTranslations } from "next-intl/server";
import { Suspense } from "react";
import { StatusChecker } from "@/components/applications/StatusChecker";
import { Container } from "@/components/ui/Container";
import { SectionLabel } from "@/components/ui/SectionLabel";
import { BRAND } from "@/lib/brand";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "statusCheck" });
  return { title: `${t("label")} — ${BRAND.name}` };
}

export default async function StatusPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "statusCheck" });

  return (
    <Container className="py-24 md:py-32">
      <div className="mx-auto w-full max-w-xl text-center">
        <SectionLabel index="00">{t("label")}</SectionLabel>
        <h1 className="mt-8 text-balance text-4xl font-extrabold tracking-tight md:text-5xl">
          {t("heading")}
        </h1>
        <p className="mt-5 text-fg-muted">{t("body")}</p>

        <div className="mt-12">
          <Suspense fallback={null}>
            <StatusChecker />
          </Suspense>
        </div>
      </div>
    </Container>
  );
}
