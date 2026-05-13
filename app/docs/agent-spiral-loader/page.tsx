"use client";

import { SpiralLoader } from "@/registry/default/agent-ui/components/spiral-loader";
import { ComponentPreview } from "@/lib/docs/ComponentPreview";
import { PropsTable, type PropDef } from "@/lib/docs/PropsTable";
import { DocPage, DocSection } from "@/lib/docs/DocPage";

const defaultCode = `import { SpiralLoader } from "./components";

<SpiralLoader />`;

const sizesCode = `import { SpiralLoader } from "./components";

<SpiralLoader size={12} />
<SpiralLoader size={16} />
<SpiralLoader size={24} />
<SpiralLoader size={32} />
<SpiralLoader size={48} />`;

const spiralLoaderProps: PropDef[] = [
  {
    name: "size",
    type: "number",
    default: "16",
    description: "Pixel size of the loader (rendered as a square).",
  },
  {
    name: "className",
    type: "string",
    description: "Additional class names to merge with the loader container.",
  },
];

export default function SpiralLoaderDoc() {
  return (
    <DocPage
      title="SpiralLoader"
      slug="agent-spiral-loader"
      description="A Lottie-based spiral loading indicator. Renders only on the client (loaded via next/dynamic) and adapts to the active theme."
    >
      <DocSection title="Default">
        <ComponentPreview code={defaultCode}>
          <SpiralLoader />
        </ComponentPreview>
      </DocSection>

      <DocSection title="Sizes">
        <ComponentPreview code={sizesCode}>
          <div className="flex items-center gap-4">
            <SpiralLoader size={12} />
            <SpiralLoader size={16} />
            <SpiralLoader size={24} />
            <SpiralLoader size={32} />
            <SpiralLoader size={48} />
          </div>
        </ComponentPreview>
      </DocSection>

      <DocSection title="API Reference">
        <PropsTable props={spiralLoaderProps} />
      </DocSection>
    </DocPage>
  );
}
