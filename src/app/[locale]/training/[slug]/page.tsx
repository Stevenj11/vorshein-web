import { getTranslations } from "next-intl/server";
import { notFound } from "next/navigation";
import { CompetitionStatusPanel } from "@/components/events/CompetitionStatusPanel";
import { ManualIcon } from "@/components/icons/ManualIcon";
import { EnrollmentBanner } from "@/components/training/EnrollmentBanner";
import { Link } from "@/i18n/navigation";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { ImagePlaceholder } from "@/components/ui/ImagePlaceholder";
import { SectionLabel } from "@/components/ui/SectionLabel";
import { BRAND } from "@/lib/brand";
import { getActiveGeneration } from "@/lib/generation";
import { getProgram, PROGRAMS } from "@/lib/programs";
import {
  PROGRAM_APNEA_IMAGE,
  PROGRAM_BREATHING_IMAGE,
  PROGRAM_CERTIFICATION_IMAGE,
  PROGRAM_COMPETITION_IMAGE,
  PROGRAM_EQUIPMENT_IMAGE,
  PROGRAM_FACILITY_IMAGE,
  PROGRAM_HERO_IMAGE,
  PROGRAM_UNDERWATER_IMAGE,
  PROGRAM_WATER_IMAGE,
} from "@/lib/media";

export function generateStaticParams() {
  return PROGRAMS.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  const program = getProgram(slug);
  if (!program) return {};
  const tp = await getTranslations({ locale, namespace: "programs" });
  return { title: `${tp(`${program.slug}.name`)} — ${BRAND.name}` };
}

function DetailSection({
  index,
  heading,
  image,
  reverse = false,
  children,
}: {
  index: string;
  heading: string;
  image: { label: string; spec: string; src?: string };
  reverse?: boolean;
  children: React.ReactNode;
}) {
  return (
    <section className="border-b border-line py-20 md:py-28">
      <Container>
        <SectionLabel index={index}>{heading}</SectionLabel>
        <div className="mt-8 grid grid-cols-1 gap-10 md:grid-cols-12">
          <div className={`md:col-span-7 ${reverse ? "md:order-2" : ""}`}>
            {children}
          </div>
          <div className={`md:col-span-5 ${reverse ? "md:order-1" : ""}`}>
            <ImagePlaceholder
              label={image.label}
              spec={image.spec}
              aspect="aspect-[4/5]"
              src={image.src}
            />
          </div>
        </div>
      </Container>
    </section>
  );
}

