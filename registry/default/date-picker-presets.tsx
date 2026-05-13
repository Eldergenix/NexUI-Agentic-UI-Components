"use client";

/**
 * DatePickerPresets — adapted from coss p-date-picker-4.
 *
 * Adaptation notes:
 * - Source used `variant="outline"` on the trigger and `variant="ghost"` on the
 *   preset buttons. FF's Button has no "outline" variant, so the trigger maps
 *   to `variant="secondary"` (tonal surface that reads as "outlined" on both
 *   themes). Ghost stays ghost.
 * - Source used Base UI / coss popover with `<PopoverTrigger render={<Button/>}>`.
 *   Our popover is Radix-based: `PopoverTrigger` accepts `asChild` and merges
 *   into the FF Button child via Slot.
 * - Uses `PopoverContent` (canonical name) — `PopoverPopup` is just an alias.
 * - Preset list uses `var(--border)` for the dividing rule between presets and
 *   calendar so it works in both themes without hardcoded grays.
 */

import * as React from "react";
import { addDays, format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { Button } from "@/registry/default/button";
import { Calendar } from "@/registry/default/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/registry/default/popover";
import { cn } from "@/registry/default/lib/utils";

export interface DatePickerPresetsProps {
  /** Initial selected date. Defaults to today. */
  defaultDate?: Date;
  /** Optional callback whenever the selected date changes. */
  onDateChange?: (date: Date | undefined) => void;
  /** Optional className applied to the trigger Button. */
  className?: string;
}

interface Preset {
  label: string;
  getDate: (today: Date) => Date;
}

const PRESETS: Preset[] = [
  { label: "Today", getDate: (t) => t },
  { label: "Tomorrow", getDate: (t) => addDays(t, 1) },
  { label: "In 3 days", getDate: (t) => addDays(t, 3) },
  { label: "In a week", getDate: (t) => addDays(t, 7) },
];

export function DatePickerPresets({
  defaultDate,
  onDateChange,
  className,
}: DatePickerPresetsProps) {
  const today = React.useMemo(() => new Date(), []);
  const initial = defaultDate ?? today;
  const [month, setMonth] = React.useState<Date>(initial);
  const [date, setDate] = React.useState<Date | undefined>(initial);

  const updateDate = (next: Date | undefined) => {
    setDate(next);
    onDateChange?.(next);
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="secondary"
          className={cn("w-full justify-start gap-2", className)}
        >
          <CalendarIcon aria-hidden="true" className="h-4 w-4" />
          <span>{date ? format(date, "PPP") : "Pick a date"}</span>
        </Button>
      </PopoverTrigger>
      <PopoverContent
        align="start"
        className="w-auto p-0 overflow-hidden"
      >
        <div className="flex max-sm:flex-col">
          <div className="flex flex-col gap-1 py-2 ps-2 pe-3 max-sm:order-1 max-sm:border-t max-sm:border-[var(--border)] sm:border-e sm:border-[var(--border)]">
            {PRESETS.map((preset) => (
              <Button
                key={preset.label}
                variant="ghost"
                size="sm"
                className="w-full justify-start"
                onClick={() => {
                  const next = preset.getDate(today);
                  updateDate(next);
                  setMonth(next);
                }}
              >
                {preset.label}
              </Button>
            ))}
          </div>
          <Calendar
            className="max-sm:pb-3 sm:ps-2"
            mode="single"
            month={month}
            onMonthChange={setMonth}
            onSelect={updateDate}
            selected={date}
          />
        </div>
      </PopoverContent>
    </Popover>
  );
}

DatePickerPresets.displayName = "DatePickerPresets";

export default DatePickerPresets;
