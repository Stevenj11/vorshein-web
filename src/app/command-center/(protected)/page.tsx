import { listApplications } from "@/lib/applications/store";
import { GENERATION_STATUS_LABEL } from "@/lib/commandCenterLabels";
import { getActiveGeneration } from "@/lib/generation";
import { occupancy } from "@/lib/members/store";

function Stat({ label, value, accent }: { label: string; value: string | number; accent?: boolean }) {
  return (
    <div className="border border-white/10 p-4">
      <p className="font-mono text-[10px] uppercase tracking-[0.15em] text-white/40">{label}</p>
      <p className={`mt-1 text-2xl font-bold tabular-nums ${accent ? "text-cyan-400" : "text-white"}`}>
        {value}
      </p>
    </div>
  );
}

export default async function DashboardPage() {
  const [applications, generation] = await Promise.all([
    listApplications(),
    getActiveGeneration(),
  ]);
  const occ = await occupancy(generation.id);

  const byStatus = (status: string) => applications.filter((a) => a.status === status).length;
  const pendingReview = applications.filter((a) => a.status === "MANUAL_REVIEW").length;
  const pendingWhatsapp = applications.filter((a) => a.status === "RESERVED").length;

  return (
    <div className="flex flex-col gap-6">
      <div>
        <p className="font-mono text-xs uppercase tracking-[0.2em] text-cyan-400">
          {generation.name} — {GENERATION_STATUS_LABEL[generation.status] ?? generation.status.replaceAll("_", " ")}
        </p>
        <p className="mt-1 text-sm text-white/50">{generation.location}</p>
      </div>

      {(pendingReview > 0 || pendingWhatsapp > 0) && (
        <div className="border border-cyan-400/40 bg-cyan-400/5 p-4">
          <p className="font-mono text-[11px] uppercase tracking-[0.15em] text-cyan-400">Alertas</p>
          <ul className="mt-2 space-y-1 text-sm text-white/70">
            {pendingReview > 0 && <li>{pendingReview} postulación(es) en revisión manual</li>}
            {pendingWhatsapp > 0 && (
              <li>{pendingWhatsapp} postulación(es) esperando confirmación por WhatsApp</li>
            )}
          </ul>
        </div>
      )}

      <div>
        <p className="mb-2 font-mono text-[11px] uppercase tracking-[0.15em] text-white/40">Postulaciones</p>
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
          <Stat label="Total" value={applications.length} />
          <Stat label="Reservadas" value={byStatus("RESERVED")} />
          <Stat label="Confirmadas" value={byStatus("CONFIRMED")} />
          <Stat label="Admitidas" value={byStatus("ADMITTED")} accent />
        </div>
      </div>

      <div>
        <p className="mb-2 font-mono text-[11px] uppercase tracking-[0.15em] text-white/40">
          Ocupación (Miembros)
        </p>
        <div className="grid grid-cols-3 gap-2">
          <Stat label="Foundation" value={`${occ.foundation}/${generation.capacities.foundation.max}`} />
          <Stat label="Performance" value={`${occ.performance}/${generation.capacities.performance.max}`} />
          <Stat label="Tactical" value={`${occ.tactical}/${generation.capacities.tactical.max}`} />
        </div>
      </div>
    </div>
  );
}
