import { getTranslations } from "next-intl/server";
import { AssessmentFlow } from "@/components/assessment/AssessmentFlow";
import { Container } from "@/components/ui/Container";
import { BRAND } from "@/lib/brand";
import { getActiveGeneration } from "@/lib/generation";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "assessment.intro" });
  return { title: `${t("heading")} — ${BRAND.name}` };
}

export default async function AssessmentPage() {
  const generation = await getActiveGeneration();
  return (
    <Container className="py-24 md:py-32">
      <AssessmentFlow
        eligibility={generation.eligibility}
        generationName={generation.name}
        generationLocation={generation.location}
      />
    </Container>
  );
}
