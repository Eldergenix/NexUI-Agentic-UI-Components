"use client";

import { EditToolDiffCard } from "@/registry/default/agent-ui/components/tools/edit-tool";
import { ComponentPreview } from "@/lib/docs/ComponentPreview";
import { PropsTable, type PropDef } from "@/lib/docs/PropsTable";
import { DocPage, DocSection } from "@/lib/docs/DocPage";

// Cast to `any` to skip the strict TimelineStep discriminated-union check in
// docs/demo data; the shape matches the `tool-call` variant at runtime.
const editStep: any = {
  id: "edit-1",
  type: "tool-call",
  toolName: "Edit",
  toolDetail: "src/app.tsx",
  duration: 2,
  filePath: "src/app.tsx",
  diffStats: "+5 -2",
  diffLines: [
    { type: "context", content: "function App() {" },
    { type: "remove", content: "  return <div>Hello</div>;" },
    { type: "add", content: "  return <div>Hello, nexUI</div>;" },
    { type: "context", content: "}" },
  ],
};

const animatingStep: any = {
  id: "edit-2",
  type: "tool-call",
  toolName: "Edit",
  toolDetail: "src/components/button.tsx",
  duration: 999999,
  filePath: "src/components/button.tsx",
};

const completedCode = `import { EditToolDiffCard } from "./components/tools/edit-tool";

const step = {
  id: "edit-1",
  type: "tool-call",
  toolName: "Edit",
  toolDetail: "src/app.tsx",
  duration: 2,
  filePath: "src/app.tsx",
  diffStats: "+5 -2",
  diffLines: [
    { type: "context", content: "function App() {" },
    { type: "remove", content: "  return <div>Hello</div>;" },
    { type: "add", content: "  return <div>Hello, nexUI</div>;" },
    { type: "context", content: "}" },
  ],
};

<EditToolDiffCard
  step={step}
  state="complete"
  onComplete={() => {}}
/>`;

const animatingCode = `import { EditToolDiffCard } from "./components/tools/edit-tool";

<EditToolDiffCard
  step={{
    id: "edit-2",
    type: "tool-call",
    toolName: "Edit",
    toolDetail: "src/components/button.tsx",
    duration: 999999,
    filePath: "src/components/button.tsx",
  }}
  state="animating"
  onComplete={() => {}}
/>`;

const collapsibleCode = `import { EditToolDiffCard } from "./components/tools/edit-tool";

<EditToolDiffCard
  step={step}
  state="complete"
  onComplete={() => {}}
  isCollapsible
/>`;

const approvalCode = `import { EditToolDiffCard } from "./components/tools/edit-tool";

<EditToolDiffCard
  step={step}
  state="complete"
  onComplete={() => {}}
  approval={{
    approveLabel: "Apply",
    rejectLabel: "Discard",
    onApprove: () => {},
    onReject: () => {},
  }}
/>`;

const editProps: PropDef[] = [
  {
    name: "step",
    type: "TimelineStep & { type: 'tool-call' }",
    description:
      "Tool-call step describing the edit. Reads `filePath`, `diffStats`, and `diffLines` for the diff body and header label.",
  },
  {
    name: "state",
    type: '"pending" | "animating" | "complete"',
    description:
      "Lifecycle state. `animating` shows a shimmering 'Editing {file}' header; `complete` reveals the diff stats and body.",
  },
  {
    name: "onComplete",
    type: "() => void",
    description:
      "Fires after `step.duration` elapses while in `animating`. Used to advance a scripted timeline.",
  },
  {
    name: "input",
    type: "Record<string, unknown> | undefined",
    description:
      "Optional raw tool input. When present, `old_string` is preferred over `step.diffLines` for the previous file contents.",
  },
  {
    name: "output",
    type: "Record<string, unknown> | undefined",
    description:
      "Optional raw tool output. When present, `content` / `old_content` are preferred sources for the diff.",
  },
  {
    name: "isCollapsible",
    type: "boolean",
    default: "false",
    description:
      "When true the diff body collapses to 260px with a 'Show more' chevron on hover.",
  },
  {
    name: "approval",
    type: "ToolApproval | undefined",
    description:
      "Optional approval footer ({ approveLabel?, rejectLabel?, onApprove?, onReject? }) for human-in-the-loop confirmation.",
  },
];

export default function AgentEditToolDoc() {
  return (
    <DocPage
      title="Edit Tool"
      slug="agent-edit-tool"
      description="File-edit tool card showing a syntax-highlighted unified diff, theme-aware colors, optional collapsing, and an approval footer."
    >
      <DocSection title="Completed">
        <ComponentPreview code={completedCode}>
          <div className="w-full max-w-xl">
            <EditToolDiffCard
              step={editStep}
              state="complete"
              onComplete={() => {}}
            />
          </div>
        </ComponentPreview>
      </DocSection>

      <DocSection title="Animating">
        <ComponentPreview code={animatingCode}>
          <div className="w-full max-w-xl">
            <EditToolDiffCard
              step={animatingStep}
              state="animating"
              onComplete={() => {}}
            />
          </div>
        </ComponentPreview>
      </DocSection>

      <DocSection title="Collapsible">
        <ComponentPreview code={collapsibleCode}>
          <div className="w-full max-w-xl">
            <EditToolDiffCard
              step={editStep}
              state="complete"
              onComplete={() => {}}
              isCollapsible
            />
          </div>
        </ComponentPreview>
      </DocSection>

      <DocSection title="With approval">
        <ComponentPreview code={approvalCode}>
          <div className="w-full max-w-xl">
            <EditToolDiffCard
              step={editStep}
              state="complete"
              onComplete={() => {}}
              approval={{
                approveLabel: "Apply",
                rejectLabel: "Discard",
                onApprove: () => {},
                onReject: () => {},
              }}
            />
          </div>
        </ComponentPreview>
      </DocSection>

      <DocSection title="API Reference">
        <PropsTable props={editProps} />
      </DocSection>
    </DocPage>
  );
}
