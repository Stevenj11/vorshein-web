"use client";

import { useState } from "react";
import { AttendanceMark, AttendanceRecord } from "@/lib/attendance/types";
import { Member } from "@/lib/members/types";

export function AttendanceClient({
  members,
  generationId,
  initialRecords,
}: {
  members: Member[];
  generationId: string;
  initialRecords: AttendanceRecord[];
}) {
  const [level, setLevel] = useState<"foundation" | "performance" | "tactical">("foundation");
  const [sessionNumber, setSessionNumber] = useState(1);
  const [records, setRecords] = useState(initialRecords);

  const levelMembers = members.filter((m) => m.currentLevel === level);

  function markFor(memberId: string): AttendanceMark | undefined {
    return records.find(
      (r) => r.memberId === memberId && r.level === level && r.sessionNumber === sessionNumber,
    )?.mark;
  }

  async function mark(memberId: string, value: AttendanceMark) {
    await fetch("/api/command-center/attendance", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ memberId, generationId, level, sessionNumber, mark: value }),
    });
    setRecords((prev) => [
      ...prev.filter(
        (r) => !(r.memberId === memberId && r.level === level && r.sessionNumber === sessionNumber),
      ),
      { memberId, generationId, level, sessionNumber, mark: value, dateISO: new Date().toISOString() },
    ]);
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap gap-2">
        {(["foundation", "performance", "tactical"] as const).map((l) => (
          <button
            key={l}
            onClick={() => setLevel(l)}
            className={`px-3 py-2 font-mono text-[11px] uppercase tracking-[0.15em] ${
              level === l ? "bg-white text-black" : "border border-white/20 text-white/60"
            }`}
          >
            {l}
          </button>
        ))}
        <select
          value={sessionNumber}
          onChange={(e) => setSessionNumber(Number(e.target.value))}
          className="border border-white/20 bg-black px-3 py-2 font-mono text-[11px] uppercase tracking-[0.15em] text-white"
        >
          {Array.from({ length: 8 }, (_, i) => i + 1).map((n) => (
            <option key={n} value={n}>
              Session {n}
            </option>
          ))}
        </select>
      </div>

      <div className="flex flex-col gap-2">
        {levelMembers.length === 0 && (
          <p className="text-sm text-white/40">No hay miembros en este nivel todavía.</p>
        )}
        {levelMembers.map((m) => {
          const current = markFor(m.id);
          return (
            <div key={m.id} className="flex items-center justify-between border border-white/10 px-4 py-3">
              <div>
                <p className="text-sm font-medium">{m.firstName} {m.lastName}</p>
                <p className="font-mono text-[10px] text-cyan-400">{m.id}</p>
              </div>
              <div className="flex gap-1.5">
                {(["present", "late", "absent"] as const).map((v) => (
                  <button
                    key={v}
                    onClick={() => mark(m.id, v)}
                    className={`border px-3 py-2 font-mono text-[10px] uppercase tracking-[0.1em] ${
                      current === v
                        ? "border-white bg-white text-black"
                        : "border-white/20 text-white/60"
                    }`}
                  >
                    {v}
                  </button>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
