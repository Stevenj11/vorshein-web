export type Tag =
  | "technique"
  | "endurance"
  | "breathControl"
  | "confidence"
  | "mentalControl";

export type Question = {
  id: string;
  index: number;
  tag: Tag | null;
  /** 0–3 per option, in display order. Higher = more prepared. */
  scores: number[];
  hasHelper?: boolean;
};

/**
 * The scored question bank — structure and scoring only. Prompt/helper/option
 * text lives in messages/{locale}.json under assessment.questions.{id} so the
 * flow, progress counter, and scoring engine never need to change per locale.
 */
export const QUESTIONS: Question[] = [
  { id: "experience", index: 1, tag: "technique", scores: [0, 1, 2, 3] },
  { id: "distance", index: 2, tag: "endurance", scores: [0, 1, 2, 3] },
  { id: "technique", index: 3, tag: "technique", scores: [0, 1, 2, 3] },
  { id: "apnea", index: 4, tag: "breathControl", scores: [0, 1, 2, 3], hasHelper: true },
  { id: "deepWater", index: 5, tag: "confidence", scores: [0, 1, 2, 3] },
  { id: "frequency", index: 6, tag: "endurance", scores: [0, 1, 2, 3] },
  { id: "pressure", index: 7, tag: "mentalControl", scores: [0, 1, 2, 3], hasHelper: true },
  { id: "goal", index: 8, tag: null, scores: [0, 1, 2, 2, 3, 1] },
  { id: "medical", index: 9, tag: null, scores: [0, 0, 0, 0], hasHelper: true },
];

export const TOTAL_QUESTIONS = QUESTIONS.length;
