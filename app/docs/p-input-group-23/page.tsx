"use client";

import PInputGroup23 from "@/components/p-input-group-23";
import { DocPage, DocSection } from "@/lib/docs/DocPage";
import { ComponentPreview } from "@/lib/docs/ComponentPreview";

const usageCode = `import PInputGroup23 from "@/components/p-input-group-23";

<PInputGroup23 />`;

export default function PInputGroup23Doc() {
  return (
    <DocPage
      title="PInputGroup23"
      slug="p-input-group-23"
      description="Search input group with loader and microphone affordance."
    >
      <DocSection title="Preview">
        <ComponentPreview code={usageCode}>
          <PInputGroup23 />
        </ComponentPreview>
      </DocSection>
    </DocPage>
  );
}
