"use client";

import type { UIMessage } from "ai";
import { MessageList } from "@/registry/default/agent-ui/components/message-list";
import { ComponentPreview } from "@/lib/docs/ComponentPreview";
import { PropsTable, type PropDef } from "@/lib/docs/PropsTable";
import { DocPage, DocSection } from "@/lib/docs/DocPage";

// Cast to `UIMessage[]` via `as any` — UIMessage in @ai-sdk/ui is a tagged
// union and constructing literal demo data hits TS friction. The runtime
// shape matches what MessageList reads.
const basicMessages = [
  {
    id: "m-user-1",
    role: "user",
    parts: [{ type: "text", text: "Can you summarize this codebase?" }],
  },
  {
    id: "m-assistant-1",
    role: "assistant",
    parts: [
      {
        type: "text",
        text: "Sure — it is a small Next.js app with a registry of UI primitives and an agent chat shell. The agent surface composes a MessageList and an InputBar.",
      },
    ],
  },
  {
    id: "m-user-2",
    role: "user",
    parts: [{ type: "text", text: "Show me the entry component." }],
  },
] as any as UIMessage[];

const toolMessages = [
  {
    id: "m-user-1",
    role: "user",
    parts: [{ type: "text", text: "Find the AgentChat component." }],
  },
  {
    id: "m-assistant-1",
    role: "assistant",
    parts: [
      {
        type: "tool-Grep",
        toolCallId: "t-1",
        state: "output-available",
        input: { pattern: "AgentChat", path: "src" },
        output: { numFiles: 2 },
      },
      {
        type: "tool-Read",
        toolCallId: "t-2",
        state: "output-available",
        input: { file_path: "src/components/agent-chat.tsx" },
        output: { content: "..." },
      },
      {
        type: "text",
        text: "Found it. `AgentChat` lives in `src/components/agent-chat.tsx` and re-exports `MessageList` + `InputBar`.",
      },
    ],
  },
] as any as UIMessage[];

const errorMessages = [
  {
    id: "m-user-1",
    role: "user",
    parts: [{ type: "text", text: "Deploy to production." }],
  },
  {
    id: "m-assistant-1",
    role: "assistant",
    parts: [
      {
        type: "error",
        title: "Deploy failed",
        message: "Missing DATABASE_URL env var in production.",
      },
    ],
  },
] as any as UIMessage[];

const basicCode = `import { MessageList } from "./components/message-list";

const messages = [
  { id: "m1", role: "user", parts: [{ type: "text", text: "Hello" }] },
  { id: "m2", role: "assistant", parts: [{ type: "text", text: "Hi! How can I help?" }] },
];

<MessageList messages={messages} status="ready" />`;

const toolCode = `import { MessageList } from "./components/message-list";

const messages = [
  {
    id: "m-user",
    role: "user",
    parts: [{ type: "text", text: "Find the AgentChat component." }],
  },
  {
    id: "m-assistant",
    role: "assistant",
    parts: [
      {
        type: "tool-Grep",
        toolCallId: "t-1",
        state: "output-available",
        input: { pattern: "AgentChat", path: "src" },
        output: { numFiles: 2 },
      },
      {
        type: "tool-Read",
        toolCallId: "t-2",
        state: "output-available",
        input: { file_path: "src/components/agent-chat.tsx" },
        output: { content: "..." },
      },
      { type: "text", text: "Found it..." },
    ],
  },
];

<MessageList messages={messages} status="ready" />`;

const errorCode = `import { MessageList } from "./components/message-list";

// "error" parts on an assistant message render the ErrorMessage component.
<MessageList
  messages={[
    { id: "u", role: "user", parts: [{ type: "text", text: "Deploy" }] },
    {
      id: "a",
      role: "assistant",
      parts: [{
        type: "error",
        title: "Deploy failed",
        message: "Missing DATABASE_URL env var in production.",
      }],
    },
  ]}
  status="ready"
/>`;

const messageListProps: PropDef[] = [
  {
    name: "messages",
    type: "UIMessage[]",
    description:
      "Vercel AI SDK message array. Each message has `role`, `parts`, and `id`. Parts can be `text`, `error`, or `tool-*` parts.",
  },
  {
    name: "status",
    type: "ChatStatus",
    description:
      "Vercel AI SDK ChatStatus. When 'streaming' or 'submitted', the list shows a 'Processing...' planning row and reserves breathing space at the bottom.",
  },
  {
    name: "className",
    type: "string | undefined",
    description: "Extra classes applied to the scroll container.",
  },
  {
    name: "showCopyToolbar",
    type: "boolean",
    default: "true",
    description:
      "Whether to render the copy-to-clipboard / timestamp toolbar that appears on hover.",
  },
  {
    name: "suppressQuestionTool",
    type: "boolean",
    default: "false",
    description:
      "Hides `tool-Question` parts (AgentChat uses this when surfacing the question in the InputBar instead).",
  },
  {
    name: "initialScrollBehavior",
    type: '"bottom" | "top"',
    default: '"bottom"',
    description:
      "Where to position the scroll container on mount. 'top' is useful for static demos.",
  },
  {
    name: "enableImagePreview",
    type: "boolean",
    default: "true",
    description:
      "When true, clicking an attached image opens a fullscreen lightbox.",
  },
  {
    name: "slots",
    type: "{ UserMessage?, ToolRenderer? } | undefined",
    description:
      "Override the user-message bubble or the per-tool renderer with your own component.",
  },
  {
    name: "classNames",
    type: "{ userMessage?: string } | undefined",
    description: "Element-level class overrides.",
  },
  {
    name: "toolRenderers",
    type: "Record<string, ComponentType<CustomToolRendererProps>>",
    description:
      "Map of tool name → custom renderer, used by the default ToolRenderer to render bespoke tool types.",
  },
];

export default function AgentMessageListDoc() {
  return (
    <DocPage
      title="Message List"
      slug="agent-message-list"
      description="Renders Vercel AI SDK UIMessage[] with streaming, tool calls, copy actions, and lightbox previews. Auto-scrolls to the latest message and reserves breathing space while the model is thinking."
    >
      <DocSection title="Basic">
        <ComponentPreview code={basicCode}>
          <div className="w-full max-w-xl h-[260px] border border-border/40 rounded-md overflow-hidden flex flex-col">
            <MessageList
              messages={basicMessages}
              status="ready"
              initialScrollBehavior="top"
            />
          </div>
        </ComponentPreview>
      </DocSection>

      <DocSection title="With tool calls">
        <ComponentPreview code={toolCode}>
          <div className="w-full max-w-xl h-[320px] border border-border/40 rounded-md overflow-hidden flex flex-col">
            <MessageList
              messages={toolMessages}
              status="ready"
              initialScrollBehavior="top"
            />
          </div>
        </ComponentPreview>
      </DocSection>

      <DocSection title="With error">
        <ComponentPreview code={errorCode}>
          <div className="w-full max-w-xl h-[260px] border border-border/40 rounded-md overflow-hidden flex flex-col">
            <MessageList
              messages={errorMessages}
              status="ready"
              initialScrollBehavior="top"
            />
          </div>
        </ComponentPreview>
      </DocSection>

      <DocSection title="API Reference">
        <PropsTable props={messageListProps} />
      </DocSection>
    </DocPage>
  );
}
