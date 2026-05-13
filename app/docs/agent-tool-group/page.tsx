"use client";

import { ToolGroup } from "@/registry/default/agent-ui/components/tools/tool-group";
import { ComponentPreview } from "@/lib/docs/ComponentPreview";
import { PropsTable, type PropDef } from "@/lib/docs/PropsTable";
import { DocPage, DocSection } from "@/lib/docs/DocPage";

// Cast to `any` because the part shapes mirror AI SDK message-part objects.
const completedPart: any = {
  toolCallId: "group-1",
  input: { description: "Refactor login flow" },
  output: { totalDurationMs: 18_200 },
  state: "output-available",
};

const completedNested: any[] = [
  {
    type: "tool-Read",
    toolCallId: "group-1:1",
    state: "output-available",
    input: { file_path: "src/auth/login.tsx" },
    output: { content: "..." },
  },
  {
    type: "tool-Grep",
    toolCallId: "group-1:2",
    state: "output-available",
    input: { pattern: "useAuth", path: "src" },
    output: { numFiles: 4 },
  },
  {
    type: "tool-Edit",
    toolCallId: "group-1:3",
    state: "output-available",
    input: {
      file_path: "src/auth/login.tsx",
      old_string: "useAuth()",
      new_string: "useAuthSession()",
    },
    output: { content: "..." },
  },
  {
    type: "tool-Edit",
    toolCallId: "group-1:4",
    state: "output-available",
    input: {
      file_path: "src/auth/hooks.ts",
      old_string: "useAuth",
      new_string: "useAuthSession",
    },
    output: { content: "..." },
  },
];

const runningPart: any = {
  toolCallId: "group-2",
  input: { description: "Audit dependencies" },
  state: "input-streaming",
  startedAt: Date.now() - 3_500,
};

const runningNested: any[] = [
  {
    type: "tool-Bash",
    toolCallId: "group-2:1",
    state: "output-available",
    input: { command: "pnpm audit --json" },
    output: { stdout: "..." },
  },
  {
    type: "tool-Grep",
    toolCallId: "group-2:2",
    state: "input-streaming",
    input: { pattern: "lodash" },
  },
];

const completedCode = `import { ToolGroup } from "./components/tools/tool-group";

<ToolGroup
  part={part}
  nestedTools={nestedTools}
  completeLabel="Refactored auth"
  shimmerLabel="Refactoring auth"
  interruptedLabel="Refactor interrupted"
  defaultOpen
/>`;

const runningCode = `import { ToolGroup } from "./components/tools/tool-group";

<ToolGroup
  part={runningPart}
  nestedTools={runningNested}
  chatStatus="streaming"
  completeLabel="Audit complete"
  shimmerLabel="Auditing dependencies"
  interruptedLabel="Audit interrupted"
  maxVisibleTools={4}
/>`;

const groupProps: PropDef[] = [
  {
    name: "part",
    type: "any",
    description:
      "Parent tool-call message part. Reads `input.description`, `output.totalDurationMs`, and `startedAt` for the elapsed timer.",
  },
  {
    name: "nestedTools",
    type: "any[]",
    default: "[]",
    description:
      "Child tool-call parts. Each is looked up in the tool registry and rendered as a generic row.",
  },
  {
    name: "chatStatus",
    type: "string | undefined",
    description:
      "Forwarded chat status. When 'streaming', tools reveal one by one with a staggered animation.",
  },
  {
    name: "completeLabel",
    type: "string",
    description:
      "Header label shown when the group has finished (e.g. 'Refactored auth').",
  },
  {
    name: "shimmerLabel",
    type: "string | undefined",
    description:
      "Header label shown while the group is running. Falls back to the completeLabel if omitted.",
  },
  {
    name: "interruptedLabel",
    type: "string",
    description:
      "Header label shown if the group was interrupted before producing output.",
  },
  {
    name: "maxVisibleTools",
    type: "number",
    default: "5",
    description:
      "Maximum number of nested tools visible at once during streaming. Older rows scroll up with a fade mask.",
  },
  {
    name: "defaultOpen",
    type: "boolean | undefined",
    description:
      "Initial expand state. Pass `false` to keep the group collapsed by default even while streaming.",
  },
  {
    name: "showElapsed",
    type: "boolean",
    default: "true",
    description:
      "Whether to render the trailing elapsed-time badge (e.g. '18s').",
  },
];

export default function AgentToolGroupDoc() {
  return (
    <DocPage
      title="Tool Group"
      slug="agent-tool-group"
      description="Collapsible wrapper for a parent tool call that delegated work to a series of child tool calls. Streams the child tools in one by one and reveals an elapsed timer."
    >
      <DocSection title="Completed">
        <ComponentPreview code={completedCode}>
          <div className="w-full max-w-xl">
            <ToolGroup
              part={completedPart}
              nestedTools={completedNested}
              completeLabel="Refactored auth"
              shimmerLabel="Refactoring auth"
              interruptedLabel="Refactor interrupted"
              defaultOpen
            />
          </div>
        </ComponentPreview>
      </DocSection>

      <DocSection title="Running">
        <ComponentPreview code={runningCode}>
          <div className="w-full max-w-xl">
            <ToolGroup
              part={runningPart}
              nestedTools={runningNested}
              chatStatus="streaming"
              completeLabel="Audit complete"
              shimmerLabel="Auditing dependencies"
              interruptedLabel="Audit interrupted"
              maxVisibleTools={4}
            />
          </div>
        </ComponentPreview>
      </DocSection>

      <DocSection title="API Reference">
        <PropsTable props={groupProps} />
      </DocSection>
    </DocPage>
  );
}
