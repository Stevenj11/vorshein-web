import { getTranslations } from "next-intl/server";
import { Container } from "@/components/ui/Container";
import { SectionLabel } from "@/components/ui/SectionLabel";
import { BRAND } from "@/lib/brand";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  return { title: `${BRAND.name} — ${(await getTranslations({ locale, namespace: "vorsheinPage" }))("philosophyLabel")}` };
}

const PILLAR_KEYS = ["control", "endurance", "performance"] as const;

export default async function VorsheinPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "vorsheinPage" });
  const ts = await getTranslations({ locale, namespace: "stats" });

  const stats = [
    { value: "03", label: ts("levels") },
    { value: "10", label: ts("modules") },
    { value: "01", label: ts("system") },
  ];

  return (
    <div>
      <section className="border-b border-line py-24 md:py-32">
        <Container>
          <SectionLabel index="00">{t("label")}</SectionLabel>
          <h1 className="mt-8 max-w-3xl text-balance text-4xl font-extrabold leading-tight tracking-tight md:text-6xl">
            {t("heading")}
          </h1>
          <p className="mt-8 max-w-2xl text-lg text-fg-muted">{t("intro")}</p>

          <div className="mt-12 grid grid-cols-3 divide-x divide-line border-y border-line py-5 sm:max-w-md">
            {stats.map((stat) => (
              <div key={stat.label} className="px-5 first:pl-0">
                <div className="font-mono text-2xl font-medium text-signal tabular-nums">
                  {stat.value}
                </div>
                <div className="mt-1 font-mono text-[10px] uppercase tracking-[0.15em] text-fg-faint">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </Container>
      </section>

      <section className="border-b border-line py-24 md:py-32">
        <Container>
          <SectionLabel index="01">{t("philosophyLabel")}</SectionLabel>
          <div className="mt-10 grid grid-cols-1 gap-px overflow-hidden border border-line bg-line md:grid-cols-3">
            {PILLAR_KEYS.map((key, i) => (
              <div key={key} className="bg-void p-8">
                <span className="font-mono text-xs text-fg-faint">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <h3 className="mt-3 text-xl font-bold">
                  {t(`pillars.${key}.name`)}
                </h3>
                <p className="mt-4 text-sm text-fg-muted">
                  {t(`pillars.${key}.text`)}
                </p>
              </div>
            ))}
          </div>
        </Container>
      </section>

      <section className="border-b border-line py-24 md:py-32">
        <Container>
          <div className="grid grid-cols-1 gap-10 md:grid-cols-12">
            <div className="md:col-span-4">
              <SectionLabel index="02">{t("methodologyLabel")}</SectionLabel>
            </div>
            <div className="md:col-span-8">
              <p className="max-w-2xl text-fg-muted">{t("methodologyP1")}</p>
              <p className="mt-5 max-w-2xl text-fg-muted">
                {t("methodologyP2Prefix")}{" "}
                <span className="text-fg">{t("methodologyP2Highlight")}</span>{" "}
                {t("methodologyP2Suffix")}
              </p>
            </div>
          </div>
        </Container>
      </section>

      <section className="py-24 md:py-32">
        <Container>
          <div className="grid grid-cols-1 gap-10 md:grid-cols-12">
            <div className="md:col-span-4">
              <SectionLabel index="03">{t("founderLabel")}</SectionLabel>
            </div>
            <div className="md:col-span-8">
              <p className="max-w-2xl text-fg-muted">
                {t("founderText", { name: BRAND.founder })}
              </p>
            </div>
          </div>
        </Container>
      </section>
    </div>
  );
}
