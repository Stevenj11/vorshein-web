import { NextRequest, NextResponse } from "next/server";
import { countForTurn } from "@/lib/applications/store";
import { getActiveGeneration, turnoTimeRange, turnosForLevel } from "@/lib/generation";
import { ProgramSlug } from "@/lib/programs";

const VALID_LEVELS = ["foundation", "performance", "tactical"] as const;
type Level = (typeof VALID_LEVELS)[number];

/**
 * Real, live cohort capacity — never fake urgency. Applicants don't pick a
 * turno anymore (they attend both weekly classes from week one), so this
 * returns one combined availability reading: the Saturday turno is the
 * canonical capacity anchor (an application only ever books that one),
 * with Sunday's info attached purely for display.
 */
export async function GET(request: NextRequest) {
  const levelParam = request.nextUrl.searchParams.get("level");
  const level: Level = (VALID_LEVELS as readonly string[]).includes(levelParam ?? "")
    ? (levelParam as Level)
    : "foundation";

  const generation = await getActiveGeneration();
  const levelTurnos = turnosForLevel(generation.turnos, level as ProgramSlug);
  const primary = levelTurnos.find((t) => t.day === "saturday") ?? levelTurnos[0];
  if (!primary) return NextResponse.json({ turn: null });

  const secondary = levelTurnos.find((t) => t.id !== primary.id) ?? null;
  const turnDateISO = generation.dates.entryDatesISO[0];
  const timeSlot = turnoTimeRange(primary);
  const reserved = await countForTurn(turnDateISO, timeSlot);

  return NextResponse.json({
    turn: {
      turnId: primary.id,
      turnDateISO,
      timeSlot,
      reserved,
      capacity: primary.maxCapacity,
      full: reserved >= primary.maxCapacity,
      secondDateISO: secondary ? generation.dates.entryDatesISO[1] : null,
      secondTimeSlot: secondary ? turnoTimeRange(secondary) : null,
    },
  });
}
