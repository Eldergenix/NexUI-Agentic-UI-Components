"use client";

import { useState } from "react";
import type { UIMessage, ChatStatus } from "ai";
import { AgentChat } from "@/registry/default/agent-ui/components/agent-chat";
import { ComponentPreview } from "@/lib/docs/ComponentPreview";
import { PropsTable, type PropDef } from "@/lib/docs/PropsTable";
import { DocPage, DocSection } from "@/lib/docs/DocPage";

// Cast to `UIMessage[]` via `as any` because UIMessage in the AI SDK is a
// tagged union and constructing literal demo data hits TS friction. The
// runtime shape matches what AgentChat reads.
const seededMessages = [
  {
    id: "m-user-1",
    role: "user",
    parts: [{ type: "text", text: "What can you build for me today?" }],
  },
  {
    id: "m-assistant-1",
    role: "assistant",
    parts: [
      {
        type: "text",
        text: "I can build full-stack features end-to-end — scaffolding a Next.js app, wiring auth, writing the data layer, and deploying. Pick something concrete and we will start.",
      },
    ],
  },
] as any as UIMessage[];

function PausedChatDemo() {
  const [messages, setMessages] = useState<UIMessage[]>(seededMessages);
  const [status] = useState<ChatStatus>("ready");

  return (
    <AgentChat
      messages={messages}
      status={status}
      onSend={({ content }) => {
        setMessages((prev) => [
          ...prev,
          {
            id: `m-user-${prev.length + 1}`,
            role: "user",
            parts: [{ type: "text", text: content }],
          } as any as UIMessage,
        ]);
      }}
      onStop={() => {}}
    />
  );
}

function CenteredEmptyChatDemo() {
  return (
    <AgentChat
      messages={[]}
      status="ready"
      onSend={() => {}}
      onStop={() => {}}
      emptyStatePosition="center"
      emptySuggestionsPlacement="both"
      emptySuggestionsPosition="top"
      suggestions={[
        { id: "s1", label: "Build a landing page" },
        { id: "s2", label: "Write tests for auth" },
        { id: "s3", label: "Refactor the data layer" },
      ]}
    />
  );
}

function StreamingChatDemo() {
  const messages = [
    {
      id: "m-user-1",
      role: "user",
      parts: [{ type: "text", text: "Deploy the staging branch." }],
    },
    {
      id: "m-assistant-1",
      role: "assistant",
      parts: [
        {
          type: "tool-Bash",
          toolCallId: "t-1",
          state: "input-streaming",
          input: { command: "git push staging" },
        },
      ],
    },
  ] as any as UIMessage[];

  return (
    <AgentChat
      messages={messages}
      status="streaming"
      onSend={() => {}}
      onStop={() => {}}
    />
  );
}

const basicCode = `import { AgentChat } from "./components/agent-chat";
import { useChat } from "@ai-sdk/react";

function Example() {
  const { messages, sendMessage, status, stop, error } = useChat({
    api: "/api/chat",
  });

  return (
    <AgentChat
      messages={messages}
      status={status}
      onSend={({ content }) => sendMessage({ text: content })}
      onStop={stop}
      error={error}
    />
  );
}`;

const emptyCode = `import { AgentChat } from "./components/agent-chat";

<AgentChat
  messages={[]}
  status="ready"
  onSend={onSend}
  onStop={onStop}
  emptyStatePosition="center"
  emptySuggestionsPlacement="both"
  emptySuggestionsPosition="top"
  suggestions={[
    { label: "Build a landing page" },
    { label: "Write tests for auth" },
    { label: "Refactor the data layer" },
  ]}
/>`;

const streamingCode = `import { AgentChat } from "./components/agent-chat";

// Pass status="streaming" to show a 'Processing...' row while the model is
// generating, and to swap the send button for a stop button.
<AgentChat
  messages={messages}
  status="streaming"
  onSend={onSend}
  onStop={onStop}
/>`;

