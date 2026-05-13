"use client";

import PCommand1 from "@/components/p-command-1";
import { DocPage, DocSection } from "@/lib/docs/DocPage";
import { ComponentPreview } from "@/lib/docs/ComponentPreview";

const usageCode = `import PCommand1 from "@/components/p-command-1";

<PCommand1 />`;

export default function PCommand1Doc() {
  return (
    <DocPage
      title="PCommand1"
      slug="p-command-1"
      description="Command palette with grouped suggestions/commands and keyboard shortcut hints."
    >
      <DocSection title="Preview">
        <ComponentPreview code={usageCode}>
          <PCommand1 />
        </ComponentPreview>
      </DocSection>
    </DocPage>
  );
}
