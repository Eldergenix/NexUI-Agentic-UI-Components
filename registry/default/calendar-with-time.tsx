"use client";

/**
 * CalendarWithTime — adapted from coss p-calendar-18.
 *
 * Adaptation notes:
 * - Same Field/InputGroup substitution as CalendarWithDateInput: replaced with
 *   a plain `<label>` + token-styled `<input type="time">` and a positioned
 *   `<ClockIcon>` from lucide-react.
 * - The time is stored separately from the date as an `HH:MM:SS` string (the
 *   coss source did the same — date and time are kept decoupled and `step="1"`
 *   exposes seconds in the native time picker).
 */

import * as React from "react";
import { ClockIcon } from "lucide-react";
import { Calendar } from "@/registry/default/calendar";

export interface CalendarWithTimeProps {
  /** Initial selected date. Defaults to today. */
  defaultDate?: Date;
  /** Initial time string in `HH:MM:SS`. Defaults to `12:00:00`. */
  defaultTime?: string;
  /** Optional callback whenever the date or time changes. */
  onChange?: (next: { date: Date | undefined; time: string }) => void;
}

export function CalendarWithTime({
  defaultDate,
  defaultTime = "12:00:00",
  onChange,
}: CalendarWithTimeProps) {
  const initial = defaultDate ?? new Date();
  const [date, setDate] = React.useState<Date | undefined>(initial);
  const [month, setMonth] = React.useState<Date>(initial);
  const [timeValue, setTimeValue] = React.useState<string>(defaultTime);

  const handleDayPickerSelect = (selectedDate: Date | undefined) => {
    setDate(selectedDate);
    if (selectedDate) {
      setMonth(selectedDate);
    }
    onChange?.({ date: selectedDate, time: timeValue });
  };

  const handleTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const next = e.target.value;
    setTimeValue(next);
    onChange?.({ date, time: next });
  };

  return (
    <div className="flex flex-col gap-3">
      <Calendar
        mode="single"
        month={month}
        onMonthChange={setMonth}
        onSelect={handleDayPickerSelect}
        selected={date}
      />
      <label className="flex flex-row items-center gap-3 text-sm">
        <span className="whitespace-nowrap text-xs text-[var(--muted-foreground)]">
          Enter time
        </span>
        <div className="relative grow">
          <input
            aria-label="Select time"
            type="time"
            step={1}
            value={timeValue}
            onChange={handleTimeChange}
            className="w-full rounded-md border border-[var(--border)] bg-[var(--background)] px-3 py-2 pr-9 text-sm text-[var(--foreground)] placeholder:text-[var(--muted-foreground)] focus:outline-none focus:ring-2 focus:ring-[var(--ring)] [&::-webkit-calendar-picker-indicator]:hidden [&::-webkit-calendar-picker-indicator]:appearance-none"
          />
          <ClockIcon
            aria-hidden="true"
            className="absolute right-2 top-1/2 -translate-y-1/2 h-4 w-4 text-[var(--muted-foreground)] pointer-events-none"
          />
        </div>
      </label>
    </div>
  );
}

CalendarWithTime.displayName = "CalendarWithTime";

export default CalendarWithTime;
