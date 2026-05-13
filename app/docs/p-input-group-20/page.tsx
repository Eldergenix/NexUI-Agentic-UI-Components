"use client";

import PInputGroup20 from "@/components/p-input-group-20";
import { DocPage, DocSection } from "@/lib/docs/DocPage";
import { ComponentPreview } from "@/lib/docs/ComponentPreview";

const usageCode = `import PInputGroup20 from "@/components/p-input-group-20";

<PInputGroup20 />`;

export default function PInputGroup20Doc() {
  return (
    <DocPage
      title="PInputGroup20"
      slug="p-input-group-20"
      description="Input group with search icon prefix."
    >
      <DocSection title="Preview">
        <ComponentPreview code={usageCode}>
          <PInputGroup20 />
        </ComponentPreview>
      </DocSection>
    </DocPage>
  );
}
