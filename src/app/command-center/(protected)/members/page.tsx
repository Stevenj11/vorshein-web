import { listMembers } from "@/lib/members/store";
import { MEMBER_STATUS_LABEL } from "@/lib/commandCenterLabels";
import { DeleteMemberButton } from "./DeleteMemberButton";

export default async function MembersPage() {
  const members = (await listMembers()).slice().reverse();

  return (
    <div>
      <div className="mb-4 flex items-center justify-between">
        <p className="font-mono text-xs uppercase tracking-[0.15em] text-white/40">
          {members.length} miembros
        </p>
        {/* eslint-disable-next-line @next/next/no-html-link-for-pages -- file download, not a page navigation */}
        <a
          href="/api/command-center/export/members"
          className="border border-white/20 px-3 py-1.5 font-mono text-[10px] uppercase tracking-[0.15em] text-white/60 hover:border-white hover:text-white"
        >
          Exportar CSV
        </a>
      </div>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {members.map((m) => (
          <div key={m.id} className="flex flex-col gap-2 border border-white/10 p-4">
            <div className="flex items-center justify-between">
              <span className="font-mono text-xs text-cyan-400">{m.id}</span>
              <span className="font-mono text-[10px] uppercase tracking-[0.1em] text-white/50">
                {MEMBER_STATUS_LABEL[m.status] ?? m.status}
              </span>
            </div>
            <p className="text-base font-medium text-white">{m.firstName} {m.lastName}</p>
            <p className="font-mono text-xs text-white/60">
              División {m.division} · {m.entryLevel.toUpperCase()}
              {m.currentLevel !== m.entryLevel ? ` → ${m.currentLevel.toUpperCase()}` : ""}
            </p>
            <p className="font-mono text-[11px] text-white/40">
              Admitido {new Date(m.admittedAt).toLocaleDateString("es-BO")}
            </p>
            <div className="mt-1">
              <DeleteMemberButton id={m.id} name={`${m.firstName} ${m.lastName}`} />
            </div>
          </div>
        ))}
      </div>

      {members.length === 0 && (
        <p className="py-12 text-center font-mono text-xs uppercase tracking-[0.15em] text-white/30">
          Sin miembros todavía.
        </p>
      )}
    </div>
  );
}