const agentChatProps: PropDef[] = [
  {
    name: "messages",
    type: "UIMessage[]",
    description: "Vercel AI SDK message array. Usually wired to `useChat()`.",
  },
  {
    name: "onSend",
    type: '({ role: "user"; content: string }) => void',
    description: "Called when the user submits a message from the input bar.",
  },
  {
    name: "status",
    type: "ChatStatus",
    description:
      "Vercel AI SDK ChatStatus. Drives the planning indicator and the send/stop button.",
  },
  {
    name: "onStop",
    type: "() => void",
    description: "Called when the user clicks Stop while the agent is streaming.",
  },
  {
    name: "error",
    type: "Error | undefined",
    description:
      "When set, an assistant error message is appended at the end of the conversation.",
  },
  {
    name: "classNames",
    type: "Partial<ChatClassNames>",
    description:
      "Element-level class overrides: { root?, userMessage?, inputBar? }.",
  },
  {
    name: "slots",
    type: "Partial<ChatSlots>",
    description:
      "Replace { InputBar, UserMessage, ToolRenderer } with your own components.",
  },
  {
    name: "toolRenderers",
    type: "Record<string, ComponentType<CustomToolRendererProps>>",
    description:
      "Map of tool name → custom renderer for bespoke tool types from your agent.",
  },
  {
    name: "attachments",
    type: "{ onAttach?, images?, files?, onRemoveImage?, onRemoveFile?, onPaste?, isDragOver? }",
    description:
      "Attachment configuration forwarded to the underlying InputBar.",
  },
  {
    name: "showCopyToolbar",
    type: "boolean | undefined",
    description:
      "Whether assistant turns show a copy-to-clipboard toolbar on hover.",
  },
  {
    name: "initialScrollBehavior",
    type: '"bottom" | "top"',
    default: '"bottom"',
    description: "Where to position the scroll container on initial mount.",
  },
  {
    name: "enableImagePreview",
    type: "boolean",
    default: "true",
    description:
      "When true, clicking an attached image opens a fullscreen lightbox.",
  },
  {
    name: "suggestions",
    type: "SuggestionItem[] | { items, className?, itemClassName? }",
    description:
      "Suggestion chips shown in the input (or below the centered empty state when configured).",
  },
  {
    name: "emptyStatePosition",
    type: '"default" | "center"',
    default: '"default"',
    description:
      "When 'center', the input bar is vertically centered in the viewport while there are no messages.",
  },
  {
    name: "emptySuggestionsPlacement",
    type: '"input" | "empty" | "both"',
    default: '"input"',
    description:
      "Where suggestion chips render in the centered empty state: under the input, in the empty state pane, or both.",
  },
  {
    name: "emptySuggestionsPosition",
    type: '"top" | "bottom"',
    default: '"top"',
    description:
      "Whether suggestions in the centered empty state appear above or below the input.",
  },
  {
    name: "questionTool",
    type: "{ submitLabel?, skipLabel?, allowSkip?, onAnswer? } | undefined",
    description:
      "Configuration for handling `tool-Question` parts. When a pending question exists it is surfaced in the InputBar.",
  },
  {
    name: "className / style",
    type: "string | React.CSSProperties",
    description: "Standard className/style passthrough for the root element.",
  },
];

export default function AgentChatDoc() {
  return (
    <DocPage
      title="Agent Chat"
      slug="agent-chat"
      description="Drop-in agent chat shell that composes MessageList + InputBar and forwards to a Vercel AI SDK `useChat()` instance. Supports custom tool renderers, attachments, suggestions, centered empty states, and inline clarifying questions."
    >
      <DocSection title="Paused conversation">
        <ComponentPreview code={basicCode}>
          <div className="w-full max-w-xl h-[400px] border border-border/40 rounded-md overflow-hidden flex flex-col">
            <PausedChatDemo />
          </div>
        </ComponentPreview>
      </DocSection>

      <DocSection title="Empty state (centered)">
        <ComponentPreview code={emptyCode}>
          <div className="w-full max-w-xl h-[360px] border border-border/40 rounded-md overflow-hidden flex flex-col">
            <CenteredEmptyChatDemo />
          </div>
        </ComponentPreview>
      </DocSection>

      <DocSection title="Streaming">
        <ComponentPreview code={streamingCode}>
          <div className="w-full max-w-xl h-[360px] border border-border/40 rounded-md overflow-hidden flex flex-col">
            <StreamingChatDemo />
          </div>
        </ComponentPreview>
      </DocSection>

      <DocSection title="API Reference">
        <PropsTable props={agentChatProps} />
      </DocSection>
    </DocPage>
  );
}
