"use client";

import { useEffect, useState } from "react";
import { markIntroDone } from "@/lib/introLoaderState";
import { Logo } from "./Logo";

type Phase = "enter" | "hold" | "exit" | "done";

const TIMINGS = { enter: 800, hold: 1300, exit: 700 } as const;
const TOTAL = TIMINGS.enter + TIMINGS.hold + TIMINGS.exit;

/**
 * Full-screen brand moment shown once per page load (lives in the root
 * layout, which persists across client-side navigation, so it never
 * replays on route changes — only on a real reload).
 */
export function IntroLoader() {
  const [phase, setPhase] = useState<Phase>("enter");
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const t1 = window.setTimeout(() => setPhase("hold"), TIMINGS.enter);
    const t2 = window.setTimeout(
      () => setPhase("exit"),
      TIMINGS.enter + TIMINGS.hold,
    );
    const t3 = window.setTimeout(() => {
      setPhase("done");
      markIntroDone();
    }, TOTAL);

    const start = performance.now();
    let raf = 0;
    const tick = (now: number) => {
      const pct = Math.min(100, Math.round(((now - start) / TOTAL) * 100));
      setProgress(pct);
      if (pct < 100) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);

    return () => {
      window.clearTimeout(t1);
      window.clearTimeout(t2);
      window.clearTimeout(t3);
      cancelAnimationFrame(raf);
    };
  }, []);

  useEffect(() => {
    if (phase === "enter" || phase === "hold") {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [phase]);

  if (phase === "done") return null;

  const visible = phase === "enter" || phase === "hold";

  return (
    <div
      aria-hidden
      className="fixed inset-0 z-[999] flex items-center justify-center bg-void transition-opacity ease-out"
      style={{
        opacity: phase === "exit" ? 0 : 1,
        transitionDuration: `${TIMINGS.exit}ms`,
        pointerEvents: visible ? "auto" : "none",
      }}
    >
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.14]"
        style={{
          backgroundImage:
            "linear-gradient(var(--line-strong) 1px, transparent 1px), linear-gradient(90deg, var(--line-strong) 1px, transparent 1px)",
          backgroundSize: "56px 56px",
        }}
      />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_50%_50%,rgba(76,201,240,0.08),transparent_60%)]" />

      <div
        className="relative flex flex-col items-center transition-all ease-out"
        style={{
          transitionDuration: `${TIMINGS.enter}ms`,
          opacity: phase === "enter" ? 0 : 1,
          transform: phase === "enter" ? "scale(0.8)" : "scale(1)",
        }}
      >
        <div className="relative flex h-32 w-32 items-center justify-center">
          <div
            className="absolute -inset-8 rounded-full border border-signal/25 transition-all ease-out"
            style={{
              transitionDuration: `${TIMINGS.enter + TIMINGS.hold}ms`,
              opacity: phase === "hold" ? 0 : 0.7,
              transform: phase === "hold" ? "scale(1.9)" : "scale(1)",
            }}
          />
          <div
            className="absolute -inset-3 rounded-full border border-signal/40 transition-all ease-out"
            style={{
              transitionDuration: `${TIMINGS.enter + TIMINGS.hold * 0.7}ms`,
              opacity: phase === "hold" ? 0 : 0.8,
              transform: phase === "hold" ? "scale(1.4)" : "scale(1)",
            }}
          />
          {/* A framed plate, not a floating cutout — reads as a deliberate
              ID/scan badge rather than a logo pasted over the background. */}
          <div className="relative flex h-24 w-24 items-center justify-center overflow-hidden border border-line-strong bg-panel">
            <Logo size={56} />
            {(phase === "enter" || phase === "hold") && (
              <div
                className="pointer-events-none absolute left-0 right-0 h-10 bg-gradient-to-b from-transparent via-signal/50 to-transparent"
                style={{ animation: "loader-scan 1.6s ease-in-out infinite" }}
              />
            )}
          </div>
        </div>

        <div
          className="mt-8 flex flex-col items-center gap-3 transition-opacity"
          style={{
            transitionDuration: "300ms",
            opacity: phase === "hold" ? 1 : 0,
          }}
        >
          <div className="h-px w-32 overflow-hidden bg-line">
            <div
              className="h-px bg-signal transition-[width] duration-150 ease-linear"
              style={{ width: `${progress}%` }}
            />
          </div>
          <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-fg-faint tabular-nums">
            {String(progress).padStart(3, "0")}
          </span>
        </div>
      </div>
    </div>
  );
}
