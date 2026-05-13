"use client";

import { McpTool } from "@/registry/default/agent-ui/components/tools/mcp-tool";
import type { McpToolInfo } from "@/registry/default/agent-ui/components/tools/tool-registry";
import { ComponentPreview } from "@/lib/docs/ComponentPreview";
import { PropsTable, type PropDef } from "@/lib/docs/PropsTable";
import { DocPage, DocSection } from "@/lib/docs/DocPage";

// Cast to `any` because the part shape mirrors AI SDK message-part objects.
const linearMcpInfo: McpToolInfo = {
  serverName: "linear",
  toolName: "search_issues",
  displayName: "Search Issues",
  category: "search",
};

const linearPart: any = {
  type: "tool-mcp__linear__search_issues",
  toolCallId: "mcp-1",
  state: "output-available",
  input: {
    query: "login bug",
    limit: 5,
  },
  output: [
    {
      type: "text",
      text: JSON.stringify(
        {
          results: [
            { id: "LIN-412", title: "Login form rejects valid emails" },
            { id: "LIN-501", title: "OAuth callback 500s on Safari" },
          ],
        },
        null,
        2,
      ),
    },
  ],
};

const stripeMcpInfo: McpToolInfo = {
  serverName: "stripe",
  toolName: "create_customer",
  displayName: "Create Customer",
  category: "create",
};

const stripePart: any = {
  type: "tool-mcp__stripe__create_customer",
  toolCallId: "mcp-2",
  state: "input-streaming",
  input: {
    email: "ada@example.com",
    name: "Ada Lovelace",
  },
};

const completedCode = `import { McpTool } from "./components/tools/mcp-tool";

const mcpInfo = {
  serverName: "linear",
  toolName: "search_issues",
  displayName: "Search Issues",
  category: "search",
};

const part = {
  type: "tool-mcp__linear__search_issues",
  toolCallId: "mcp-1",
  state: "output-available",
  input: { query: "login bug", limit: 5 },
  output: [{ type: "text", text: "{ \\"results\\": [...] }" }],
};

<McpTool part={part} mcpInfo={mcpInfo} defaultOpen />`;

const pendingCode = `import { McpTool } from "./components/tools/mcp-tool";

<McpTool
  part={{
    type: "tool-mcp__stripe__create_customer",
    toolCallId: "mcp-2",
    state: "input-streaming",
    input: { email: "ada@example.com", name: "Ada Lovelace" },
  }}
  mcpInfo={{
    serverName: "stripe",
    toolName: "create_customer",
    displayName: "Create Customer",
    category: "create",
  }}
  chatStatus="streaming"
/>`;

const mcpProps: PropDef[] = [
  {
    name: "part",
    type: "any",
    description:
      "AI SDK tool-call message part with a `tool-mcp__<server>__<name>` type. Reads `state`, `input`, and `output`.",
  },
  {
    name: "mcpInfo",
    type: "McpToolInfo",
    description:
      "Parsed MCP metadata: `{ serverName, toolName, displayName, category }`. Usually produced by `parseMcpToolType(part.type)`.",
  },
  {
    name: "chatStatus",
    type: "string | undefined",
    description:
      "Forwarded chat status. When 'streaming' on a part with no output, the header shimmers with the active verb (e.g. 'Searching Issues').",
  },
  {
    name: "defaultOpen",
    type: "boolean | undefined",
    description:
      "When true, the result body (JSON or text) starts expanded instead of collapsed.",
  },
];

export default function AgentMcpToolDoc() {
  return (
    <DocPage
      title="MCP Tool"
      slug="agent-mcp-tool"
      description="Renders a Model Context Protocol tool call. Title verbs (Search/Searching/Searched) flip automatically based on lifecycle state, and the result body unwraps text/JSON blocks."
    >
      <DocSection title="Completed">
        <ComponentPreview code={completedCode}>
          <div className="w-full max-w-xl">
            <McpTool part={linearPart} mcpInfo={linearMcpInfo} defaultOpen />
          </div>
        </ComponentPreview>
      </DocSection>

      <DocSection title="Pending">
        <ComponentPreview code={pendingCode}>
          <div className="w-full max-w-xl">
            <McpTool
              part={stripePart}
              mcpInfo={stripeMcpInfo}
              chatStatus="streaming"
            />
          </div>
        </ComponentPreview>
      </DocSection>

      <DocSection title="API Reference">
        <PropsTable props={mcpProps} />
      </DocSection>
    </DocPage>
  );
}
