"use client";

import PInput11 from "@/components/p-input-11";
import { DocPage, DocSection } from "@/lib/docs/DocPage";
import { ComponentPreview } from "@/lib/docs/ComponentPreview";

const usageCode = `import PInput11 from "@/components/p-input-11";

<PInput11 />`;

export default function PInput11Doc() {
  return (
    <DocPage
      title="PInput11"
      slug="p-input-11"
      description="Input with keyboard shortcut hint (Kbd) suffix."
    >
      <DocSection title="Preview">
        <ComponentPreview code={usageCode}>
          <PInput11 />
        </ComponentPreview>
      </DocSection>
    </DocPage>
  );
}
