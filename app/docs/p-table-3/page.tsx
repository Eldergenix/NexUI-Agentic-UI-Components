"use client";

import PTable3 from "@/components/p-table-3";
import { DocPage, DocSection } from "@/lib/docs/DocPage";
import { ComponentPreview } from "@/lib/docs/ComponentPreview";

const usageCode = `import PTable3 from "@/components/p-table-3";

<PTable3 />`;

export default function PTable3Doc() {
  return (
    <DocPage
      title="PTable3"
      slug="p-table-3"
      description="Selectable table with checkboxes, sorting, pagination, and frame wrapper."
    >
      <DocSection title="Preview">
        <ComponentPreview code={usageCode}>
          <PTable3 />
        </ComponentPreview>
      </DocSection>
    </DocPage>
  );
}
