"use client";

import PFrame1 from "@/components/p-frame-1";
import { DocPage, DocSection } from "@/lib/docs/DocPage";
import { ComponentPreview } from "@/lib/docs/ComponentPreview";

const usageCode = `import PFrame1 from "@/components/p-frame-1";

<PFrame1 />`;

export default function PFrame1Doc() {
  return (
    <DocPage
      title="PFrame1"
      slug="p-frame-1"
      description="Basic Frame primitive with rounded surface and shadow."
    >
      <DocSection title="Preview">
        <ComponentPreview code={usageCode}>
          <PFrame1 />
        </ComponentPreview>
      </DocSection>
    </DocPage>
  );
}
