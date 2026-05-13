"use client";

import PTable6 from "@/components/p-table-6";
import { DocPage, DocSection } from "@/lib/docs/DocPage";
import { ComponentPreview } from "@/lib/docs/ComponentPreview";

const usageCode = `import PTable6 from "@/components/p-table-6";

<PTable6 />`;

export default function PTable6Doc() {
  return (
    <DocPage
      title="PTable6"
      slug="p-table-6"
      description="Table with grouped headers and filter affordances."
    >
      <DocSection title="Preview">
        <ComponentPreview code={usageCode}>
          <PTable6 />
        </ComponentPreview>
      </DocSection>
    </DocPage>
  );
}
