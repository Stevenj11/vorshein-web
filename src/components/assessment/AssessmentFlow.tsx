"use client";

import { useTranslations } from "next-intl";
import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { QUESTIONS, TOTAL_QUESTIONS } from "@/lib/assessment/questions";
import { Answers, AssessmentResult, scoreAssessment } from "@/lib/assessment/scoring";
import { saveAssessmentResult } from "@/lib/assessment/storage";
import { playAnalysisSound, playConfirmSound } from "@/lib/sound";
import { AnalyzingScreen } from "./AnalyzingScreen";
import { ProgressBar } from "./ProgressBar";
import { ResultScreen } from "./ResultScreen";

type Phase = "intro" | "quiz" | "analyzing" | "result";

const ANALYZING_DURATION = 1100;

export function AssessmentFlow() {
  const t = useTranslations("assessment");
  const [phase, setPhase] = useState<Phase>("intro");
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<Answers>({});
  const [result, setResult] = useState<AssessmentResult | null>(null);

  const question = QUESTIONS[step];
  const options = t.raw(`questions.${question.id}.options`) as string[];

  function selectOption(optionIndex: number) {
    const nextAnswers = { ...answers, [question.id]: optionIndex };
    setAnswers(nextAnswers);

    if (step + 1 < TOTAL_QUESTIONS) {
      window.setTimeout(() => setStep(step + 1), 220);
      return;
    }

    window.setTimeout(() => {
      setPhase("analyzing");
      playAnalysisSound();

      window.setTimeout(() => {
        const finalResult = scoreAssessment(nextAnswers);
        saveAssessmentResult(finalResult);
        setResult(finalResult);
        setPhase("result");
        playConfirmSound();
      }, ANALYZING_DURATION);
    }, 220);
  }

  function retake() {
    setAnswers({});
    setStep(0);
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
          {t("intro.body", { count: TOTAL_QUESTIONS })}
        </p>
        <div className="mt-10">
          <Button onClick={() => setPhase("quiz")}>{t("intro.cta")}</Button>
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

  const progress = (step / TOTAL_QUESTIONS) * 100;
  const selected = answers[question.id];

  return (
    <div className="mx-auto w-full max-w-2xl">
      <ProgressBar progress={progress} />

      <div className="mt-8 flex items-baseline justify-between">
        <span className="font-mono text-xs text-fg-faint">
          {String(question.index).padStart(2, "0")} /{" "}
          {String(TOTAL_QUESTIONS).padStart(2, "0")}
        </span>
        {step > 0 && (
          <button
            onClick={() => setStep(step - 1)}
            className="font-mono text-xs uppercase tracking-[0.2em] text-fg-faint transition-colors hover:text-fg"
          >
            {t("back")}
          </button>
        )}
      </div>

      <h2 className="mt-6 text-2xl font-semibold leading-snug md:text-3xl">
        {t(`questions.${question.id}.prompt`)}
      </h2>
      {question.hasHelper && (
        <p className="mt-2 text-sm text-fg-muted">
          {t(`questions.${question.id}.helper`)}
        </p>
      )}

      <div className="mt-10 flex flex-col gap-3">
        {options.map((label, i) => (
          <button
            key={label}
            onClick={() => selectOption(i)}
            className={`flex items-center justify-between border px-6 py-4 text-left transition-colors duration-150 ${
              selected === i
                ? "border-signal text-signal"
                : "border-line-strong text-fg hover:border-fg-muted"
            }`}
          >
            <span className="text-sm md:text-base">{label}</span>
            <span className="font-mono text-xs text-fg-faint">
              {String(i + 1).padStart(2, "0")}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}
