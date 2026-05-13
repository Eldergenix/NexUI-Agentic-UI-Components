"use client";

import { CalendarPricing } from "@/registry/default/calendar-pricing";
import { ComponentPreview } from "@/lib/docs/ComponentPreview";
import { PropsTable, type PropDef } from "@/lib/docs/PropsTable";
import { DocPage, DocSection } from "@/lib/docs/DocPage";

const basicCode = `import { CalendarPricing } from "./components";

<CalendarPricing />`;

const calendarPricingProps: PropDef[] = [
  {
    name: "prices",
    type: "Record<string, number>",
    description:
      'Optional price map keyed by "yyyy-MM-dd". Days without a price are disabled. Falls back to a 180-day mock dataset.',
  },
  {
    name: "defaultDate",
    type: "Date",
    default: "new Date()",
    description: "Initial selected date.",
  },
];

export default function CalendarPricingDoc() {
  return (
    <DocPage
      title="CalendarPricing"
      slug="calendar-pricing"
      description="Two-month pricing calendar with custom day buttons and good-price highlighting. Adapted from coss.com p-calendar-24."
    >
      <DocSection title="Basic">
        <ComponentPreview code={basicCode}>
          <CalendarPricing />
        </ComponentPreview>
      </DocSection>

      <DocSection title="API Reference">
        <PropsTable props={calendarPricingProps} />
      </DocSection>
    </DocPage>
  );
}
