"use client";

import PCommand2 from "@/components/p-command-2";
import { DocPage, DocSection } from "@/lib/docs/DocPage";
import { ComponentPreview } from "@/lib/docs/ComponentPreview";

const usageCode = `import PCommand2 from "@/components/p-command-2";

<PCommand2 />`;

export default function PCommand2Doc() {
  return (
    <DocPage
      title="PCommand2"
      slug="p-command-2"
      description="Command palette with autocomplete filter, empty-state, and external commandHandle."
    >
      <DocSection title="Preview">
        <ComponentPreview code={usageCode}>
          <PCommand2 />
        </ComponentPreview>
      </DocSection>
    </DocPage>
  );
}
