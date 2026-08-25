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
      <div className="overflow-x-auto">
        <table className="w-full min-w-[900px] border-collapse text-left text-sm">
          <thead>
            <tr className="border-b border-white/10 text-white/40">
              <th className="py-2 pr-4 font-mono text-[10px] uppercase tracking-[0.1em]">VRSN ID</th>
              <th className="py-2 pr-4 font-mono text-[10px] uppercase tracking-[0.1em]">Nombre</th>
              <th className="py-2 pr-4 font-mono text-[10px] uppercase tracking-[0.1em]">Div</th>
              <th className="py-2 pr-4 font-mono text-[10px] uppercase tracking-[0.1em]">Nivel de Entrada</th>
              <th className="py-2 pr-4 font-mono text-[10px] uppercase tracking-[0.1em]">Nivel Actual</th>
              <th className="py-2 pr-4 font-mono text-[10px] uppercase tracking-[0.1em]">Estado</th>
              <th className="py-2 pr-4 font-mono text-[10px] uppercase tracking-[0.1em]">Admitido</th>
              <th className="py-2 pr-4 font-mono text-[10px] uppercase tracking-[0.1em]">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {members.map((m) => (
              <tr key={m.id} className="border-b border-white/5">
                <td className="py-3 pr-4 font-mono text-xs text-cyan-400">{m.id}</td>
                <td className="py-3 pr-4">{m.firstName} {m.lastName}</td>
                <td className="py-3 pr-4">{m.division}</td>
                <td className="py-3 pr-4 font-mono text-xs uppercase">{m.entryLevel}</td>
                <td className="py-3 pr-4 font-mono text-xs uppercase">{m.currentLevel}</td>
                <td className="py-3 pr-4 font-mono text-xs uppercase">
                  {MEMBER_STATUS_LABEL[m.status] ?? m.status}
                </td>
                <td className="py-3 pr-4 text-xs text-white/50">
                  {new Date(m.admittedAt).toLocaleDateString("es-BO")}
                </td>
                <td className="py-3 pr-4">
                  <DeleteMemberButton id={m.id} name={`${m.firstName} ${m.lastName}`} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
