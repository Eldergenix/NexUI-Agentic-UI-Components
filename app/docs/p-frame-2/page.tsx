"use client";

import PFrame2 from "@/components/p-frame-2";
import { DocPage, DocSection } from "@/lib/docs/DocPage";
import { ComponentPreview } from "@/lib/docs/ComponentPreview";

const usageCode = `import PFrame2 from "@/components/p-frame-2";

<PFrame2 />`;

export default function PFrame2Doc() {
  return (
    <DocPage
      title="PFrame2"
      slug="p-frame-2"
      description="Frame with header (FrameHeader) and content panel (FramePanel)."
    >
      <DocSection title="Preview">
        <ComponentPreview code={usageCode}>
          <PFrame2 />
        </ComponentPreview>
      </DocSection>
    </DocPage>
  );
}
