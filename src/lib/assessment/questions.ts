export type QuestionKind = "single" | "multi";

export type IndicatorQuestion = {
  id: string;
  kind: QuestionKind;
  hasHelper?: boolean;
  optionCount: number;
};

/**
 * The 10 indicator questions (spec section 13) — asked after the three hard
 * gates (age, sex, floating) pass. Prompt/option copy lives in
 * messages/{locale}.json under assessment.questions.{id}; this file only
 * describes shape, so the classification engine (gates.ts) and the flow
 * component never need to change per locale.
 */
export const INDICATOR_QUESTIONS: IndicatorQuestion[] = [
  { id: "experience", kind: "single", optionCount: 5 },
  { id: "distance", kind: "single", optionCount: 5 },
  { id: "styles", kind: "multi", optionCount: 5 },
  { id: "readiness", kind: "single", optionCount: 4 },
];

/**
 * "readiness" collapses the old separate physicalCondition/priorExperience/
 * postEffort questions into one. classify() (gates.ts) only ever checks
 * those three fields with a `>= 1` floor as part of the Tactical gate, so a
 * single ordinal choice can drive all three without changing any outcome.
 */
export const READINESS_TO_INPUT: [physicalCondition: number, priorExperience: number, postEffort: number][] = [
  [0, 0, 0],
  [1, 1, 1],
  [3, 3, 2],
  [4, 4, 3],
];

export const TOTAL_INDICATOR_QUESTIONS = INDICATOR_QUESTIONS.length;
