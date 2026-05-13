"use client";

import { ThinkingCollapsed } from "@/registry/default/agent-ui/components/tools/thinking-tool";
import { ComponentPreview } from "@/lib/docs/ComponentPreview";
import { PropsTable, type PropDef } from "@/lib/docs/PropsTable";
import { DocPage, DocSection } from "@/lib/docs/DocPage";

const completedStep: any = {
  id: "thinking-1",
  type: "tool-call",
  toolName: "Thinking",
  toolDetail: "",
  duration: 2,
  toolVariant: "thinking",
  thoughtContent:
    "Let me think through this step by step. First, I need to understand the user's intent — they want a refactor that preserves the existing API shape while replacing the storage layer. The trickiest constraint is keeping the public types stable.\n\nI'll start by mapping each public method to its new implementation, then write a thin adapter so consumers don't have to change.",
};

const animatingStep: any = {
  id: "thinking-2",
  type: "tool-call",
  toolName: "Thinking",
  toolDetail: "",
  duration: 999999,
  toolVariant: "thinking",
  thoughtContent: "Considering edge cases for the migration...",
};

const collapsedCode = `import { ThinkingCollapsed } from "./components/tools/thinking-tool";

const step = {
  id: "thinking-1",
  type: "tool-call",
  toolName: "Thinking",
  toolDetail: "",
  duration: 2,
  thoughtContent: "Let me think through this step by step...",
};

<ThinkingCollapsed
  step={step}
  state="complete"
  onComplete={() => {}}
/>`;

const expandedCode = `import { ThinkingCollapsed } from "./components/tools/thinking-tool";

<ThinkingCollapsed
  step={step}
  state="complete"
  onComplete={() => {}}
  defaultOpen
/>`;

const animatingCode = `import { ThinkingCollapsed } from "./components/tools/thinking-tool";

const step = {
  id: "thinking-2",
  type: "tool-call",
  toolName: "Thinking",
  toolDetail: "",
  duration: 999999,
  thoughtContent: "Considering edge cases for the migration...",
};

<ThinkingCollapsed
  step={step}
  state="animating"
  onComplete={() => {}}
/>`;

const thinkingProps: PropDef[] = [
  {
    name: "step",
    type: "TimelineStep & { type: 'tool-call' }",
    description:
      "Tool-call step. Reads `thoughtContent` for the body and `duration` for the animating delay.",
  },
  {
    name: "state",
    type: '"pending" | "animating" | "complete"',
    description:
      "Lifecycle state. `animating` shows a shimmering 'Thinking' label; `complete` switches to 'Thought'.",
  },
  {
    name: "onComplete",
    type: "() => void",
    description: "Called after `step.duration` elapses while animating.",
  },
  {
    name: "defaultOpen",
    type: "boolean | undefined",
    description:
      "If true, the row starts expanded so the thought content is visible without a click.",
  },
  {
    name: "expanded",
    type: "boolean | undefined",
    description:
      "Controlled open state. Pair with `onToggleExpand` to drive expansion from a parent component.",
  },
  {
    name: "onToggleExpand",
    type: "(() => void) | undefined",
    description: "Called when the user clicks the chevron in controlled mode.",
  },
];

export default function AgentThinkingToolDoc() {
  return (
    <DocPage
      title="Thinking Tool"
      slug="agent-thinking-tool"
      description="Collapsible row that surfaces an agent's chain-of-thought. Shimmers while the model is still thinking and reveals the full thought on expand."
    >
      <DocSection title="Collapsed">
        <ComponentPreview code={collapsedCode}>
          <div className="w-full max-w-xl">
            <ThinkingCollapsed
              step={completedStep}
              state="complete"
              onComplete={() => {}}
            />
          </div>
        </ComponentPreview>
      </DocSection>

      <DocSection title="Expanded">
        <ComponentPreview code={expandedCode}>
          <div className="w-full max-w-xl">
            <ThinkingCollapsed
              step={completedStep}
              state="complete"
              onComplete={() => {}}
              defaultOpen
            />
          </div>
        </ComponentPreview>
      </DocSection>

      <DocSection title="Animating">
        <ComponentPreview code={animatingCode}>
          <div className="w-full max-w-xl">
            <ThinkingCollapsed
              step={animatingStep}
              state="animating"
              onComplete={() => {}}
            />
          </div>
        </ComponentPreview>
      </DocSection>

      <DocSection title="API Reference">
        <PropsTable props={thinkingProps} />
      </DocSection>
    </DocPage>
  );
}
