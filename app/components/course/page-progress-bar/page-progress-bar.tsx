import * as React from "react";

/**
 * PageProgressBar (Auto mode only, shadcn style, low-jank)
 * ------------------------------------------------------------
 * - Imperative rAF animation to reduce React re-renders (smoother)
 * - Time-based progress: starts moderate, gradually slows (asymptotic to ~95%)
 * - Never stops completely - keeps trickling for natural feel
 * - On finish: smoothly animates to 100% with dynamic duration
 */

export type PageProgressBarProps = {
  /** Toggle loading state */
  isLoading: boolean;
  /** Height of the bar in px (default 3). */
  height?: number;
  /** Where to pin the bar (default 'top'). */
  position?: "top" | "bottom";
  /** Extra class applied to outer container. */
  className?: string;
  /** Extra class for the inner moving bar (default `bg-primary`). */
  barClassName?: string;
  /** If true, a subtle shimmer will appear. */
  shimmer?: boolean;
  /** z-index (default 50). */
  zIndex?: number;
  /** Fully unmount when idle (default true). */
  unmountWhenIdle?: boolean;
  /** Called after the bar snaps to 100% and its transition completes. */
  onComplete?: () => void;
};

export function PageProgressBar({
  isLoading,
  height = 3,
  position = "top",
  className,
  barClassName = "bg-primary",
  shimmer = true,
  zIndex = 50,
  unmountWhenIdle = true,
  onComplete,
}: PageProgressBarProps) {
  const barRef = React.useRef<HTMLDivElement | null>(null);
  const rafRef = React.useRef<number | null>(null);
  const progressRef = React.useRef(0); // 0..1 (visual state)
  const startTimeRef = React.useRef<number | null>(null);

  // Apply transform without causing React re-render
  const apply = (value: number) => {
    progressRef.current = value;
    if (barRef.current) {
      barRef.current.style.transform = `scaleX(${value})`;
    }
  };

  // Time-based trickle animation for natural feel
  // - Starts moderate, slows down gradually
  // - Never stops completely (keeps trickling slowly)
  // - Uses asymptotic approach to ~95% (not 85%)
  const startLoop = React.useCallback(() => {
    startTimeRef.current = performance.now();

    const step = (now: number) => {
      const elapsed = now - (startTimeRef.current ?? now);
      const prev = progressRef.current;

      // Calculate target based on time (asymptotic curve)
      // Fast initial progress, then gradual slowdown
      // Approaches ~95% over time, but never stops
      const timeTarget = 0.95 * (1 - Math.exp(-elapsed / 3000)); // 3s time constant

      // Smooth interpolation toward time-based target
      // This creates a natural feel where progress always moves
      const speed = 0.08; // Lower = smoother, slower interpolation
      const next = prev + (timeTarget - prev) * speed;

      // Add tiny constant trickle to prevent "stuck" feeling
      const trickle = 0.0002;
      const final = Math.min(0.95, next + trickle);

      apply(final);
      rafRef.current = requestAnimationFrame(step);
    };

    rafRef.current = requestAnimationFrame(step);
  }, []);

  const stopLoop = () => {
    if (rafRef.current != null) {
      cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
    }
  };

  // Start/stop behavior
  React.useEffect(() => {
    if (isLoading) {
      // Reset progress for new loading cycle
      apply(0);
      startTimeRef.current = null;
      if (barRef.current) {
        barRef.current.style.transition = "none";
      }
      // Small delay to ensure reset is applied before starting
      requestAnimationFrame(() => {
        if (barRef.current) {
          barRef.current.style.transition = `transform 100ms ease-out`;
        }
        startLoop();
      });
    } else if (progressRef.current > 0) {
      // Finishing: smoothly animate to 100%
      stopLoop();
      if (barRef.current) {
        // Calculate appropriate duration based on remaining distance
        const remaining = 1 - progressRef.current;
        const duration = Math.max(200, Math.min(400, remaining * 800));
        barRef.current.style.transition = `transform ${duration}ms ease-out`;

        const onEnd = () => {
          barRef.current?.removeEventListener("transitionend", onEnd);
          onComplete?.();
          // Fade out delay before reset
          const t = setTimeout(() => apply(0), 400);
          return () => clearTimeout(t);
        };
        barRef.current.addEventListener("transitionend", onEnd, { once: true });
        apply(1);
      } else {
        apply(1);
        onComplete?.();
      }
    }

    return () => stopLoop();
  }, [isLoading, startLoop, onComplete]);

  if (unmountWhenIdle && !isLoading) return null;

  return (
    <div
      aria-hidden
      className={[
        "pointer-events-none fixed inset-x-0",
        position === "top" ? "top-0" : "bottom-0",
        className ?? "",
      ].join(" ")}
      style={{ height, zIndex }}
    >
      <div className="relative h-full overflow-hidden">
        <div
          ref={barRef}
          className={[
            "h-full w-full origin-left will-change-transform",
            // We control transition inline, but keep a minimal default
            "transition-transform",
            barClassName,
          ].join(" ")}
          style={{ transform: `scaleX(0)` }}
        />

        {shimmer && (
          <div
            className="pointer-events-none absolute inset-y-0 right-0 w-20"
            style={{
              background:
                "linear-gradient(90deg, rgba(255,255,255,0), rgba(255,255,255,0.18), rgba(255,255,255,0))",
              mixBlendMode: "overlay",
            }}
          />
        )}
      </div>
    </div>
  );
}
