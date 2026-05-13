"use client";

/**
 * CalendarPricing — adapted from coss p-calendar-24.
 *
 * Adaptation notes:
 * - Source generated mock prices internally only. This version still seeds the
 *   same 180-day mock for the demo, but exposes a `prices` prop so callers can
 *   inject their own `{ "yyyy-MM-dd": number }` dataset.
 * - Source used `text-emerald-500` for good prices and `text-muted-foreground`
 *   for the rest. We keep emerald (Tailwind hardcoded color stays readable in
 *   both themes) but route the non-good case through `var(--muted-foreground)`.
 * - Source used `in-data-selected:text-primary-foreground/70` (Tailwind v4
 *   variant). We adopt `data-[selected=true]:text-[var(--background)]/70` via
 *   the wrapping `<td>`'s data-selected attribute by using the `group/day`
 *   approach: selected day buttons inherit foreground via the Calendar
 *   primitive, so the inner price span just dims via opacity.
 */

import * as React from "react";
import { format } from "date-fns";
import type { DayButtonProps } from "react-day-picker";
import { cn } from "@/registry/default/lib/utils";
import { Calendar } from "@/registry/default/calendar";

const GOOD_PRICE_THRESHOLD = 100;

export interface CalendarPricingProps {
  /** Optional price map keyed by `yyyy-MM-dd`. Falls back to a 180-day mock. */
  prices?: Record<string, number>;
  /** Initial selected date. Defaults to today. */
  defaultDate?: Date;
}

function generateMockPriceData(): Record<string, number> {
  const data: Record<string, number> = {};
  const today = new Date();
  for (let i = 0; i < 180; i++) {
    const d = new Date(today);
    d.setDate(today.getDate() + i);
    const key = format(d, "yyyy-MM-dd");
    data[key] = Math.floor(Math.random() * (200 - 80 + 1)) + 80;
  }
  return data;
}

export function CalendarPricing({
  prices,
  defaultDate,
}: CalendarPricingProps) {
  const [date, setDate] = React.useState<Date | undefined>(
    defaultDate ?? new Date()
  );
  const [internalPrices, setInternalPrices] = React.useState<
    Record<string, number>
  >({});

  React.useEffect(() => {
    if (!prices) {
      setInternalPrices(generateMockPriceData());
    }
  }, [prices]);

  const priceMap = prices ?? internalPrices;

  const isDateDisabled = (d: Date) => {
    return priceMap[format(d, "yyyy-MM-dd")] === undefined;
  };

  return (
    <Calendar
      mode="single"
      numberOfMonths={2}
      pagedNavigation
      showOutsideDays={false}
      selected={date}
      onSelect={setDate}
      disabled={isDateDisabled}
      classNames={{
        day_button: cn(
          "size-12 p-0 font-normal rounded-md",
          "hover:bg-[var(--accent)] hover:text-[var(--accent-foreground)]",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring)]"
        ),
        month:
          "relative space-y-4 first-of-type:before:hidden before:absolute max-md:before:inset-x-2 max-md:before:h-px max-md:before:-top-4 md:before:inset-y-2 md:before:w-px before:bg-[var(--border)] md:before:-left-4",
        months: "flex sm:flex-col md:flex-row gap-8",
        today: "*:after:hidden",
        weekday:
          "w-12 text-[var(--muted-foreground)] font-normal text-[0.75rem] uppercase tracking-wide",
        day: cn(
          "relative h-12 w-12 p-0 text-center text-sm rounded-md",
          "focus-within:relative focus-within:z-20",
          "[&:has([aria-selected])]:bg-[var(--accent)]"
        ),
      }}
      components={{
        DayButton: (props: DayButtonProps) => (
          <PricingDayButton {...props} prices={priceMap} />
        ),
      }}
    />
  );
}

function PricingDayButton(
  props: DayButtonProps & { prices: Record<string, number> }
) {
  const { day, prices, modifiers: _modifiers, children, ...buttonProps } = props;
  const price = prices[format(day.date, "yyyy-MM-dd")];
  const isGoodPrice = price !== undefined && price < GOOD_PRICE_THRESHOLD;

  return (
    <button {...buttonProps}>
      <span className="flex flex-col items-center justify-center leading-tight">
        <span>{children}</span>
        {price !== undefined && (
          <span
            className={cn(
              "font-normal text-xs mt-0.5",
              isGoodPrice
                ? "text-emerald-500"
                : "text-[var(--muted-foreground)] data-[selected=true]:text-[var(--background)]/70"
            )}
          >
            ${price}
          </span>
        )}
      </span>
    </button>
  );
}

CalendarPricing.displayName = "CalendarPricing";

export default CalendarPricing;
