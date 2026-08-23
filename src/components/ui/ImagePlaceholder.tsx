"use client";

import Image from "next/image";
import { useRef, useState } from "react";

type ImagePlaceholderProps = {
  label: string;
  spec?: string;
  className?: string;
  aspect?: string;
  src?: string;
};

/**
 * Stand-in for real photography/video, styled to belong in the layout
 * rather than read as a broken image — and interactive, so it doesn't sit
 * inert on the page while everything around it moves. Once a real asset
 * exists, pass `src` and this renders the photo itself (still with the
 * hover tilt/frame) instead of the placeholder icon and label.
 */
export function ImagePlaceholder({
  label,
  spec,
  className = "",
  aspect = "aspect-[4/5]",
  src,
}: ImagePlaceholderProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const [hovering, setHovering] = useState(false);

  function handleMouseMove(e: React.MouseEvent<HTMLDivElement>) {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const px = (e.clientX - rect.left) / rect.width - 0.5;
    const py = (e.clientY - rect.top) / rect.height - 0.5;
    setTilt({ x: py * -6, y: px * 6 });
  }

  function handleLeave() {
    setHovering(false);
    setTilt({ x: 0, y: 0 });
  }

  return (
    <div style={{ perspective: 1000 }} className={className}>
      <div
        ref={ref}
        onMouseMove={handleMouseMove}
        onMouseEnter={() => setHovering(true)}
        onMouseLeave={handleLeave}
        className={`group relative overflow-hidden border border-line-strong bg-panel transition-[border-color] duration-300 ${
          hovering ? "border-signal/50" : ""
        } ${aspect}`}
        style={{
          transform: `rotateX(${tilt.x}deg) rotateY(${tilt.y}deg) scale(${hovering ? 1.02 : 1})`,
          transition: hovering
            ? "transform 100ms ease-out, border-color 300ms"
            : "transform 400ms cubic-bezier(0.16,1,0.3,1), border-color 300ms",
          transformStyle: "preserve-3d",
        }}
      >
        {src ? (
          <>
            <Image
              src={src}
              alt={label}
              fill
              sizes="(min-width: 768px) 50vw, 100vw"
              className="object-cover transition-transform duration-500"
              style={{ transform: hovering ? "scale(1.04)" : "scale(1)" }}
              priority={false}
            />
            <div
              className="pointer-events-none absolute inset-0 transition-opacity duration-500"
              style={{
                opacity: hovering ? 0.12 : 0.28,
                background:
                  "linear-gradient(to top, rgba(4,6,8,0.55), transparent 55%)",
              }}
            />
          </>
        ) : (
          <>
            <div
              className="absolute inset-0 transition-opacity duration-500"
              style={{
                opacity: hovering ? 0.32 : 0.18,
                backgroundImage:
                  "linear-gradient(var(--line-strong) 1px, transparent 1px), linear-gradient(90deg, var(--line-strong) 1px, transparent 1px)",
                backgroundSize: "28px 28px",
              }}
            />
            <div
              className="pointer-events-none absolute inset-0 transition-opacity duration-500"
              style={{
                opacity: hovering ? 1 : 0.5,
                background:
                  "radial-gradient(ellipse at 50% 40%, rgba(76,201,240,0.14), transparent 65%)",
              }}
            />

            <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 p-6 text-center">
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth={1.2}
                className={`h-8 w-8 transition-all duration-300 ${
                  hovering ? "scale-110 text-signal" : "text-fg-faint"
                }`}
              >
                <rect x="3" y="4" width="18" height="15" rx="1.5" />
                <circle cx="8.5" cy="9.5" r="1.5" />
                <path d="M21 15l-5.5-5.5a1.5 1.5 0 0 0-2.1 0L4 19" />
              </svg>
              <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-fg-faint">
                {label}
              </span>
              {spec && (
                <span
                  className={`font-mono text-[9px] uppercase tracking-[0.15em] text-fg-faint transition-opacity duration-300 ${
                    hovering ? "opacity-100" : "opacity-0"
                  }`}
                >
                  {spec}
                </span>
              )}
            </div>
          </>
        )}

        {(
          [
            ["left-3 top-3", "border-l border-t"],
            ["right-3 top-3", "border-r border-t"],
            ["bottom-3 left-3", "border-b border-l"],
            ["bottom-3 right-3", "border-b border-r"],
          ] as const
        ).map(([pos, border]) => (
          <div
            key={pos}
            className={`absolute ${pos} ${border} border-signal/40 transition-all duration-300`}
            style={{
              width: hovering ? 14 : 8,
              height: hovering ? 14 : 8,
              opacity: hovering ? 1 : 0.6,
            }}
          />
        ))}
      </div>
    </div>
  );
}
