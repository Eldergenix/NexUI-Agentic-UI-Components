"use client";

import * as React from "react";
import { DayPicker, type DayPickerProps } from "react-day-picker";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/registry/default/lib/utils";

/**
 * Calendar — `react-day-picker` v10 themed for nexUI.
 *
 * Theme tokens used:
 * - `--foreground`, `--muted-foreground`, `--accent`, `--accent-foreground`
 * - `--primary-foreground` for selected days
 * - `--border`, `--ring`
 * - Surface and shadow ladder (`--shadow-1` for the chrome ring)
 *
 * Day buttons fall through to the consumer's `classNames` override when
 * provided — that's how `p-calendar-24` (pricing) injects its own size and
 * removes the today indicator.
 */

export type CalendarProps = DayPickerProps & {
  className?: string;
  classNames?: Partial<DayPickerProps["classNames"]>;
};

export function Calendar({
  className,
  classNames,
  showOutsideDays = true,
  ...props
}: CalendarProps) {
  return (
    <DayPicker
      showOutsideDays={showOutsideDays}
      className={cn("p-3 text-[var(--foreground)]", className)}
      classNames={{
        months: "flex flex-col sm:flex-row gap-6",
        month: "space-y-4",
        month_caption: "flex justify-center pt-1 relative items-center text-sm font-medium",
        caption_label: "text-sm font-medium",
        nav: "flex items-center gap-1",
        button_previous: cn(
          "inline-flex items-center justify-center rounded-md h-7 w-7 absolute left-1 top-1",
          "hover:bg-[var(--accent)] hover:text-[var(--accent-foreground)]",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring)]"
        ),
        button_next: cn(
          "inline-flex items-center justify-center rounded-md h-7 w-7 absolute right-1 top-1",
          "hover:bg-[var(--accent)] hover:text-[var(--accent-foreground)]",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring)]"
        ),
        month_grid: "w-full border-collapse space-y-1",
        weekdays: "flex",
        weekday:
          "text-[var(--muted-foreground)] rounded-md w-9 font-normal text-[0.75rem] uppercase tracking-wide",
        week: "flex w-full mt-2",
        day: cn(
          "relative h-9 w-9 p-0 text-center text-sm rounded-md",
          "focus-within:relative focus-within:z-20",
          "[&:has([aria-selected])]:bg-[var(--accent)]"
        ),
        day_button: cn(
          "h-9 w-9 p-0 font-normal aria-selected:opacity-100 rounded-md",
          "hover:bg-[var(--accent)] hover:text-[var(--accent-foreground)]",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring)]"
        ),
        selected: cn(
          "data-[selected=true]:bg-[var(--foreground)] data-[selected=true]:text-[var(--background)]",
          "data-[selected=true]:hover:bg-[var(--foreground)] data-[selected=true]:focus:bg-[var(--foreground)]"
        ),
        today:
          "after:content-[''] after:absolute after:bottom-1 after:left-1/2 after:-translate-x-1/2 after:h-1 after:w-1 after:rounded-full after:bg-[var(--foreground)]/40",
        outside:
          "text-[var(--muted-foreground)]/40 aria-selected:bg-[var(--accent)]/50 aria-selected:text-[var(--muted-foreground)]",
        disabled: "text-[var(--muted-foreground)]/30 cursor-not-allowed",
        range_middle:
          "aria-selected:bg-[var(--accent)] aria-selected:text-[var(--accent-foreground)]",
        hidden: "invisible",
        ...classNames,
      }}
      components={{
        Chevron: ({ orientation, ...rest }) =>
          orientation === "left" ? (
            <ChevronLeft className="h-4 w-4" {...rest} />
          ) : (
            <ChevronRight className="h-4 w-4" {...rest} />
          ),
        ...props.components,
      }}
      {...props}
    />
  );
}
Calendar.displayName = "Calendar";
