"use client";

import { SubagentTool } from "@/registry/default/agent-ui/components/tools/subagent-tool";
import { ComponentPreview } from "@/lib/docs/ComponentPreview";
import { PropsTable, type PropDef } from "@/lib/docs/PropsTable";
import { DocPage, DocSection } from "@/lib/docs/DocPage";

// Cast to `any` because the part / nested-tool shapes mirror the runtime
// Vercel AI SDK message-part objects, which are loosely typed inside the
// component. Sample data only needs to satisfy what SubagentTool reads.
const completedPart: any = {
  toolCallId: "sub-1",
  input: {
    description: "Run dependency audit",
    prompt: "Check for outdated packages in src/**",
  },
  output: {
    result: "Found 3 outdated packages",
    totalDurationMs: 12_400,
  },
  state: "output-available",
};

const nestedTools: any[] = [
  {
    type: "tool-Grep",
    toolCallId: "sub-1:1",
    state: "output-available",
    input: { pattern: "import .* from", path: "src" },
    output: { numFiles: 2 },
  },
  {
    type: "tool-Read",
    toolCallId: "sub-1:2",
    state: "output-available",
    input: { file_path: "package.json" },
    output: { content: "..." },
  },
  {
    type: "tool-Bash",
    toolCallId: "sub-1:3",
    state: "output-available",
    input: { command: "pnpm outdated" },
    output: { stdout: "..." },
  },
];

const runningPart: any = {
  toolCallId: "sub-2",
  input: {
    description: "Migrate to TypeScript",
    prompt: "Convert remaining .js files",
  },
  state: "input-streaming",
  startedAt: Date.now() - 4_500,
};

const runningNested: any[] = [
  {
    type: "tool-Read",
    toolCallId: "sub-2:1",
    state: "output-available",
    input: { file_path: "src/legacy/index.js" },
    output: { content: "..." },
  },
  {
    type: "tool-Edit",
    toolCallId: "sub-2:2",
    state: "input-streaming",
    input: { file_path: "src/legacy/index.js" },
  },
];

const completedCode = `import { SubagentTool } from "./components/tools/subagent-tool";

const part = {
  toolCallId: "sub-1",
  input: { description: "Run dependency audit", prompt: "..." },
  output: { result: "Found 3 outdated packages", totalDurationMs: 12400 },
  state: "output-available",
};

const nestedTools = [
  { type: "tool-Grep", state: "output-available", input: { pattern: "import" }, output: { numFiles: 2 } },
  { type: "tool-Read", state: "output-available", input: { file_path: "package.json" } },
  { type: "tool-Bash", state: "output-available", input: { command: "pnpm outdated" } },
];

<SubagentTool part={part} nestedTools={nestedTools} />`;

const runningCode = `import { SubagentTool } from "./components/tools/subagent-tool";

<SubagentTool
  part={{
    toolCallId: "sub-2",
    input: { description: "Migrate to TypeScript", prompt: "..." },
    state: "input-streaming",
    startedAt: Date.now() - 4500,
  }}
  nestedTools={runningNested}
  chatStatus="streaming"
/>`;

const subagentProps: PropDef[] = [
  {
    name: "part",
    type: "any",
    description:
      "AI SDK tool-call message part. Reads `input.description`, `output.totalDurationMs`, `state`, and `startedAt` (or `callProviderMetadata.custom.startedAt`).",
  },
  {
    name: "nestedTools",
    type: "any[]",
    default: "[]",
    description:
      "Child tool-call parts from this subagent run. Rendered as collapsible rows using the same tool registry as the top-level chat.",
  },
  {
    name: "chatStatus",
    type: "string | undefined",
    description:
      "Forwarded from MessageList. When 'streaming' and the part has no output, the row shows the shimmering 'Running Subagent' label.",
  },
];

export default function AgentSubagentToolDoc() {
  return (
    <DocPage
      title="Subagent Tool"
      slug="agent-subagent-tool"
      description="Nested-agent invocation card that summarizes a Task/Agent tool call and reveals its child tool calls in a collapsible list."
    >
      <DocSection title="Completed">
        <ComponentPreview code={completedCode}>
          <div className="w-full max-w-xl">
            <SubagentTool part={completedPart} nestedTools={nestedTools} />
          </div>
        </ComponentPreview>
      </DocSection>

      <DocSection title="Running">
        <ComponentPreview code={runningCode}>
          <div className="w-full max-w-xl">
            <SubagentTool
              part={runningPart}
              nestedTools={runningNested}
              chatStatus="streaming"
            />
          </div>
        </ComponentPreview>
      </DocSection>

      <DocSection title="API Reference">
        <PropsTable props={subagentProps} />
      </DocSection>
    </DocPage>
  );
}
