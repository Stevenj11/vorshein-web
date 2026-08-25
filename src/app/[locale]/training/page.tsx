import { getTranslations } from "next-intl/server";
import { EnrollmentBanner } from "@/components/training/EnrollmentBanner";
import { Link } from "@/i18n/navigation";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { SectionLabel } from "@/components/ui/SectionLabel";
import { BRAND } from "@/lib/brand";
import { PROGRAMS } from "@/lib/programs";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "trainingPage" });
  return { title: `${t("label")} — ${BRAND.name}` };
}

export default async function TrainingPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "trainingPage" });
  const tp = await getTranslations({ locale, namespace: "programs" });

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

      {PROGRAMS.map((program) => {
        const focus = tp.raw(`${program.slug}.focus`) as string[];
        return (
          <section
            key={program.slug}
            id={program.slug}
            className="scroll-mt-20 border-b border-line py-24 md:py-32"
          >
            <Container>
              <div className="grid grid-cols-1 gap-10 md:grid-cols-12">
                <div className="md:col-span-4">
                  <SectionLabel index={program.level}>
                    {tp(`${program.slug}.subtitle`)}
                  </SectionLabel>
                  <h2 className="mt-6 text-4xl font-extrabold tracking-tight">
                    {tp(`${program.slug}.name`)}
                  </h2>
                  <p className="mt-5 text-fg-muted">
                    {tp(`${program.slug}.forWhom`)}
                  </p>
                  <div className="mt-8 flex flex-col items-start gap-4">
                    <Button href="/assessment" variant="ghost">
                      {t("cta")}
                    </Button>
                    <Link
                      href={`/training/${program.slug}`}
                      className="font-mono text-xs uppercase tracking-[0.2em] text-fg-muted transition-colors hover:text-signal"
                    >
                      {t("viewFullProgram")}
                    </Link>
                  </div>
                </div>

                <div className="md:col-span-8">
                  <div className="grid grid-cols-1 gap-px overflow-hidden border border-line bg-line sm:grid-cols-2">
                    {focus.map((item, i) => (
                      <div
                        key={item}
                        className="flex items-center gap-4 bg-void px-6 py-5 text-sm text-fg-muted"
                      >
                        <span className="font-mono text-[10px] text-fg-faint">
                          {String(i + 1).padStart(2, "0")}
                        </span>
                        {item}
                      </div>
                    ))}
                  </div>

                  <div className="mt-6">
                    <EnrollmentBanner locale={locale} slug={program.slug} />
                  </div>
                </div>
              </div>
            </Container>
          </section>
        );
      })}
    </div>
  );
}
