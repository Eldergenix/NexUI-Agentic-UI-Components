"use client";

import { CalendarWithDateInput } from "@/registry/default/calendar-with-date-input";
import { ComponentPreview } from "@/lib/docs/ComponentPreview";
import { PropsTable, type PropDef } from "@/lib/docs/PropsTable";
import { DocPage, DocSection } from "@/lib/docs/DocPage";

const basicCode = `import { CalendarWithDateInput } from "./components";

<CalendarWithDateInput />`;

const calendarWithDateInputProps: PropDef[] = [
  {
    name: "defaultDate",
    type: "Date",
    default: "new Date()",
    description: "Initial selected date.",
  },
  {
    name: "onDateChange",
    type: "(date: Date | undefined) => void",
    description: "Called whenever the selected date changes from either the calendar or the input.",
  },
];

export default function CalendarWithDateInputDoc() {
  return (
    <DocPage
      title="CalendarWithDateInput"
      slug="calendar-with-date-input"
      description="Calendar paired with a linked ISO date text input. Adapted from coss.com p-calendar-17."
    >
      <DocSection title="Basic">
        <ComponentPreview code={basicCode}>
          <CalendarWithDateInput />
        </ComponentPreview>
      </DocSection>

      <DocSection title="API Reference">
        <PropsTable props={calendarWithDateInputProps} />
      </DocSection>
    </DocPage>
  );
}
