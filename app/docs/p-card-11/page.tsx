"use client";

import PCard11 from "@/components/p-card-11";
import { DocPage, DocSection } from "@/lib/docs/DocPage";
import { ComponentPreview } from "@/lib/docs/ComponentPreview";

const usageCode = `import PCard11 from "@/components/p-card-11";

<PCard11 />`;

export default function PCard11Doc() {
  return (
    <DocPage
      title="PCard11 — Empty State"
      slug="p-card-11"
      description="Empty-state card with folder icon, title, description, and primary action."
    >
      <DocSection title="Preview">
        <ComponentPreview code={usageCode}>
          <PCard11 />
        </ComponentPreview>
      </DocSection>
    </DocPage>
  );
}
