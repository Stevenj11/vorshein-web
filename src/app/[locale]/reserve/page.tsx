import { getTranslations } from "next-intl/server";
import { BookingForm } from "@/components/booking/BookingForm";
import { Container } from "@/components/ui/Container";
import { SectionLabel } from "@/components/ui/SectionLabel";
import { BRAND } from "@/lib/brand";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "booking" });
  return { title: `${t("label")} — ${BRAND.name}` };
}

export default async function ReservePage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ level?: string; path?: string }>;
}) {
  const { locale } = await params;
  const { level, path } = await searchParams;
  const t = await getTranslations({ locale, namespace: "booking" });
  const tl = await getTranslations({ locale, namespace: "scoring.levelName" });

  const isKnownLevel =
    level === "BASIC" || level === "INTERMEDIATE" || level === "ADVANCED";
  const levelDisplay = isKnownLevel ? tl(level) : undefined;

  return (
    <Container className="py-24 md:py-32">
      <div className="mx-auto w-full max-w-xl">
        <SectionLabel index="00">{t("label")}</SectionLabel>
        <h1 className="mt-8 text-balance text-4xl font-extrabold tracking-tight md:text-5xl">
          {t("heading")}
        </h1>
        <p className="mt-5 text-fg-muted">
          {level ? t("fromResultBody") : t("body")}
        </p>

        <div className="mt-12">
          <BookingForm
            level={level}
            levelDisplay={levelDisplay}
            recommendedPath={path}
          />
        </div>
      </div>
    </Container>
  );
}