export default async function ProgramDetailPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  const program = getProgram(slug);
  if (!program) notFound();

  const tp = await getTranslations({ locale, namespace: "programs" });
  const tm = await getTranslations({ locale, namespace: "manual" });
  const td = await getTranslations({ locale, namespace: "programDetail" });
  const te = await getTranslations({ locale, namespace: "enrollment" });
  const tl = await getTranslations({
    locale,
    namespace: `programDetail.levels.${program.slug}`,
  });

  const focus = tp.raw(`${program.slug}.focus`) as string[];
  const improvements = tl.raw("improvements") as string[];
  const generation = await getActiveGeneration();
  const capacity = generation.capacities[program.slug];

  const isTactical = program.slug === "tactical";
  const isFoundation = program.slug === "foundation";
  const hasUnderwater = program.slug !== "foundation";

  let sectionIndex = 1;
  const nextIndex = () => String(sectionIndex++).padStart(2, "0");

  return (
    <div>
      <section className="border-b border-line py-20 md:py-28">
        <Container>
          <Link
            href="/training"
            className="font-mono text-xs uppercase tracking-[0.2em] text-fg-faint transition-colors hover:text-fg"
          >
            {td("back")}
          </Link>

          <div className="mt-8 grid grid-cols-1 gap-10 md:grid-cols-12">
            <div className="md:col-span-7">
              <SectionLabel index={program.level}>
                {tp(`${program.slug}.subtitle`)}
              </SectionLabel>
              <h1 className="mt-6 text-5xl font-extrabold tracking-tight md:text-7xl">
                {tp(`${program.slug}.name`)}
              </h1>
              <p className="mt-6 max-w-xl text-lg text-fg-muted">
                {tp(`${program.slug}.forWhom`)}
              </p>

              <div className="mt-8 grid grid-cols-3 gap-x-6 gap-y-5 sm:grid-cols-5">
                {[
                  { value: String(generation.cycle.weeks), label: td("weeksLabel") },
                  { value: String(generation.cycle.sessions), label: td("sessionsLabel") },
                  { value: String(generation.cycle.hours), label: td("hoursLabel") },
                  { value: `${capacity.min}–${capacity.max}`, label: td("athletesLabel") },
                  { value: `${generation.currency} ${generation.price}`, label: td("priceLabel") },
                ].map((stat) => (
                  <div key={stat.label}>
                    <p className="font-mono text-2xl font-semibold text-signal">{stat.value}</p>
                    <span className="mt-1 block font-mono text-[10px] uppercase tracking-[0.15em] text-fg-faint">
                      {stat.label}
                    </span>
                  </div>
                ))}
              </div>
              <p className="mt-4 font-mono text-xs uppercase tracking-[0.2em] text-fg-faint">
                {te("days")} · {capacity.scheduleTime}
              </p>

              <div className="mt-9 flex flex-wrap gap-4">
                <Button href="/assessment">{td("reserve")}</Button>
              </div>
            </div>

            <div className="md:col-span-5">
              <ImagePlaceholder
                label={td("mediaHero")}
                spec="4:5 · 1080×1350"
                aspect="aspect-[4/5]"
                src={PROGRAM_HERO_IMAGE[program.slug]}
              />
            </div>
          </div>
        </Container>
      </section>

      <section className="border-b border-line py-10">
        <Container>
          <EnrollmentBanner locale={locale} slug={program.slug} />
        </Container>
      </section>

      {isFoundation && (
        <section className="border-b border-line py-20 md:py-28">
          <Container>
            <SectionLabel index={nextIndex()}>{tl("entryProfile.heading")}</SectionLabel>
            <p className="mt-6 max-w-2xl text-fg-muted">{tl("entryProfile.intro")}</p>
            <div className="mt-8 grid grid-cols-1 gap-px overflow-hidden border border-line bg-line sm:grid-cols-2">
              {(tl.raw("entryProfile.items") as string[]).map((item, i) => (
                <div
                  key={item}
                  className="flex items-start gap-4 bg-void px-6 py-5 text-sm text-fg-muted"
                >
                  <span className="mt-0.5 font-mono text-[10px] text-signal">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  {item}
                </div>
              ))}
            </div>
            <p className="mt-6 max-w-2xl border-t border-line pt-6 text-sm text-fg-faint">
              {tl("entryProfile.note")}
            </p>
          </Container>
        </section>
      )}

      <section className="border-b border-line py-20 md:py-28">
        <Container>
          <SectionLabel index={nextIndex()}>{td("curriculum")}</SectionLabel>
          <div className="mt-8 grid grid-cols-1 gap-px overflow-hidden border border-line bg-line sm:grid-cols-2">
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
        </Container>
      </section>

      <section className="border-b border-line py-20 md:py-28">
        <Container>
          <SectionLabel index={nextIndex()}>
            {td("methodologyHeading")}
          </SectionLabel>
          <div className="mt-8 grid grid-cols-1 gap-10 md:grid-cols-12">
            <div className="md:col-span-4">
              <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-fg-faint">
                {td("durationLabel")}
              </span>
              <p className="mt-2 text-lg font-medium text-signal">
                {tl("duration")}
              </p>
            </div>
            <div className="md:col-span-8">
              <p className="text-fg-muted">{tl("methodology")}</p>
            </div>
          </div>
        </Container>
      </section>

      {isFoundation && (
        <section className="border-b border-line py-20 md:py-28">
          <Container>
            <SectionLabel index={nextIndex()}>
              {td("sessionStructure.heading")}
            </SectionLabel>
            <div className="mt-10 grid grid-cols-1 gap-px overflow-hidden border border-line bg-line sm:grid-cols-3">
              {[
                { duration: "30", label: td("sessionStructure.warmupLabel") },
                { duration: "30", label: td("sessionStructure.physicalLabel") },
                { duration: "60", label: td("sessionStructure.aquaticLabel") },
              ].map((block) => (
                <div
                  key={block.label}
                  className="flex flex-col items-center justify-center gap-1 bg-void px-6 py-12 text-center transition-colors duration-300 hover:bg-panel"
                >
                  <span className="font-mono text-5xl font-semibold text-signal">
                    {block.duration}
                  </span>
                  <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-fg-faint">
                    MIN
                  </span>
                  <span className="mt-3 text-sm text-fg-muted">{block.label}</span>
                </div>
              ))}
            </div>
          </Container>
        </section>
      )}

      {isFoundation && (
        <section className="border-b border-line py-20 md:py-28">
          <Container>
            <SectionLabel index={nextIndex()}>{tl("roadmap.heading")}</SectionLabel>
            <div className="mt-10 grid grid-cols-1 gap-6 md:grid-cols-4">
              {(
                tl.raw("roadmap.weeks") as {
                  label: string;
                  title: string;
                  items: string[];
                }[]
              ).map((week) => (
                <div key={week.label} className="border border-line-strong p-6">
                  <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-signal">
                    {week.label}
                  </span>
                  <h3 className="mt-2 text-lg font-semibold">{week.title}</h3>
                  <ul className="mt-4 flex flex-col gap-2">
                    {week.items.map((item) => (
                      <li key={item} className="text-sm text-fg-muted">
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </Container>
        </section>
      )}

      <section className="border-b border-line py-20 md:py-28">
        <Container>
          <SectionLabel index={nextIndex()}>{td("improvementsHeading")}</SectionLabel>
          <div className="mt-8 grid grid-cols-1 gap-px overflow-hidden border border-line bg-line sm:grid-cols-2">
            {improvements.map((item, i) => (
              <div
                key={item}
                className="flex items-start gap-4 bg-void px-6 py-5 text-sm text-fg-muted"
              >
                <span className="mt-0.5 font-mono text-[10px] text-signal">
                  {String(i + 1).padStart(2, "0")}
                </span>
                {item}
              </div>
            ))}
          </div>
        </Container>
      </section>

      <section className="border-b border-line py-20 md:py-28">
        <Container>
          <SectionLabel index={nextIndex()}>{td("whatYoullTrain")}</SectionLabel>
          <div className="mt-8 grid grid-cols-1 gap-px overflow-hidden border border-line bg-line sm:grid-cols-2 lg:grid-cols-3">
            {program.relatedModules.map((n, i) => (
              <div key={n} className="flex items-start gap-4 bg-void p-6">
                <ManualIcon n={n} className="mt-1 h-6 w-6 shrink-0 text-signal" />
                <div>
                  <span className="font-mono text-[10px] text-fg-faint">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <h3 className="text-base font-semibold">{tm(`${n}.name`)}</h3>
                  <p className="mt-1 text-sm text-fg-muted">
                    {tm(`${n}.description`)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {isTactical ? (
        <DetailSection
          index={nextIndex()}
          heading={td("apneaHeading")}
          image={{
            label: td("mediaApnea"),
            spec: "4:5 · 1080×1350",
            src: PROGRAM_APNEA_IMAGE[program.slug],
          }}
        >
          {(tl.raw("apnea.body") as string[]).map((p) => (
            <p key={p} className="mt-4 text-fg-muted first:mt-0">
              {p}
            </p>
          ))}
          <div className="mt-6 border border-line-strong px-6 py-4">
            <span className="font-mono text-[11px] uppercase tracking-[0.2em] text-signal">
              {td("apneaSafetyLabel")}
            </span>
            <p className="mt-1 text-sm text-fg-muted">
              {tl("apnea.safetyNote")}
            </p>
          </div>
        </DetailSection>
      ) : (
        <DetailSection
          index={nextIndex()}
          heading={td("breathingHeading")}
          image={{
            label: td("mediaBreathing"),
            spec: "4:5 · 1080×1350",
            src: PROGRAM_BREATHING_IMAGE[program.slug],
          }}
        >
          <p className="text-fg-muted">{tl("breathing.body")}</p>
        </DetailSection>
      )}

      {hasUnderwater && (
        <DetailSection
          index={nextIndex()}
          heading={td("underwaterHeading")}
          image={{
            label: td("mediaUnderwater"),
            spec: "4:5 · 1080×1350",
            src: PROGRAM_UNDERWATER_IMAGE[program.slug],
          }}
          reverse
        >
          <p className="text-fg-muted">{tl("underwater.body")}</p>
        </DetailSection>
      )}

      {isTactical && (
        <DetailSection
          index={nextIndex()}
          heading={td("competitionPrepHeading")}
          image={{
            label: td("mediaCompetition"),
            spec: "4:5 · 1080×1350",
            src: PROGRAM_COMPETITION_IMAGE[program.slug],
          }}
        >
          <p className="text-fg-muted">{tl("competitionPrep.body")}</p>
          <p className="mt-4 font-mono text-xs text-fg-faint">
            {td("competitionPrepDisclaimer")}
          </p>
        </DetailSection>
      )}

      <DetailSection
        index={nextIndex()}
        heading={tl("certification.sectionHeading")}
        image={{
          label: td("mediaCertification"),
          spec: "4:5 · 1080×1350",
          src: PROGRAM_CERTIFICATION_IMAGE[program.slug],
        }}
        reverse={isTactical || !hasUnderwater}
      >
        <div className="flex flex-col gap-6">
          {isFoundation && (
            <div>
              <h3 className="text-2xl font-bold tracking-tight">
                {tl("certification.headline")}
              </h3>
              <p className="mt-2 text-fg-muted">{tl("certification.intro")}</p>
            </div>
          )}

          <div>
            <span className="font-mono text-[11px] uppercase tracking-[0.2em] text-fg-faint">
              {td("certificationFormatLabel")}
            </span>
            <p className="mt-1 text-fg-muted">{tl("certification.format")}</p>
          </div>

          <div className="flex flex-wrap items-center gap-3 border border-line-strong px-6 py-5">
            <span className="font-mono text-sm uppercase tracking-[0.15em] text-fg">
              {tl("certification.resultLabel")}
            </span>
            <span className="text-fg-faint">→</span>
            <span className="font-mono text-sm uppercase tracking-[0.15em] text-signal">
              {tl("certification.unlockLabel")}
            </span>
          </div>

          {isFoundation && (
            <div className="border border-dashed border-line-strong px-6 py-4">
              <span className="font-mono text-[11px] uppercase tracking-[0.2em] text-fg-faint">
                {tl("certification.retainedLabel")}
              </span>
              <p className="mt-1 text-sm text-fg-muted">
                {tl("certification.retainedNote")}
              </p>
            </div>
          )}

          <div>
            <span className="font-mono text-[11px] uppercase tracking-[0.2em] text-fg-faint">
              {td("certificationUnlocksLabel")}
            </span>
            <p className="mt-1 text-fg-muted">{tl("certification.unlocks")}</p>
          </div>
        </div>
      </DetailSection>

      <section className="border-b border-line py-20 md:py-28">
        <Container>
          <SectionLabel index={nextIndex()}>{td("gallery")}</SectionLabel>
          <div className="mt-8 grid grid-cols-2 gap-4 md:grid-cols-3">
            <ImagePlaceholder
              label={td("mediaFacility")}
              spec="1:1 · 1200×1200"
              aspect="aspect-square"
              src={PROGRAM_FACILITY_IMAGE[program.slug]}
            />
            <ImagePlaceholder
              label={td("mediaEquipment")}
              spec="1:1 · 1200×1200"
              aspect="aspect-square"
              src={PROGRAM_EQUIPMENT_IMAGE[program.slug]}
            />
            <ImagePlaceholder
              label={td("mediaWater")}
              spec="1:1 · 1200×1200"
              aspect="aspect-square"
              className="col-span-2 md:col-span-1"
              src={PROGRAM_WATER_IMAGE[program.slug]}
            />
          </div>
        </Container>
      </section>

      <section className="py-20 md:py-28">
        <Container>
          <CompetitionStatusPanel locale={locale} />
        </Container>
      </section>
    </div>
  );
}
