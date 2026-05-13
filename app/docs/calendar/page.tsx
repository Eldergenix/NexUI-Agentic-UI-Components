"use client";

import { useState } from "react";
import type { DateRange } from "react-day-picker";
import { Calendar } from "@/registry/default/calendar";
import { ComponentPreview } from "@/lib/docs/ComponentPreview";
import { PropsTable, type PropDef } from "@/lib/docs/PropsTable";
import { DocPage, DocSection } from "@/lib/docs/DocPage";

const singleCode = `import { Calendar } from "./components";
import { useState } from "react";

const [date, setDate] = useState<Date | undefined>(new Date());

<Calendar mode="single" selected={date} onSelect={setDate} />`;

const rangeCode = `import { Calendar } from "./components";
import type { DateRange } from "react-day-picker";
import { useState } from "react";

const [range, setRange] = useState<DateRange | undefined>();

<Calendar mode="range" selected={range} onSelect={setRange} />`;

const multiMonthCode = `import { Calendar } from "./components";
import { useState } from "react";

const [date, setDate] = useState<Date | undefined>(new Date());

<Calendar
  mode="single"
  selected={date}
  onSelect={setDate}
  numberOfMonths={2}
/>`;

const calendarProps: PropDef[] = [
  {
    name: "mode",
    type: '"single" | "multiple" | "range"',
    default: '"single"',
    description: "Selection behavior — a single date, multiple dates, or a contiguous range.",
  },
  {
    name: "selected",
    type: "Date | Date[] | DateRange | undefined",
    description: "Currently selected date(s). Shape depends on mode.",
  },
  {
    name: "onSelect",
    type: "(value) => void",
    description: "Called when the selection changes. Argument shape matches mode.",
  },
  {
    name: "numberOfMonths",
    type: "number",
    default: "1",
    description: "Number of months to render side-by-side.",
  },
  {
    name: "disabled",
    type: "Matcher | Matcher[]",
    description: "Dates or date matchers that should be disabled.",
  },
  {
    name: "showOutsideDays",
    type: "boolean",
    default: "true",
    description: "Whether to render days that fall outside the current month.",
  },
];

export default function CalendarDoc() {
  const [singleDate, setSingleDate] = useState<Date | undefined>(new Date());
  const [range, setRange] = useState<DateRange | undefined>();
  const [multiDate, setMultiDate] = useState<Date | undefined>(new Date());

  return (
    <DocPage
      title="Calendar"
      slug="calendar"
      description="react-day-picker v10 wrapped with nexUI tokens. Themed for light and dark."
    >
      <DocSection title="Single">
        <ComponentPreview code={singleCode}>
          <Calendar mode="single" selected={singleDate} onSelect={setSingleDate} />
        </ComponentPreview>
      </DocSection>

      <DocSection title="Range">
        <ComponentPreview code={rangeCode}>
          <Calendar mode="range" selected={range} onSelect={setRange} />
        </ComponentPreview>
      </DocSection>

      <DocSection title="Multi-month">
        <ComponentPreview code={multiMonthCode}>
          <Calendar
            mode="single"
            selected={multiDate}
            onSelect={setMultiDate}
            numberOfMonths={2}
          />
        </ComponentPreview>
      </DocSection>

      <DocSection title="API Reference">
        <PropsTable props={calendarProps} />
      </DocSection>
    </DocPage>
  );
}
