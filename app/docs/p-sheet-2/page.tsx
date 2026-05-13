"use client";

import PSheet2 from "@/components/p-sheet-2";
import { DocPage, DocSection } from "@/lib/docs/DocPage";
import { ComponentPreview } from "@/lib/docs/ComponentPreview";

const usageCode = `import PSheet2 from "@/components/p-sheet-2";

<PSheet2 />`;

export default function PSheet2Doc() {
  return (
    <DocPage
      title="PSheet2"
      slug="p-sheet-2"
      description="Form-driven side sheet (Field + Form + Input) with submit and cancel."
    >
      <DocSection title="Preview">
        <ComponentPreview code={usageCode}>
          <PSheet2 />
        </ComponentPreview>
      </DocSection>
    </DocPage>
  );
}
