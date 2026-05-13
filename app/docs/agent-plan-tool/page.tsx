"use client";

import { PlanTool } from "@/registry/default/agent-ui/components/tools/plan-tool";
import { ComponentPreview } from "@/lib/docs/ComponentPreview";
import { PropsTable, type PropDef } from "@/lib/docs/PropsTable";
import { DocPage, DocSection } from "@/lib/docs/DocPage";

const basicPart: any = {
  type: "tool-plan",
  toolCallId: "plan-1",
  state: "output-available",
  input: {
    plan: {
      title: "Refactor auth flow",
      summary:
        "Move from session cookies to JWT.\n\n1. Add `/api/auth/token` route that issues short-lived JWTs.\n2. Update the client to store the token in memory and refresh it on 401.\n3. Migrate existing session-based middleware to verify JWTs.\n4. Remove the legacy session table after a one-week grace period.",
    },
    onApprove: () => {},
  },
};

const approvedPart: any = {
  type: "tool-plan",
  toolCallId: "plan-2",
  state: "output-available",
  input: {
    plan: {
      id: "migration",
      title: "Migrate database to Postgres 16",
      summary:
        "Bring the primary up to 16 with zero downtime by routing writes through a logical replica during the cutover.",
    },
    approved: true,
    onApprove: () => {},
  },
};

const minimalPart: any = {
  type: "tool-plan",
  toolCallId: "plan-3",
  state: "output-available",
  input: {
    plan: {
      title: "Quick task: bump dependencies",
    },
    onApprove: () => {},
  },
};

const basicCode = `import { PlanTool } from "./components/tools/plan-tool";

const part = {
  type: "tool-plan",
  toolCallId: "plan-1",
  state: "output-available",
  input: {
    plan: {
      title: "Refactor auth flow",
      summary: "Move from session cookies to JWT.\\n\\n1. ...",
    },
    onApprove: () => console.log("approved"),
  },
};

<PlanTool part={part} />`;

const approvedCode = `import { PlanTool } from "./components/tools/plan-tool";

const part = {
  type: "tool-plan",
  toolCallId: "plan-2",
  state: "output-available",
  input: {
    plan: {
      id: "migration",
      title: "Migrate database to Postgres 16",
      summary: "Bring the primary up to 16 with zero downtime...",
    },
    approved: true,
    onApprove: () => {},
  },
};

<PlanTool part={part} />`;

const minimalCode = `import { PlanTool } from "./components/tools/plan-tool";

const part = {
  type: "tool-plan",
  toolCallId: "plan-3",
  state: "output-available",
  input: {
    plan: { title: "Quick task: bump dependencies" },
    onApprove: () => {},
  },
};

<PlanTool part={part} />`;

const planProps: PropDef[] = [
  {
    name: "part",
    type: "{ input?: { plan?: Plan; onApprove?: () => void; approveLabel?: string; approved?: boolean } }",
    description:
      "Tool invocation part. `input.plan` carries the `{ id?, title, summary? }`. The card renders nothing when `plan` is missing.",
  },
  {
    name: "chatStatus",
    type: "string | undefined",
    description:
      "Parent chat status. When the tool is still streaming, the header icon is replaced with a spinner.",
  },
];

export default function AgentPlanToolDoc() {
  return (
    <DocPage
      title="Plan Tool"
      slug="agent-plan-tool"
      description="Collapsible plan card that frames an agent's proposed plan as a markdown file. Includes an Approve action for human-in-the-loop sign-off."
    >
      <DocSection title="Default">
        <ComponentPreview code={basicCode}>
          <div className="w-full max-w-xl">
            <PlanTool part={basicPart} />
          </div>
        </ComponentPreview>
      </DocSection>

      <DocSection title="Already approved">
        <ComponentPreview code={approvedCode}>
          <div className="w-full max-w-xl">
            <PlanTool part={approvedPart} />
          </div>
        </ComponentPreview>
      </DocSection>

      <DocSection title="Title only">
        <ComponentPreview code={minimalCode}>
          <div className="w-full max-w-xl">
            <PlanTool part={minimalPart} />
          </div>
        </ComponentPreview>
      </DocSection>

      <DocSection title="API Reference">
        <PropsTable props={planProps} />
      </DocSection>
    </DocPage>
  );
}
