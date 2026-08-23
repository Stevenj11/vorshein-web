let audioContext: AudioContext | null = null;

/**
 * Every sound here is synthesized in real time with the Web Audio API —
 * there is no audio file. That keeps this honest: we don't have licensed
 * SFX yet, so nothing here pretends to be a real recorded sound design
 * asset. If real SFX are produced later, swap these calls for <Audio> /
 * HTMLAudioElement playback and leave the call sites unchanged.
 */
function getContext(): AudioContext | null {
  if (typeof window === "undefined") return null;
  const AudioCtx =
    window.AudioContext ||
    (window as unknown as { webkitAudioContext?: typeof AudioContext })
      .webkitAudioContext;
  if (!AudioCtx) return null;

  if (!audioContext) {
    audioContext = new AudioCtx();
  }
  if (audioContext.state === "suspended") {
    void audioContext.resume();
  }
  return audioContext;
}

/**
 * A single soft, filtered note: fundamental + a quiet octave layer for
 * warmth, run through a low-pass filter so nothing reads as a harsh
 * "computer beep" — closer to a muted bell than an alert tone.
 */
function note(
  ctx: AudioContext,
  freq: number,
  startOffset: number,
  duration: number,
  peakGain: number,
) {
  const start = ctx.currentTime + startOffset;

  const filter = ctx.createBiquadFilter();
  filter.type = "lowpass";
  filter.frequency.value = 1800;
  filter.Q.value = 0.4;
  filter.connect(ctx.destination);

  const master = ctx.createGain();
  master.gain.setValueAtTime(0, start);
  master.gain.linearRampToValueAtTime(peakGain, start + 0.05);
  master.gain.exponentialRampToValueAtTime(0.0001, start + duration);
  master.connect(filter);

  const fundamental = ctx.createOscillator();
  fundamental.type = "sine";
  fundamental.frequency.setValueAtTime(freq, start);
  fundamental.connect(master);
  fundamental.start(start);
  fundamental.stop(start + duration + 0.1);

  const overtone = ctx.createOscillator();
  overtone.type = "sine";
  overtone.frequency.setValueAtTime(freq * 2, start);
  const overtoneGain = ctx.createGain();
  overtoneGain.gain.value = 0.28;
  overtone.connect(overtoneGain);
  overtoneGain.connect(master);
  overtone.start(start);
  overtone.stop(start + duration + 0.1);
}

/** A soft, slow ascending sweep — played while the assessment is being scored. */
export function playAnalysisSound() {
  const ctx = getContext();
  if (!ctx) return;
  note(ctx, 392, 0, 0.32, 0.035); // G4
  note(ctx, 466, 0.22, 0.32, 0.035); // A#4/Bb4
  note(ctx, 587, 0.46, 0.4, 0.038); // D5
}

/** A short, warm resolving chime — played when the result is revealed. */
export function playConfirmSound() {
  const ctx = getContext();
  if (!ctx) return;
  note(ctx, 523, 0, 0.4, 0.045); // C5
  note(ctx, 784, 0.14, 0.55, 0.04); // G5
}
