"use client";

import PTable8 from "@/components/p-table-8";
import { DocPage, DocSection } from "@/lib/docs/DocPage";
import { ComponentPreview } from "@/lib/docs/ComponentPreview";

const usageCode = `import PTable8 from "@/components/p-table-8";

<PTable8 />`;

export default function PTable8Doc() {
  return (
    <DocPage
      title="PTable8"
      slug="p-table-8"
      description="Advanced table with multi-state row actions."
    >
      <DocSection title="Preview">
        <ComponentPreview code={usageCode}>
          <PTable8 />
        </ComponentPreview>
      </DocSection>
    </DocPage>
  );
}
