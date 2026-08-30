import { NextRequest, NextResponse } from "next/server";
import { countForTurn } from "@/lib/applications/store";
import { getActiveGeneration, turnoTimeRange, turnosForLevel } from "@/lib/generation";
import { ProgramSlug } from "@/lib/programs";

const VALID_LEVELS = ["foundation", "performance", "tactical"] as const;
type Level = (typeof VALID_LEVELS)[number];

/**
 * Real, live capacity per entry turn — never fake urgency. The Apply form
 * uses this to show "X/Y disponibles" on each turn card before the
 * applicant picks one.
 */
export async function GET(request: NextRequest) {
  const levelParam = request.nextUrl.searchParams.get("level");
  const level: Level = (VALID_LEVELS as readonly string[]).includes(levelParam ?? "")
    ? (levelParam as Level)
    : "foundation";

  const generation = await getActiveGeneration();
  const matchingTurnos = turnosForLevel(generation.turnos, level as ProgramSlug);

  const turns = await Promise.all(
    matchingTurnos.map(async (turno) => {
      const turnDateISO =
        turno.day === "saturday" ? generation.dates.entryDatesISO[0] : generation.dates.entryDatesISO[1];
      const timeSlot = turnoTimeRange(turno);
      const reserved = await countForTurn(turnDateISO, timeSlot);
      return {
        turnId: turno.id,
        turnDateISO,
        timeSlot,
        reserved,
        capacity: turno.maxCapacity,
        full: reserved >= turno.maxCapacity,
      };
    }),
  );

  return NextResponse.json({ turns });
}
