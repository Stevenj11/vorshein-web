import Link from "next/link";
import { listApplications } from "@/lib/applications/store";
import { APPLICATION_STATUS_LABEL } from "@/lib/commandCenterLabels";
import { formatWeekdayDate } from "@/lib/enrollment";

export default async function ApplicationsPage() {
  const applications = (await listApplications()).slice().reverse();

  return (
    <div>
      <div className="mb-4 flex items-center justify-between">
        <p className="font-mono text-xs uppercase tracking-[0.15em] text-white/40">
          {applications.length} postulaciones
        </p>
        {/* eslint-disable-next-line @next/next/no-html-link-for-pages -- file download, not a page navigation */}
        <a
          href="/api/command-center/export/applications"
          className="border border-white/20 px-3 py-1.5 font-mono text-[10px] uppercase tracking-[0.15em] text-white/60 hover:border-white hover:text-white"
        >
          Exportar CSV
        </a>
      </div>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {applications.map((app) => (
          <Link
            key={app.id}
            href={`/command-center/applications/${app.id}`}
            className="flex flex-col gap-2 border border-white/10 p-4 transition-colors hover:border-white/40"
          >
            <div className="flex items-center justify-between">
              <span className="font-mono text-xs text-cyan-400">{app.id}</span>
              <span className="font-mono text-[10px] uppercase tracking-[0.1em] text-white/50">
                {APPLICATION_STATUS_LABEL[app.status] ?? app.status}
              </span>
            </div>
            <p className="text-base font-medium text-white">
              {app.firstName} {app.lastName}
            </p>
            <p className="font-mono text-xs text-white/60">
              {app.preliminaryLevel} — PRELIMINAR
            </p>
            <p className="font-mono text-[11px] text-white/40">
              {formatWeekdayDate(app.turnDateISO, "es")} · {app.turnTimeSlot}
            </p>
          </Link>
        ))}
      </div>

      {applications.length === 0 && (
        <p className="py-12 text-center font-mono text-xs uppercase tracking-[0.15em] text-white/30">
          Sin postulaciones todavía.
        </p>
      )}
    </div>
  );
}
