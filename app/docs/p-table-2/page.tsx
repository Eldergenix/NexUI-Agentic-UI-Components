"use client";

import PTable2 from "@/components/p-table-2";
import { DocPage, DocSection } from "@/lib/docs/DocPage";
import { ComponentPreview } from "@/lib/docs/ComponentPreview";

const usageCode = `import PTable2 from "@/components/p-table-2";

<PTable2 />`;

export default function PTable2Doc() {
  return (
    <DocPage
      title="PTable2"
      slug="p-table-2"
      description="Compact data table with row hover, status badges, and frame wrapper."
    >
      <DocSection title="Preview">
        <ComponentPreview code={usageCode}>
          <PTable2 />
        </ComponentPreview>
      </DocSection>
    </DocPage>
  );
}
