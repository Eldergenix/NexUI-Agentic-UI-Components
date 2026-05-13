"use client";

/**
 * CalendarWithDateInput — adapted from coss p-calendar-17.
 *
 * Adaptation notes:
 * - Source used `<Field>`, `<FieldLabel>`, `<InputGroup>`, `<InputGroupInput>`,
 *   `<InputGroupAddon>` from a "field"/"input-group" registry that nexUI does
 *   not vendor. Replaced with a plain `<label>` + token-styled `<input>` and
 *   a positioned `<CalendarIcon>` from lucide-react.
 * - Hides the native webkit calendar picker indicator (the OS chrome would
 *   collide visually with our absolute-positioned icon).
 * - Date round-trips through `yyyy-MM-dd` ISO format; invalid input does NOT
 *   clear the selected date — it just halts the sync until the user makes
 *   the string valid again, matching the coss behaviour.
 */

import * as React from "react";
import { format, isValid, parse } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { Calendar } from "@/registry/default/calendar";

export interface CalendarWithDateInputProps {
  /** Initial selected date. Defaults to today. */
  defaultDate?: Date;
  /** Optional callback whenever the selected date changes. */
  onDateChange?: (date: Date | undefined) => void;
}

export function CalendarWithDateInput({
  defaultDate,
  onDateChange,
}: CalendarWithDateInputProps) {
  const initial = defaultDate ?? new Date();
  const [date, setDate] = React.useState<Date | undefined>(initial);
  const [month, setMonth] = React.useState<Date>(initial);
  const [inputValue, setInputValue] = React.useState(() =>
    format(initial, "yyyy-MM-dd")
  );

  const updateDate = (next: Date | undefined) => {
    setDate(next);
    onDateChange?.(next);
  };

  const handleDayPickerSelect = (selectedDate: Date | undefined) => {
    if (!selectedDate) {
      setInputValue("");
      updateDate(undefined);
    } else {
      updateDate(selectedDate);
      setMonth(selectedDate);
      setInputValue(format(selectedDate, "yyyy-MM-dd"));
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setInputValue(value);

    if (value) {
      const parsed = parse(value, "yyyy-MM-dd", new Date());
      if (isValid(parsed)) {
        updateDate(parsed);
        setMonth(parsed);
      }
    } else {
      updateDate(undefined);
    }
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
      <label className="flex flex-row items-center gap-4 text-sm">
        <span className="whitespace-nowrap text-[var(--muted-foreground)]">
          Enter date
        </span>
        <div className="relative flex-1">
          <input
            aria-label="Select date"
            type="date"
            value={inputValue}
            onChange={handleInputChange}
            className="w-full rounded-md border border-[var(--border)] bg-[var(--background)] px-3 py-2 pr-9 text-sm text-[var(--foreground)] placeholder:text-[var(--muted-foreground)] focus:outline-none focus:ring-2 focus:ring-[var(--ring)] [&::-webkit-calendar-picker-indicator]:hidden [&::-webkit-calendar-picker-indicator]:appearance-none"
          />
          <CalendarIcon
            aria-hidden="true"
            className="absolute right-2 top-1/2 -translate-y-1/2 h-4 w-4 text-[var(--muted-foreground)] pointer-events-none"
          />
        </div>
      </label>
    </div>
  );
}

CalendarWithDateInput.displayName = "CalendarWithDateInput";

export default CalendarWithDateInput;
