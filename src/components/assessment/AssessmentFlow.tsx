"use client";

import { useTranslations } from "next-intl";
import { useState } from "react";
import { Button } from "@/components/ui/Button";
import {
  ClassificationInput,
  Style,
  checkEligibility,
  checkFloating,
  classify,
} from "@/lib/assessment/gates";
import {
  INDICATOR_QUESTIONS,
  READINESS_TO_INPUT,
  TOTAL_INDICATOR_QUESTIONS,
} from "@/lib/assessment/questions";
import { saveAssessmentResult } from "@/lib/assessment/storage";
import { playAnalysisSound, playConfirmSound } from "@/lib/sound";
import { AnalyzingScreen } from "./AnalyzingScreen";
import { IneligibleScreen } from "./IneligibleScreen";
import { ProgressBar } from "./ProgressBar";
import { ResultScreen } from "./ResultScreen";

type Phase =
  | "intro"
  | "identity"
  | "age"
  | "ineligible-age"
  | "sex"
  | "ineligible-sex"
  | "floating"
  | "ineligible-floating"
  | "quiz"
  | "health"
  | "confirm"
  | "analyzing"
  | "result";

const STYLE_ORDER: Style[] = ["freestyle", "backstroke", "breaststroke", "butterfly", "none"];
const ANALYZING_DURATION = 1100;

