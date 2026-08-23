import { QUESTIONS, Tag } from "./questions";

export type Level = "BASIC" | "INTERMEDIATE" | "ADVANCED";
export type SafetyFlag = "significant" | "minor" | null;

export type Answers = Record<string, number>; // questionId -> option index

export type AssessmentResult = {
  level: Level;
  levelNumber: 1 | 2 | 3;
  readiness: number; // 0-100
  strengthTag: Tag | null;
  priorityTags: Tag[];
  safetyFlag: SafetyFlag;
};

/**
 * Level thresholds on the 0–100 readiness scale. Adjust these two numbers to
 * retune how strict classification is — nothing else needs to change.
 */
const LEVEL_THRESHOLDS = {
  intermediate: 40,
  advanced: 75,
} as const;

const LEVEL_NUMBER: Record<Level, 1 | 2 | 3> = {
  BASIC: 1,
  INTERMEDIATE: 2,
  ADVANCED: 3,
};

function levelFromReadiness(readiness: number): Level {
  if (readiness >= LEVEL_THRESHOLDS.advanced) return "ADVANCED";
  if (readiness >= LEVEL_THRESHOLDS.intermediate) return "INTERMEDIATE";
  return "BASIC";
}

export function scoreAssessment(answers: Answers): AssessmentResult {
  let rawTotal = 0;
  let rawMax = 0;
  const tagTotals = new Map<Tag, { sum: number; count: number }>();

  for (const question of QUESTIONS) {
    const chosenIndex = answers[question.id];
    if (chosenIndex === undefined) continue;
    const score = question.scores[chosenIndex];
    if (score === undefined) continue;

    if (question.id !== "medical") {
      rawTotal += score;
      rawMax += 3;
    }

    if (question.tag) {
      const entry = tagTotals.get(question.tag) ?? { sum: 0, count: 0 };
      entry.sum += score;
      entry.count += 1;
      tagTotals.set(question.tag, entry);
    }
  }

  const readiness = rawMax > 0 ? Math.round((rawTotal / rawMax) * 100) : 0;
  const level = levelFromReadiness(readiness);

  const tagAverages = Array.from(tagTotals.entries()).map(([tag, { sum, count }]) => ({
    tag,
    average: sum / count,
  }));

  const strengthEntry = tagAverages.reduce(
    (best, cur) => (!best || cur.average > best.average ? cur : best),
    null as { tag: Tag; average: number } | null,
  );
  const priorityTags = [...tagAverages]
    .sort((a, b) => a.average - b.average)
    .slice(0, 2)
    .map((t) => t.tag);

  const medicalIndex = answers.medical;
  const safetyFlag: SafetyFlag =
    medicalIndex === 0 ? "significant" : medicalIndex === 1 ? "minor" : null;

  return {
    level,
    levelNumber: LEVEL_NUMBER[level],
    readiness,
    strengthTag: strengthEntry?.tag ?? null,
    priorityTags,
    safetyFlag,
  };
}
