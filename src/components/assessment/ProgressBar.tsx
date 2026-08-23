export function ProgressBar({ progress }: { progress: number }) {
  return (
    <div className="h-px w-full bg-line">
      <div
        className="h-px bg-signal transition-all duration-500 ease-out"
        style={{ width: `${Math.min(100, Math.max(0, progress))}%` }}
      />
    </div>
  );
}
