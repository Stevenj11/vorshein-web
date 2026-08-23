import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { Container } from "@/components/ui/Container";
import { SectionLabel } from "@/components/ui/SectionLabel";
import { PROGRAMS } from "@/lib/programs";

export function ProgramsTeaser() {
  const t = useTranslations("home.programs");
  const tp = useTranslations("programs");

  return (
    <section className="border-b border-line py-24 md:py-32">
      <Container>
        <div className="flex items-end justify-between">
          <SectionLabel index={t("index")}>{t("label")}</SectionLabel>
          <Link
            href="/training"
            className="hidden font-mono text-xs uppercase tracking-[0.2em] text-fg-muted transition-colors hover:text-fg md:block"
          >
            {t("viewAll")}
          </Link>
        </div>

        <div className="mt-10 grid grid-cols-1 gap-px overflow-hidden border border-line bg-line md:grid-cols-3">
          {PROGRAMS.map((program, i) => (
            <Link
              key={program.slug}
              href={`/training/${program.slug}`}
              className="group flex flex-col justify-between bg-void p-8 transition-colors hover:bg-panel"
            >
              <div>
                <div className="flex items-center justify-between">
                  <span className="font-mono text-xs text-fg-faint">
                    {program.level}
                  </span>
                  <div className="flex gap-1">
                    {[0, 1, 2].map((dot) => (
                      <span
                        key={dot}
                        className={`h-1 w-1 rounded-full ${
                          dot <= i ? "bg-signal" : "bg-line-strong"
                        }`}
                      />
                    ))}
                  </div>
                </div>
                <h3 className="mt-3 text-xl font-bold tracking-tight">
                  {tp(`${program.slug}.name`)}
                </h3>
                <span className="font-mono text-xs uppercase tracking-[0.2em] text-fg-faint">
                  {tp(`${program.slug}.subtitle`)}
                </span>
                <p className="mt-4 text-sm text-fg-muted">
                  {tp(`${program.slug}.forWhom`)}
                </p>
              </div>
              <span className="mt-8 font-mono text-xs uppercase tracking-[0.2em] text-fg-muted transition-colors group-hover:text-signal">
                {t("viewProgram")}
              </span>
            </Link>
          ))}
        </div>
      </Container>
    </section>
  );
}
