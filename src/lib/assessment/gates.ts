/**
 * Deterministic classification engine — GATES + INDICATORS, not a 0-100
 * score. Same answers always produce the same result (spec section 14).
 * AI may explain a result but never decides it.
 */

export type PreliminaryLevel =
  | "FOUNDATION"
  | "PERFORMANCE"
  | "TACTICAL"
  | "INCONCLUSIVE";

export type Style = "freestyle" | "backstroke" | "breaststroke" | "butterfly" | "none";

export type EligibilityGateInput = {
  age: number;
  sex: "male" | "female";
};

export type EligibilityResult =
  | { eligible: true }
  | { eligible: false; reason: "AGE_OUT" | "SEX_OUT" };

/** First barrier: age + sex, evaluated against the active generation's cohort (section 12). */
export function checkEligibility(
  input: EligibilityGateInput,
  cohort: { minAge: number; maxAge: number; sex: "male" | "female" | "any" },
): EligibilityResult {
  if (input.age < cohort.minAge || input.age > cohort.maxAge) {
    return { eligible: false, reason: "AGE_OUT" };
  }
  if (cohort.sex !== "any" && input.sex !== cohort.sex) {
    return { eligible: false, reason: "SEX_OUT" };
  }
  return { eligible: true };
}

export type FloatingResult = { eligible: true } | { eligible: false; reason: "CANNOT_FLOAT" };

/** Second barrier: independent floating (section 12, 15). */
export function checkFloating(canFloat: boolean): FloatingResult {
  return canFloat ? { eligible: true } : { eligible: false, reason: "CANNOT_FLOAT" };
}

export type ClassificationInput = {
  canFloat: boolean;
  /** 0 = no sabe flotar, 1 = flota pero casi no nada, 2 = técnica limitada, 3 = nada regularmente, 4 = avanzado/competitivo */
  experience: 0 | 1 | 2 | 3 | 4;
  /** 0: <17m, 1: 17-34m, 2: 35-100m, 3: 101-300m, 4: >300m */
  distanceBucket: 0 | 1 | 2 | 3 | 4;
  styles: Style[];
  /** Sumergirse voluntariamente, orientarse y tocar el fondo de forma controlada. */
  immersionControl: boolean;
  /** 0 sedentario, 1 ocasional, 2: 1-2/sem, 3: 3-5/sem, 4: intenso/competitivo */
  physicalCondition: 0 | 1 | 2 | 3 | 4;
  /** 0 nunca, 1 ocasional, 2 meses, 3 años, 4 formal/competición */
  priorExperience: 0 | 1 | 2 | 3 | 4;
  /** Capacidad declarada de mantener técnica/respiración tras esfuerzo. 0 = se pierde, 3 = se mantiene bien. */
  postEffortPerformance: 0 | 1 | 2 | 3;
  healthOrAdaptationFlag: boolean;
};

export type ClassificationResult = {
  level: PreliminaryLevel;
  needsManualReview: boolean;
  reasons: string[];
};

function functionalStyleCount(styles: Style[]): number {
  const set = new Set(styles);
  if (set.has("none")) return 0;
  return (["freestyle", "backstroke", "breaststroke", "butterfly"] as Style[]).filter((s) =>
    set.has(s),
  ).length;
}

export function classify(input: ClassificationInput): ClassificationResult {
  const reasons: string[] = [];
  const styleCount = functionalStyleCount(input.styles);
  const hasFreestyle = input.styles.includes("freestyle");
  const hasBackstroke = input.styles.includes("backstroke");

  // Direct contradiction with the floating gate already passed.
  if (input.canFloat && input.experience === 0) {
    reasons.push("Reporta no saber flotar tras confirmar que sí puede.");
    return { level: "INCONCLUSIVE", needsManualReview: true, reasons };
  }

  // Spec example: dominates all 4 styles but can't swim 17m — contradictory.
  if (styleCount === 4 && input.distanceBucket <= 1) {
    reasons.push("Reporta dominio de los 4 estilos con distancia continua menor a 35 m.");
    return { level: "INCONCLUSIVE", needsManualReview: input.healthOrAdaptationFlag, reasons };
  }

  const tacticalGates =
    styleCount === 4 &&
    input.immersionControl &&
    input.distanceBucket >= 3 &&
    input.priorExperience >= 1 &&
    input.physicalCondition >= 1 &&
    input.postEffortPerformance >= 1;

  if (tacticalGates) {
    if (input.experience <= 1) {
      reasons.push("Indicadores de Tactical con experiencia declarada mínima — inconsistente.");
      return { level: "INCONCLUSIVE", needsManualReview: true, reasons };
    }
    reasons.push("Cumple los 4 estilos, inmersión controlada, distancia y condición física para Tactical.");
    return {
      level: "TACTICAL",
      needsManualReview: input.healthOrAdaptationFlag,
      reasons,
    };
  }

  const performanceGates =
    hasFreestyle && hasBackstroke && input.immersionControl && input.distanceBucket >= 2;

  if (performanceGates) {
    reasons.push("Libre y espalda funcionales, inmersión controlada y distancia suficiente para Performance.");
    return {
      level: "PERFORMANCE",
      needsManualReview: input.healthOrAdaptationFlag,
      reasons,
    };
  }

  reasons.push("No alcanza los indicadores de Performance; requisito mínimo de flotación cumplido.");
  return {
    level: "FOUNDATION",
    needsManualReview: input.healthOrAdaptationFlag,
    reasons,
  };
}