export function AssessmentFlow() {
  const t = useTranslations("assessment");
  const [phase, setPhase] = useState<Phase>("intro");
  const [step, setStep] = useState(0);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [whatsapp, setWhatsapp] = useState("");
  const [identityError, setIdentityError] = useState(false);
  const [age, setAge] = useState("");
  const [sex, setSex] = useState<"male" | "female" | null>(null);
  const [canFloat, setCanFloat] = useState<boolean | null>(null);
  const [immersionControl, setImmersionControl] = useState<boolean | null>(null);
  const [health, setHealth] = useState<boolean | null>(null);
  const [answers, setAnswers] = useState<Record<string, number | number[]>>({});
  const [confirmed, setConfirmed] = useState(false);
  const [result, setResult] = useState<ReturnType<typeof classify> | null>(null);

  const question = INDICATOR_QUESTIONS[step];
  const options = question ? (t.raw(`questions.${question.id}.options`) as string[]) : [];

  function submitIdentity() {
    if (!firstName.trim() || !lastName.trim() || whatsapp.replace(/\D/g, "").length < 7) {
      setIdentityError(true);
      return;
    }
    setIdentityError(false);
    setPhase("age");
  }

  function submitAge() {
    const ageNum = Number(age);
    if (!ageNum || ageNum < 1 || ageNum > 120) return;
    const check = checkEligibility({ age: ageNum, sex: "male" }, { minAge: 18, maxAge: 30, sex: "any" });
    if (!check.eligible) {
      setPhase("ineligible-age");
      return;
    }
    setPhase("sex");
  }

  function selectSex(value: "male" | "female") {
    setSex(value);
    const check = checkEligibility(
      { age: Number(age), sex: value },
      { minAge: 18, maxAge: 30, sex: "male" },
    );
    if (!check.eligible) {
      setPhase("ineligible-sex");
      return;
    }
    setPhase("floating");
  }

  function selectFloating(value: boolean) {
    setCanFloat(value);
    const check = checkFloating(value);
    if (!check.eligible) {
      setPhase("ineligible-floating");
      return;
    }
    setPhase("quiz");
  }

  function selectSingle(optionIndex: number) {
    setAnswers((prev) => ({ ...prev, [question.id]: optionIndex }));
    advance();
  }

  // Functional setState — not `{ ...answers, styles: next }` off the render
  // closure — so rapid successive clicks (each toggling one style) always
  // build on the latest selection instead of racing a stale snapshot.
  function toggleMultiStyle(optionIndex: number) {
    setAnswers((prev) => {
      const current = (prev.styles as number[] | undefined) ?? [];
      const noneIndex = STYLE_ORDER.indexOf("none");
      let next: number[];
      if (optionIndex === noneIndex) {
        next = current.includes(noneIndex) ? [] : [noneIndex];
      } else if (current.includes(optionIndex)) {
        next = current.filter((i) => i !== optionIndex);
      } else {
        next = [...current.filter((i) => i !== noneIndex), optionIndex];
      }
      return { ...prev, styles: next };
    });
  }

  function confirmMultiStyle() {
    advance();
  }

  function advance() {
    if (step + 1 < TOTAL_INDICATOR_QUESTIONS) {
      window.setTimeout(() => setStep(step + 1), question.kind === "multi" ? 0 : 220);
      return;
    }
    window.setTimeout(() => setPhase("health"), question.kind === "multi" ? 0 : 220);
  }

  function goBack() {
    if (step === 0) {
      setPhase("floating");
      return;
    }
    setStep(step - 1);
  }

  function selectHealth(value: boolean) {
    setHealth(value);
    setPhase("confirm");
  }

  function submit() {
    if (!confirmed || sex === null || canFloat === null || immersionControl === null || health === null) return;

    const styleIndexes = (answers.styles as number[] | undefined) ?? [];
    const readinessIndex = (answers.readiness as number | undefined) ?? 0;
    const [physicalCondition, priorExperience, postEffort] = READINESS_TO_INPUT[readinessIndex];
    const input: ClassificationInput = {
      canFloat,
      experience: (answers.experience as ClassificationInput["experience"]) ?? 0,
      distanceBucket: (answers.distance as ClassificationInput["distanceBucket"]) ?? 0,
      styles: styleIndexes.map((i) => STYLE_ORDER[i]),
      immersionControl,
      physicalCondition: physicalCondition as ClassificationInput["physicalCondition"],
      priorExperience: priorExperience as ClassificationInput["priorExperience"],
      postEffortPerformance: postEffort as ClassificationInput["postEffortPerformance"],
      healthOrAdaptationFlag: health,
    };

    setPhase("analyzing");
    playAnalysisSound();

    window.setTimeout(() => {
      const classification = classify(input);
      saveAssessmentResult({
        preliminaryLevel: classification.level,
        needsManualReview: classification.needsManualReview,
        age: Number(age),
        sex,
        answers: input,
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        whatsapp: whatsapp.trim(),
      });
      setResult(classification);
      setPhase("result");
      playConfirmSound();
    }, ANALYZING_DURATION);
  }

  function retake() {
    setStep(0);
    setFirstName("");
    setLastName("");
    setWhatsapp("");
    setIdentityError(false);
    setAge("");
    setSex(null);
    setCanFloat(null);
    setImmersionControl(null);
    setHealth(null);
    setAnswers({});
    setConfirmed(false);
    setResult(null);
    setPhase("intro");
  }

  if (phase === "intro") {
    return (
      <div className="mx-auto flex max-w-xl flex-col items-center text-center">
        <span className="font-mono text-xs uppercase tracking-[0.3em] text-fg-faint">
          {t("intro.label")}
        </span>
        <h1 className="mt-5 text-4xl font-extrabold tracking-tight md:text-5xl">
          {t("intro.heading")}
        </h1>
        <p className="mt-5 text-fg-muted">
          {t("intro.body", { count: TOTAL_INDICATOR_QUESTIONS + 3 })}
        </p>
        <div className="mt-10">
          <Button onClick={() => setPhase("identity")}>{t("intro.cta")}</Button>
        </div>
      </div>
    );
  }

  if (phase === "identity") {
    return (
      <div className="mx-auto flex max-w-md flex-col items-center text-center">
        <span className="font-mono text-xs uppercase tracking-[0.3em] text-fg-faint">
          {t("identity.label")}
        </span>
        <h2 className="mt-5 text-2xl font-semibold md:text-3xl">{t("identity.heading")}</h2>
        <div className="mt-8 flex w-full flex-col gap-3">
          <input
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            placeholder={t("identity.firstName") as string}
            autoFocus
            className="border border-line-strong bg-transparent px-4 py-3 text-center text-sm text-fg outline-none placeholder:text-fg-faint focus:border-signal"
          />
          <input
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            placeholder={t("identity.lastName") as string}
            className="border border-line-strong bg-transparent px-4 py-3 text-center text-sm text-fg outline-none placeholder:text-fg-faint focus:border-signal"
          />
          <input
            value={whatsapp}
            onChange={(e) => setWhatsapp(e.target.value)}
            type="tel"
            inputMode="tel"
            placeholder={t("identity.whatsapp") as string}
            className="border border-line-strong bg-transparent px-4 py-3 text-center text-sm text-fg outline-none placeholder:text-fg-faint focus:border-signal"
          />
        </div>
        {identityError && (
          <p className="mt-4 text-sm text-signal">{t("identity.error")}</p>
        )}
        <div className="mt-8">
          <Button onClick={submitIdentity}>{t("continue")}</Button>
        </div>
      </div>
    );
  }

  if (phase === "age") {
    return (
      <div className="mx-auto flex max-w-md flex-col items-center text-center">
        <span className="font-mono text-xs uppercase tracking-[0.3em] text-fg-faint">
          {t("gates.ageLabel")}
        </span>
        <h2 className="mt-5 text-2xl font-semibold md:text-3xl">{t("gates.agePrompt")}</h2>
        <input
          type="number"
          inputMode="numeric"
          value={age}
          onChange={(e) => setAge(e.target.value)}
          className="mt-8 w-32 border border-line-strong bg-transparent px-4 py-3 text-center text-2xl text-fg outline-none focus:border-signal"
          autoFocus
        />
        <div className="mt-8">
          <Button onClick={submitAge}>{t("continue")}</Button>
        </div>
      </div>
    );
  }

  if (phase === "ineligible-age" || phase === "ineligible-sex" || phase === "ineligible-floating") {
    return <IneligibleScreen variant={phase} onRetake={retake} />;
  }

  if (phase === "sex") {
    return (
      <div className="mx-auto flex max-w-md flex-col items-center text-center">
        <span className="font-mono text-xs uppercase tracking-[0.3em] text-fg-faint">
          {t("gates.sexLabel")}
        </span>
        <h2 className="mt-5 text-2xl font-semibold md:text-3xl">{t("gates.sexPrompt")}</h2>
        <div className="mt-8 flex w-full flex-col gap-3">
          <button
            onClick={() => selectSex("male")}
            className="border border-line-strong px-6 py-4 text-sm transition-colors hover:border-fg-muted"
          >
            {t("gates.sexMale")}
          </button>
          <button
            onClick={() => selectSex("female")}
            className="border border-line-strong px-6 py-4 text-sm transition-colors hover:border-fg-muted"
          >
            {t("gates.sexFemale")}
          </button>
        </div>
      </div>
    );
  }

  if (phase === "floating") {
    return (
      <div className="mx-auto flex max-w-md flex-col items-center text-center">
        <span className="font-mono text-xs uppercase tracking-[0.3em] text-fg-faint">
          {t("gates.floatingLabel")}
        </span>
        <h2 className="mt-5 text-2xl font-semibold md:text-3xl">{t("gates.floatingPrompt")}</h2>
        <div className="mt-8 flex w-full flex-col gap-3">
          <button
            onClick={() => selectFloating(true)}
            className="border border-line-strong px-6 py-4 text-sm transition-colors hover:border-fg-muted"
          >
            {t("gates.yes")}
          </button>
          <button
            onClick={() => selectFloating(false)}
            className="border border-line-strong px-6 py-4 text-sm transition-colors hover:border-fg-muted"
          >
            {t("gates.no")}
          </button>
        </div>
      </div>
    );
  }

  if (phase === "health") {
    return (
      <div className="mx-auto flex max-w-md flex-col items-center text-center">
        <span className="font-mono text-xs uppercase tracking-[0.3em] text-fg-faint">
          {t("gates.healthLabel")}
        </span>
        <h2 className="mt-5 text-2xl font-semibold md:text-3xl">{t("gates.healthPrompt")}</h2>
        <p className="mt-3 text-sm text-fg-muted">{t("gates.healthHelper")}</p>
        <div className="mt-8 flex w-full flex-col gap-3">
          <button
            onClick={() => selectHealth(true)}
            className="border border-line-strong px-6 py-4 text-sm transition-colors hover:border-fg-muted"
          >
            {t("gates.yes")}
          </button>
          <button
            onClick={() => selectHealth(false)}
            className="border border-line-strong px-6 py-4 text-sm transition-colors hover:border-fg-muted"
          >
            {t("gates.no")}
          </button>
        </div>
      </div>
    );
  }

  if (phase === "analyzing") {
    return <AnalyzingScreen />;
  }

  if (phase === "result" && result) {
    return <ResultScreen result={result} onRetake={retake} />;
  }

  if (phase === "confirm") {
    return (
      <div className="mx-auto flex max-w-xl flex-col items-center text-center">
        <span className="font-mono text-xs uppercase tracking-[0.3em] text-fg-faint">
          {t("confirm.label")}
        </span>
        <h2 className="mt-5 text-2xl font-semibold md:text-3xl">{t("confirm.heading")}</h2>
        <label className="mt-8 flex items-start gap-3 text-left">
          <input
            type="checkbox"
            checked={confirmed}
            onChange={(e) => setConfirmed(e.target.checked)}
            className="mt-1 h-4 w-4 shrink-0 accent-signal"
          />
          <span className="text-sm text-fg-muted">{t("confirm.text")}</span>
        </label>
        <div className="mt-8">
          <Button onClick={submit}>{t("confirm.cta")}</Button>
        </div>
      </div>
    );
  }

  // phase === "quiz"
  const progress = (step / TOTAL_INDICATOR_QUESTIONS) * 100;
  const isMulti = question.kind === "multi";
  const selectedSingle = answers[question.id] as number | undefined;
  const selectedMulti = (answers[question.id] as number[] | undefined) ?? [];

  return (
    <div className="mx-auto w-full max-w-2xl">
      <ProgressBar progress={progress} />

      <div className="mt-8 flex items-baseline justify-between">
        <span className="font-mono text-xs text-fg-faint">
          {String(step + 1).padStart(2, "0")} /{" "}
          {String(TOTAL_INDICATOR_QUESTIONS).padStart(2, "0")}
        </span>
        <button
          onClick={goBack}
          className="font-mono text-xs uppercase tracking-[0.2em] text-fg-faint transition-colors hover:text-fg"
        >
          {t("back")}
        </button>
      </div>

      <h2 className="mt-6 text-2xl font-semibold leading-snug md:text-3xl">
        {t(`questions.${question.id}.prompt`)}
      </h2>
      {question.hasHelper && (
        <p className="mt-2 text-sm text-fg-muted">{t(`questions.${question.id}.helper`)}</p>
      )}

      <div className="mt-10 flex flex-col gap-3">
        {options.map((label, i) => {
          const active = isMulti ? selectedMulti.includes(i) : selectedSingle === i;
          return (
            <button
              key={label}
              onClick={() => (isMulti ? toggleMultiStyle(i) : selectSingle(i))}
              className={`flex items-center justify-between border px-6 py-4 text-left transition-colors duration-150 ${
                active ? "border-signal text-signal" : "border-line-strong text-fg hover:border-fg-muted"
              }`}
            >
              <span className="text-sm md:text-base">{label}</span>
              <span className="font-mono text-xs text-fg-faint">
                {String(i + 1).padStart(2, "0")}
              </span>
            </button>
          );
        })}
      </div>

      {isMulti && (
        <div className="mt-8">
          {question.id === "styles" && (
            <div className="mb-8 border-t border-line pt-8 text-left">
              <p className="text-sm font-medium text-fg">{t("questions.styles.immersionPrompt")}</p>
              <div className="mt-4 flex gap-3">
                <button
                  onClick={() => setImmersionControl(true)}
                  className={`border px-6 py-3 text-sm transition-colors ${
                    immersionControl === true
                      ? "border-signal text-signal"
                      : "border-line-strong text-fg hover:border-fg-muted"
                  }`}
                >
                  {t("gates.yes")}
                </button>
                <button
                  onClick={() => setImmersionControl(false)}
                  className={`border px-6 py-3 text-sm transition-colors ${
                    immersionControl === false
                      ? "border-signal text-signal"
                      : "border-line-strong text-fg hover:border-fg-muted"
                  }`}
                >
                  {t("gates.no")}
                </button>
              </div>
            </div>
          )}
          <Button
            onClick={confirmMultiStyle}
            disabled={selectedMulti.length === 0 || (question.id === "styles" && immersionControl === null)}
          >
            {t("continue")}
          </Button>
        </div>
      )}
    </div>
  );
}
