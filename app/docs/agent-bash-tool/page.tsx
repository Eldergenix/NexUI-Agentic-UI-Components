"use client";

import { BashToolTerminalCard } from "@/registry/default/agent-ui/components/tools/bash-tool";
import { ComponentPreview } from "@/lib/docs/ComponentPreview";
import { PropsTable, type PropDef } from "@/lib/docs/PropsTable";
import { DocPage, DocSection } from "@/lib/docs/DocPage";

const completedStep: any = {
  id: "bash-1",
  type: "tool-call",
  toolName: "Bash",
  toolDetail: "ls -la",
  duration: 2,
  bashCommand: "ls -la",
  bashOutput:
    "total 24\ndrwxr-xr-x  5 user staff  160 Jan  1 12:00 .\ndrwxr-xr-x  3 user staff   96 Jan  1 12:00 ..\n-rw-r--r--  1 user staff 1024 Jan  1 12:00 README.md\n-rw-r--r--  1 user staff  512 Jan  1 12:00 package.json",
  bashSuccess: true,
};

const animatingStep: any = {
  id: "bash-2",
  type: "tool-call",
  toolName: "Bash",
  toolDetail: "pnpm install",
  duration: 999999,
  bashCommand: "pnpm install",
};

const completedCode = `import { BashToolTerminalCard } from "./components/tools/bash-tool";

const step = {
  id: "bash-1",
  type: "tool-call",
  toolName: "Bash",
  toolDetail: "ls -la",
  duration: 2,
  bashCommand: "ls -la",
  bashOutput: "total 24\\ndrwxr-xr-x 5 user staff 160 Jan 1 12:00 .\\n...",
  bashSuccess: true,
};

<BashToolTerminalCard
  step={step}
  state="complete"
  onComplete={() => {}}
/>`;

const animatingCode = `import { BashToolTerminalCard } from "./components/tools/bash-tool";

const step = {
  id: "bash-2",
  type: "tool-call",
  toolName: "Bash",
  toolDetail: "pnpm install",
  duration: 999999,
  bashCommand: "pnpm install",
};

<BashToolTerminalCard
  step={step}
  state="animating"
  onComplete={() => {}}
/>`;

const approvalCode = `import { BashToolTerminalCard } from "./components/tools/bash-tool";

<BashToolTerminalCard
  step={step}
  state="complete"
  onComplete={() => {}}
  approval={{
    approveLabel: "Run",
    rejectLabel: "Cancel",
    onApprove: () => console.log("approved"),
    onReject: () => console.log("rejected"),
  }}
/>`;

const bashProps: PropDef[] = [
  {
    name: "step",
    type: "TimelineStep & { type: 'tool-call' }",
    description:
      "Tool-call step with `bashCommand`, optional `bashOutput`, and `duration` (ms) controlling the animating delay.",
  },
  {
    name: "state",
    type: '"pending" | "animating" | "complete"',
    description:
      "Lifecycle state. `animating` shows the shimmering 'Running command' header and spinner; `complete` reveals the output.",
  },
  {
    name: "onComplete",
    type: "() => void",
    description:
      "Called after `step.duration` elapses while in the `animating` state. Used to advance the timeline.",
  },
  {
    name: "approval",
    type: "ToolApproval | undefined",
    description:
      "Optional approval footer with Approve / Reject buttons for human-in-the-loop confirmation before execution.",
  },
];

export default function AgentBashToolDoc() {
  return (
    <DocPage
      title="Bash Tool"
      slug="agent-bash-tool"
      description="Terminal-style tool card for an agent running a shell command. Shows the command, streaming status, and output, with optional approval gate."
    >
      <DocSection title="Completed">
        <ComponentPreview code={completedCode}>
          <div className="w-full max-w-xl">
            <BashToolTerminalCard
              step={completedStep}
              state="complete"
              onComplete={() => {}}
            />
          </div>
        </ComponentPreview>
      </DocSection>

      <DocSection title="Animating">
        <ComponentPreview code={animatingCode}>
          <div className="w-full max-w-xl">
            <BashToolTerminalCard
              step={animatingStep}
              state="animating"
              onComplete={() => {}}
            />
          </div>
        </ComponentPreview>
      </DocSection>

      <DocSection title="With approval">
        <ComponentPreview code={approvalCode}>
          <div className="w-full max-w-xl">
            <BashToolTerminalCard
              step={completedStep}
              state="complete"
              onComplete={() => {}}
              approval={{
                approveLabel: "Run",
                rejectLabel: "Cancel",
                onApprove: () => {},
                onReject: () => {},
              }}
            />
          </div>
        </ComponentPreview>
      </DocSection>

      <DocSection title="API Reference">
        <PropsTable props={bashProps} />
      </DocSection>
    </DocPage>
  );
}
