"use client";

import { TextShimmer } from "@/registry/default/agent-ui/components/text-shimmer";
import { ComponentPreview } from "@/lib/docs/ComponentPreview";
import { PropsTable, type PropDef } from "@/lib/docs/PropsTable";
import { DocPage, DocSection } from "@/lib/docs/DocPage";

const defaultCode = `import { TextShimmer } from "./components";

<TextShimmer>Generating response...</TextShimmer>`;

const durationCode = `import { TextShimmer } from "./components";

<TextShimmer duration={1}>Fast shimmer</TextShimmer>
<TextShimmer duration={2}>Default shimmer</TextShimmer>
<TextShimmer duration={4}>Slow shimmer</TextShimmer>`;

const spreadCode = `import { TextShimmer } from "./components";

<TextShimmer spread={40}>Narrow spread</TextShimmer>
<TextShimmer spread={100}>Default spread</TextShimmer>
<TextShimmer spread={200}>Wide spread</TextShimmer>`;

const textShimmerProps: PropDef[] = [
  {
    name: "children",
    type: "ReactNode",
    description: "The text or content to render with the shimmer effect.",
  },
  {
    name: "as",
    type: "ElementType",
    default: '"p"',
    description: "The HTML element or component to render as.",
  },
  {
    name: "className",
    type: "string",
    description: "Additional class names to merge with the shimmer styles.",
  },
  {
    name: "duration",
    type: "number",
    default: "2",
    description: "Duration of one shimmer cycle in seconds.",
  },
  {
    name: "spread",
    type: "number",
    default: "100",
    description: "Width of the shimmer highlight in pixels.",
  },
  {
    name: "delay",
    type: "number",
    default: "0",
    description: "Delay before the animation starts, in seconds.",
  },
];

export default function TextShimmerDoc() {
  return (
    <DocPage
      title="TextShimmer"
      slug="agent-text-shimmer"
      description="Animated shimmer text for loading or in-progress states. Useful as a status line while an agent is working."
    >
      <DocSection title="Default">
        <ComponentPreview code={defaultCode}>
          <TextShimmer>Generating response...</TextShimmer>
        </ComponentPreview>
      </DocSection>

      <DocSection title="Duration">
        <ComponentPreview code={durationCode}>
          <div className="flex flex-col items-center gap-2">
            <TextShimmer duration={1}>Fast shimmer</TextShimmer>
            <TextShimmer duration={2}>Default shimmer</TextShimmer>
            <TextShimmer duration={4}>Slow shimmer</TextShimmer>
          </div>
        </ComponentPreview>
      </DocSection>

      <DocSection title="Spread">
        <ComponentPreview code={spreadCode}>
          <div className="flex flex-col items-center gap-2">
            <TextShimmer spread={40}>Narrow spread</TextShimmer>
            <TextShimmer spread={100}>Default spread</TextShimmer>
            <TextShimmer spread={200}>Wide spread</TextShimmer>
          </div>
        </ComponentPreview>
      </DocSection>

      <DocSection title="API Reference">
        <PropsTable props={textShimmerProps} />
      </DocSection>
    </DocPage>
  );
}
