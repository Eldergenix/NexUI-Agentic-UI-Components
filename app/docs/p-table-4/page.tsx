"use client";

import PTable4 from "@/components/p-table-4";
import { DocPage, DocSection } from "@/lib/docs/DocPage";
import { ComponentPreview } from "@/lib/docs/ComponentPreview";

const usageCode = `import PTable4 from "@/components/p-table-4";

<PTable4 />`;

export default function PTable4Doc() {
  return (
    <DocPage
      title="PTable4"
      slug="p-table-4"
      description="Table variant with extended column controls."
    >
      <DocSection title="Preview">
        <ComponentPreview code={usageCode}>
          <PTable4 />
        </ComponentPreview>
      </DocSection>
    </DocPage>
  );
}
