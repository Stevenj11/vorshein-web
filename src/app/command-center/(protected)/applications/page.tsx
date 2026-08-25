import { listApplications } from "@/lib/applications/store";
import { ApplicationRowActions } from "./ApplicationRowActions";

export default async function ApplicationsPage() {
  const applications = (await listApplications()).slice().reverse();

  return (
    <div>
      <div className="mb-4 flex items-center justify-between">
        <p className="font-mono text-xs uppercase tracking-[0.15em] text-white/40">
          {applications.length} applications
        </p>
        {/* eslint-disable-next-line @next/next/no-html-link-for-pages -- file download, not a page navigation */}
        <a
          href="/api/command-center/export/applications"
          className="border border-white/20 px-3 py-1.5 font-mono text-[10px] uppercase tracking-[0.15em] text-white/60 hover:border-white hover:text-white"
        >
          Export CSV
        </a>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full min-w-[900px] border-collapse text-left text-sm">
          <thead>
            <tr className="border-b border-white/10 text-white/40">
              <th className="py-2 pr-4 font-mono text-[10px] uppercase tracking-[0.1em]">ID</th>
              <th className="py-2 pr-4 font-mono text-[10px] uppercase tracking-[0.1em]">Name</th>
              <th className="py-2 pr-4 font-mono text-[10px] uppercase tracking-[0.1em]">Age</th>
              <th className="py-2 pr-4 font-mono text-[10px] uppercase tracking-[0.1em]">Div</th>
              <th className="py-2 pr-4 font-mono text-[10px] uppercase tracking-[0.1em]">Preliminary</th>
              <th className="py-2 pr-4 font-mono text-[10px] uppercase tracking-[0.1em]">Turn</th>
              <th className="py-2 pr-4 font-mono text-[10px] uppercase tracking-[0.1em]">Status</th>
              <th className="py-2 pr-4 font-mono text-[10px] uppercase tracking-[0.1em]">Actions</th>
            </tr>
          </thead>
          <tbody>
            {applications.map((app) => (
              <tr key={app.id} className="border-b border-white/5">
                <td className="py-3 pr-4 font-mono text-xs text-cyan-400">{app.id}</td>
                <td className="py-3 pr-4">{app.firstName} {app.lastName}</td>
                <td className="py-3 pr-4">{app.age}</td>
                <td className="py-3 pr-4">{app.division}</td>
                <td className="py-3 pr-4 font-mono text-xs">{app.preliminaryLevel}</td>
                <td className="py-3 pr-4 text-xs text-white/60">
                  {app.turnDateISO}<br />{app.turnTimeSlot}
                </td>
                <td className="py-3 pr-4 font-mono text-xs">{app.status}</td>
                <td className="py-3 pr-4">
                  <ApplicationRowActions
                    id={app.id}
                    status={app.status}
                    preliminaryLevel={app.preliminaryLevel}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
