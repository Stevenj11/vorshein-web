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
  { id: "immersion", kind: "single", optionCount: 2 },
  { id: "physicalCondition", kind: "single", optionCount: 5 },
  { id: "turns", kind: "single", optionCount: 4 },
  { id: "priorExperience", kind: "single", optionCount: 5 },
  { id: "postEffort", kind: "single", optionCount: 4 },
  { id: "goal", kind: "single", optionCount: 7 },
  { id: "health", kind: "single", optionCount: 2, hasHelper: true },
];

export const TOTAL_INDICATOR_QUESTIONS = INDICATOR_QUESTIONS.length;
