"use client";

import { DatePickerPresets } from "@/registry/default/date-picker-presets";
import { ComponentPreview } from "@/lib/docs/ComponentPreview";
import { PropsTable, type PropDef } from "@/lib/docs/PropsTable";
import { DocPage, DocSection } from "@/lib/docs/DocPage";

const basicCode = `import { DatePickerPresets } from "./components";

<DatePickerPresets />`;

const datePickerPresetsProps: PropDef[] = [
  {
    name: "defaultDate",
    type: "Date",
    default: "new Date()",
    description: "Initial selected date.",
  },
  {
    name: "onDateChange",
    type: "(date: Date | undefined) => void",
    description: "Called whenever the selected date changes (via a preset or the calendar).",
  },
  {
    name: "className",
    type: "string",
    description: "Extra class applied to the trigger Button.",
  },
];

export default function DatePickerPresetsDoc() {
  return (
    <DocPage
      title="DatePickerPresets"
      slug="date-picker-presets"
      description="Popover date picker with quick presets (Today / Tomorrow / In 3 days / In a week). Adapted from coss.com p-date-picker-4."
    >
      <DocSection title="Basic">
        <ComponentPreview code={basicCode}>
          <div className="w-[280px]">
            <DatePickerPresets />
          </div>
        </ComponentPreview>
      </DocSection>

      <DocSection title="API Reference">
        <PropsTable props={datePickerPresetsProps} />
      </DocSection>
    </DocPage>
  );
}
