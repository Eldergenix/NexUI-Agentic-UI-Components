"use client";

import { CalendarWithTime } from "@/registry/default/calendar-with-time";
import { ComponentPreview } from "@/lib/docs/ComponentPreview";
import { PropsTable, type PropDef } from "@/lib/docs/PropsTable";
import { DocPage, DocSection } from "@/lib/docs/DocPage";

const basicCode = `import { CalendarWithTime } from "./components";

<CalendarWithTime />`;

const calendarWithTimeProps: PropDef[] = [
  {
    name: "defaultDate",
    type: "Date",
    default: "new Date()",
    description: "Initial selected date.",
  },
  {
    name: "defaultTime",
    type: "string",
    default: '"12:00:00"',
    description: "Initial time string in HH:MM:SS format.",
  },
  {
    name: "onChange",
    type: "(next: { date: Date | undefined; time: string }) => void",
    description: "Called when either the date or time changes.",
  },
];

export default function CalendarWithTimeDoc() {
  return (
    <DocPage
      title="CalendarWithTime"
      slug="calendar-with-time"
      description="Calendar paired with a native time input. Adapted from coss.com p-calendar-18."
    >
      <DocSection title="Basic">
        <ComponentPreview code={basicCode}>
          <CalendarWithTime />
        </ComponentPreview>
      </DocSection>

      <DocSection title="API Reference">
        <PropsTable props={calendarWithTimeProps} />
      </DocSection>
    </DocPage>
  );
}
