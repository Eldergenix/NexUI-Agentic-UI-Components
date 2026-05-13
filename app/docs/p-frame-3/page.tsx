"use client";

import PFrame3 from "@/components/p-frame-3";
import { DocPage, DocSection } from "@/lib/docs/DocPage";
import { ComponentPreview } from "@/lib/docs/ComponentPreview";

const usageCode = `import PFrame3 from "@/components/p-frame-3";

<PFrame3 />`;

export default function PFrame3Doc() {
  return (
    <DocPage
      title="PFrame3"
      slug="p-frame-3"
      description="Frame with split panels."
    >
      <DocSection title="Preview">
        <ComponentPreview code={usageCode}>
          <PFrame3 />
        </ComponentPreview>
      </DocSection>
    </DocPage>
  );
}
