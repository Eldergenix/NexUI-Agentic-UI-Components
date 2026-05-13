"use client";

import PFrame4 from "@/components/p-frame-4";
import { DocPage, DocSection } from "@/lib/docs/DocPage";
import { ComponentPreview } from "@/lib/docs/ComponentPreview";

const usageCode = `import PFrame4 from "@/components/p-frame-4";

<PFrame4 />`;

export default function PFrame4Doc() {
  return (
    <DocPage
      title="PFrame4"
      slug="p-frame-4"
      description="Frame with separator and stacked sections."
    >
      <DocSection title="Preview">
        <ComponentPreview code={usageCode}>
          <PFrame4 />
        </ComponentPreview>
      </DocSection>
    </DocPage>
  );
}
