import { listMembers } from "@/lib/members/store";

export default async function MembersPage() {
  const members = (await listMembers()).slice().reverse();

  return (
    <div>
      <div className="mb-4 flex items-center justify-between">
        <p className="font-mono text-xs uppercase tracking-[0.15em] text-white/40">
          {members.length} members
        </p>
        {/* eslint-disable-next-line @next/next/no-html-link-for-pages -- file download, not a page navigation */}
        <a
          href="/api/command-center/export/members"
          className="border border-white/20 px-3 py-1.5 font-mono text-[10px] uppercase tracking-[0.15em] text-white/60 hover:border-white hover:text-white"
        >
          Export CSV
        </a>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full min-w-[800px] border-collapse text-left text-sm">
          <thead>
            <tr className="border-b border-white/10 text-white/40">
              <th className="py-2 pr-4 font-mono text-[10px] uppercase tracking-[0.1em]">VRSN ID</th>
              <th className="py-2 pr-4 font-mono text-[10px] uppercase tracking-[0.1em]">Name</th>
              <th className="py-2 pr-4 font-mono text-[10px] uppercase tracking-[0.1em]">Div</th>
              <th className="py-2 pr-4 font-mono text-[10px] uppercase tracking-[0.1em]">Entry Level</th>
              <th className="py-2 pr-4 font-mono text-[10px] uppercase tracking-[0.1em]">Current Level</th>
              <th className="py-2 pr-4 font-mono text-[10px] uppercase tracking-[0.1em]">Status</th>
              <th className="py-2 pr-4 font-mono text-[10px] uppercase tracking-[0.1em]">Admitted</th>
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
                <td className="py-3 pr-4 font-mono text-xs uppercase">{m.status}</td>
                <td className="py-3 pr-4 text-xs text-white/50">
                  {new Date(m.admittedAt).toLocaleDateString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
