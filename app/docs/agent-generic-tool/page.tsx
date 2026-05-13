"use client";

import { GenericToolRow } from "@/registry/default/agent-ui/components/tools/generic-tool";
import { ComponentPreview } from "@/lib/docs/ComponentPreview";
import { PropsTable, type PropDef } from "@/lib/docs/PropsTable";
import { DocPage, DocSection } from "@/lib/docs/DocPage";

const readStep: any = {
  id: "read-1",
  type: "tool-call",
  toolName: "Read",
  toolDetail: "/etc/hosts",
  duration: 2,
};

const animatingStep: any = {
  id: "fetch-1",
  type: "tool-call",
  toolName: "Fetch",
  toolDetail: "https://api.example.com/v1/users",
  duration: 999999,
};

const noDetailStep: any = {
  id: "compile-1",
  type: "tool-call",
  toolName: "Compile",
  toolDetail: "",
  duration: 2,
};

const readCode = `import { GenericToolRow } from "./components/tools/generic-tool";

const step = {
  id: "read-1",
  type: "tool-call",
  toolName: "Read",
  toolDetail: "/etc/hosts",
  duration: 2,
};

<GenericToolRow
  step={step}
  state="complete"
  onComplete={() => {}}
/>`;

const animatingCode = `import { GenericToolRow } from "./components/tools/generic-tool";

const step = {
  id: "fetch-1",
  type: "tool-call",
  toolName: "Fetch",
  toolDetail: "https://api.example.com/v1/users",
  duration: 999999,
};

<GenericToolRow
  step={step}
  state="animating"
  onComplete={() => {}}
/>`;

const noDetailCode = `import { GenericToolRow } from "./components/tools/generic-tool";

const step = {
  id: "compile-1",
  type: "tool-call",
  toolName: "Compile",
  toolDetail: "",
  duration: 2,
};

<GenericToolRow
  step={step}
  state="complete"
  onComplete={() => {}}
/>`;

const genericProps: PropDef[] = [
  {
    name: "step",
    type: "TimelineStep & { type: 'tool-call' }",
    description:
      "Tool-call step. `toolName` becomes the row label; `toolDetail` is shown as a dimmed secondary string.",
  },
  {
    name: "state",
    type: '"pending" | "animating" | "complete"',
    description:
      "Lifecycle state. `animating` shimmers the label; `complete` shows it static.",
  },
  {
    name: "onComplete",
    type: "() => void",
    description: "Called after `step.duration` elapses while animating.",
  },
];

export default function AgentGenericToolDoc() {
  return (
    <DocPage
      title="Generic Tool"
      slug="agent-generic-tool"
      description="Single-line tool row used as the fallback for any tool that doesn't have a bespoke renderer. Shows the tool name, an optional detail string, and a shimmer while pending."
    >
      <DocSection title="With detail">
        <ComponentPreview code={readCode}>
          <div className="w-full max-w-xl">
            <GenericToolRow
              step={readStep}
              state="complete"
              onComplete={() => {}}
            />
          </div>
        </ComponentPreview>
      </DocSection>

      <DocSection title="Animating">
        <ComponentPreview code={animatingCode}>
          <div className="w-full max-w-xl">
            <GenericToolRow
              step={animatingStep}
              state="animating"
              onComplete={() => {}}
            />
          </div>
        </ComponentPreview>
      </DocSection>

      <DocSection title="Name only">
        <ComponentPreview code={noDetailCode}>
          <div className="w-full max-w-xl">
            <GenericToolRow
              step={noDetailStep}
              state="complete"
              onComplete={() => {}}
            />
          </div>
        </ComponentPreview>
      </DocSection>

      <DocSection title="API Reference">
        <PropsTable props={genericProps} />
      </DocSection>
    </DocPage>
  );
}
