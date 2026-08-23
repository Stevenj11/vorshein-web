export function SectionLabel({
  index,
  children,
}: {
  index?: string;
  children: string;
}) {
  return (
    <div className="flex items-center gap-3 text-fg-faint">
      {index && (
        <span className="font-mono text-xs tracking-[0.2em]">{index}</span>
      )}
      <span className="h-px w-8 bg-line-strong" />
      <span className="font-mono text-xs uppercase tracking-[0.3em]">
        {children}
      </span>
    </div>
  );
}
