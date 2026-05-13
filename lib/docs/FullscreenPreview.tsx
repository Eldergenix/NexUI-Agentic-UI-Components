"use client";

/**
 * FullscreenPreview — wraps a doc-page demo so it can be expanded to fill the
 * entire viewport (e.g. for shell layouts where the framed-height preview is
 * cramped). Press the corner button to toggle; ESC collapses.
 *
 * Children stay mounted between collapsed/expanded states so internal React
 * state and any animations are preserved.
 */

import * as React from "react";
import { Maximize2, Minimize2 } from "lucide-react";
import { cn } from "@/registry/default/lib/utils";

export interface FullscreenPreviewProps
  extends React.HTMLAttributes<HTMLDivElement> {
  /** Collapsed height (CSS length). Default: 640px. */
  height?: string | number;
  /** Optional className appended to the wrapper. */
  className?: string;
  children: React.ReactNode;
}

export function FullscreenPreview({
  height = "640px",
  className,
  children,
  ...props
}: FullscreenPreviewProps) {
  const [expanded, setExpanded] = React.useState(false);

  React.useEffect(() => {
    if (!expanded) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setExpanded(false);
    };
    document.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [expanded]);

  const heightStyle =
    typeof height === "number" ? `${height}px` : height;

  return (
    <div
      data-fullscreen-preview
      data-expanded={expanded || undefined}
      className={cn(
        "relative w-full overflow-hidden border border-border bg-background",
        "transition-[border-radius] duration-200",
        expanded
          ? "fixed inset-0 z-50 rounded-none"
          : "rounded-xl",
        className,
      )}
      style={!expanded ? { height: heightStyle } : undefined}
      {...props}
    >
      <button
        type="button"
        onClick={() => setExpanded((e) => !e)}
        aria-label={expanded ? "Exit fullscreen (Esc)" : "Expand to fullscreen"}
        title={expanded ? "Exit fullscreen (Esc)" : "Expand to fullscreen"}
        className={cn(
          "absolute z-[60] inline-flex items-center justify-center size-8 rounded-md",
          "bg-card text-muted-foreground border border-border",
          "shadow-[0_2px_4px_-1px_rgba(0,0,0,0.06),_0_1px_1px_rgba(0,0,0,0.04)]",
          "transition-colors outline-none",
          "hover:bg-accent hover:text-foreground",
          "focus-visible:ring-2 focus-visible:ring-ring",
          expanded ? "top-4 right-4" : "top-3 right-3",
        )}
      >
        {expanded ? (
          <Minimize2 className="size-3.5" />
        ) : (
          <Maximize2 className="size-3.5" />
        )}
      </button>

      {expanded && (
        <span
          className="absolute top-5 right-14 z-[60] text-[11px] font-medium text-muted-foreground select-none pointer-events-none"
          aria-hidden
        >
          Press <kbd className="font-mono px-1 py-0.5 rounded bg-muted text-foreground/80">Esc</kbd> to exit
        </span>
      )}

      {children}
    </div>
  );
}
