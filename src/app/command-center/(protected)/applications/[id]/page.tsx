import Link from "next/link";
import { notFound } from "next/navigation";
import { getApplication } from "@/lib/applications/store";
import { ApplicationStatus } from "@/lib/applications/types";
import { APPLICATION_STATUS_LABEL } from "@/lib/commandCenterLabels";
import { formatWeekdayDate } from "@/lib/enrollment";
import { ApplicationRowActions } from "../ApplicationRowActions";

const PIPELINE_STAGES = ["Solicitud", "Llegada", "Pago", "Evaluación", "Nivel", "Admisión"];

function pipelineStageIndex(status: ApplicationStatus): number {
  switch (status) {
    case "RESERVED":
    case "CONFIRMED":
      return 0;
    case "CHECKED_IN":
    case "SIGNED":
      return 1;
    case "PAID":
      return 2;
    case "ASSESSED":
    case "MANUAL_REVIEW":
      return 3;
    case "ADMITTED":
      return 5;
    default:
      return -1;
  }
}

export default async function ApplicationDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const application = await getApplication(id.toUpperCase());
  if (!application) notFound();

  const rejected =
    application.status === "NOT_YET_ELIGIBLE" ||
    application.status === "NO_SHOW" ||
    application.status === "WAITLIST";
  const currentStage = pipelineStageIndex(application.status);

  return (
    <div className="mx-auto max-w-2xl">
      <Link
        href="/command-center/applications"
        className="font-mono text-[11px] uppercase tracking-[0.15em] text-white/40 hover:text-white"
      >
        ← Todas las Postulaciones
      </Link>

      <div className="mt-4 border border-white/10 p-5">
        <p className="font-mono text-xs text-cyan-400">{application.id}</p>
        <h1 className="mt-1 text-2xl font-semibold text-white">
          {application.firstName} {application.lastName}
        </h1>
        <p className="mt-1 font-mono text-xs text-white/50">
          División {application.division} · {application.preliminaryLevel}
          {application.officialLevel ? ` → ${application.officialLevel.toUpperCase()}` : " // PRELIMINAR"}
        </p>
        <p className="mt-3 font-mono text-[10px] uppercase tracking-[0.15em] text-white/40">
          {formatWeekdayDate(application.turnDateISO, "es")} · {application.turnTimeSlot}
        </p>
      </div>

      <div className="mt-6 border border-white/10 p-5">
        <p className="mb-4 font-mono text-[10px] uppercase tracking-[0.15em] text-white/40">
          Estado del Proceso
        </p>
        {rejected ? (
          <p className="font-mono text-xs uppercase tracking-[0.15em] text-red-400">
            {APPLICATION_STATUS_LABEL[application.status] ?? application.status} — sin avance en el proceso
          </p>
        ) : (
          <div className="flex flex-wrap items-center gap-2">
            {PIPELINE_STAGES.map((label, i) => {
              const reached = i <= currentStage;
              const isCurrent = i === currentStage;
              return (
                <div key={label} className="flex items-center gap-2">
                  <span
                    className={`border px-3 py-1.5 font-mono text-[10px] uppercase tracking-[0.1em] ${
                      isCurrent
                        ? "border-white bg-white text-black"
                        : reached
                          ? "border-white/40 text-white/70"
                          : "border-white/10 text-white/30"
                    }`}
                  >
                    {label}
                  </span>
                  {i < PIPELINE_STAGES.length - 1 && (
                    <span className="text-white/20">→</span>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>

      <div className="mt-6 border border-white/10 p-5">
        <p className="mb-3 font-mono text-[10px] uppercase tracking-[0.15em] text-white/40">
          Siguiente Paso
        </p>
        <ApplicationRowActions
          id={application.id}
          status={application.status}
          preliminaryLevel={application.preliminaryLevel}
          whatsapp={application.whatsapp}
          turnDateISO={application.turnDateISO}
          turnTimeSlot={application.turnTimeSlot}
        />
      </div>

      <div className="mt-6 grid grid-cols-2 gap-3 font-mono text-xs">
        <div className="border border-white/10 p-3">
          <p className="text-white/40">WhatsApp</p>
          <a
            href={`https://wa.me/${application.whatsapp.replace(/\D/g, "")}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-emerald-400 hover:underline"
          >
            {application.whatsapp}
          </a>
        </div>
        <div className="border border-white/10 p-3">
          <p className="text-white/40">Edad</p>
          <p className="text-white">{application.age}</p>
        </div>
        <div className="border border-white/10 p-3">
          <p className="text-white/40">Pago</p>
          <p className="text-white">
            {application.paymentStatus
              ? `${application.paymentStatus} ${application.paymentAmount ? `— Bs ${application.paymentAmount}` : ""}`
              : "Pendiente"}
          </p>
        </div>
        <div className="border border-white/10 p-3">
          <p className="text-white/40">Miembro</p>
          <p className="text-white">{application.memberId ?? "—"}</p>
        </div>
      </div>
    </div>
  );
}
