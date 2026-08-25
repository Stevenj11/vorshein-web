import { getTranslations } from "next-intl/server";
import { Container } from "@/components/ui/Container";
import { SectionLabel } from "@/components/ui/SectionLabel";
import { getActiveGeneration } from "@/lib/generation";
import { occupancy } from "@/lib/members/store";

export async function Gen001Teaser({ locale }: { locale: string }) {
  const t = await getTranslations({ locale, namespace: "home.gen001" });
  const generation = await getActiveGeneration();
  const occ = await occupancy(generation.id);

  const rows: [string, string][] = [
    ["FOUNDATION", `${occ.foundation}/${generation.capacities.foundation.max}`],
    ["PERFORMANCE", `${occ.performance}/${generation.capacities.performance.max}`],
    ["TACTICAL", `${occ.tactical}/${generation.capacities.tactical.max}`],
  ];

  return (
    <section className="border-b border-line py-20 md:py-28">
      <Container>
        <SectionLabel index={t("index")}>{t("label")}</SectionLabel>
        <h2 className="mt-6 text-4xl font-extrabold tracking-tight md:text-5xl">
          {generation.name}
        </h2>
        <p className="mt-3 font-mono text-xs uppercase tracking-[0.2em] text-fg-faint">
          {generation.location}
        </p>
        <p className="mt-5 max-w-xl text-fg-muted">{t("body")}</p>

        <div className="mt-8 grid grid-cols-1 gap-px overflow-hidden border border-line bg-line sm:grid-cols-3">
          {rows.map(([label, value]) => (
            <div key={label} className="bg-void p-6 text-center">
              <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-fg-faint">
                {label}
              </p>
              <p className="mt-2 font-mono text-3xl text-signal tabular-nums">{value}</p>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}
