import { NextRequest, NextResponse } from "next/server";
import { countForTurn } from "@/lib/applications/store";
import { getActiveGeneration } from "@/lib/generation";

const VALID_LEVELS = ["foundation", "performance", "tactical"] as const;
type Level = (typeof VALID_LEVELS)[number];

/**
 * Real, live capacity per entry turn — never fake urgency. The Apply form
 * uses this to show "X/Y disponibles" on each turn card before the
 * applicant picks one.
 */
export async function GET(request: NextRequest) {
  const levelParam = request.nextUrl.searchParams.get("level");
  const level = (VALID_LEVELS as readonly string[]).includes(levelParam ?? "")
    ? (levelParam as Level)
    : "foundation";

  const generation = await getActiveGeneration();
  const capacity = generation.capacities[level];

  const turns = await Promise.all(
    generation.dates.entryDatesISO.map(async (turnDateISO) => {
      const reserved = await countForTurn(turnDateISO, capacity.scheduleTime);
      return {
        turnDateISO,
        timeSlot: capacity.scheduleTime,
        reserved,
        capacity: capacity.entryTurnCapacity,
        full: reserved >= capacity.entryTurnCapacity,
      };
    }),
  );

  return NextResponse.json({ turns });
}
