"use client";

import { useState } from "react";
import { InputBar } from "@/registry/default/agent-ui/components/input-bar";
import type { SuggestionItem } from "@/registry/default/agent-ui/components/input/suggestions";
import { ComponentPreview } from "@/lib/docs/ComponentPreview";
import { PropsTable, type PropDef } from "@/lib/docs/PropsTable";
import { DocPage, DocSection } from "@/lib/docs/DocPage";

const suggestions: SuggestionItem[] = [
  { id: "s1", label: "Build a landing page" },
  { id: "s2", label: "Write tests for the auth flow" },
  { id: "s3", label: "Refactor the data layer" },
];

function BasicInputBarDemo() {
  const [value, setValue] = useState("");
  return (
    <InputBar
      value={value}
      onChange={setValue}
      onSend={({ content }) => setValue(`(sent: ${content})`)}
      onStop={() => {}}
      status="ready"
      placeholder="Send a message..."
    />
  );
}

function SuggestionsInputBarDemo() {
  const [value, setValue] = useState("");
  return (
    <InputBar
      value={value}
      onChange={setValue}
      onSend={() => setValue("")}
      onStop={() => {}}
      status="ready"
      suggestions={suggestions}
      placeholder="Try a suggestion..."
    />
  );
}

function StreamingInputBarDemo() {
  return (
    <InputBar
      value="Thinking through your request..."
      onChange={() => {}}
      onSend={() => {}}
      onStop={() => {}}
      status="streaming"
    />
  );
}

function AttachmentInputBarDemo() {
  const [value, setValue] = useState("");
  return (
    <InputBar
      value={value}
      onChange={setValue}
      onSend={() => setValue("")}
      onStop={() => {}}
      status="ready"
      onAttach={() => {}}
      attachedFiles={[{ id: "f1", filename: "report.pdf", size: 124_000 }]}
      onRemoveFile={() => {}}
      placeholder="Send a message with attachments..."
    />
  );
}

const basicCode = `import { useState } from "react";
import { InputBar } from "./components/input-bar";

function Example() {
  const [value, setValue] = useState("");

  return (
    <InputBar
      value={value}
      onChange={setValue}
      onSend={({ content }) => console.log(content)}
      onStop={() => {}}
      status="ready"
      placeholder="Send a message..."
    />
  );
}`;

const suggestionsCode = `import { InputBar } from "./components/input-bar";

const suggestions = [
  { label: "Build a landing page" },
  { label: "Write tests for the auth flow" },
  { label: "Refactor the data layer" },
];

<InputBar
  value={value}
  onChange={setValue}
  onSend={onSend}
  onStop={onStop}
  status="ready"
  suggestions={suggestions}
/>`;

const streamingCode = `import { InputBar } from "./components/input-bar";

// While the model is streaming, the send button switches to a stop button
// and \`onStop\` is called when the user clicks it.
<InputBar
  value=""
  onChange={() => {}}
  onSend={() => {}}
  onStop={onStop}
  status="streaming"
/>`;

const attachmentsCode = `import { InputBar } from "./components/input-bar";

<InputBar
  value={value}
  onChange={setValue}
  onSend={onSend}
  onStop={onStop}
  status="ready"
  onAttach={() => openFilePicker()}
  attachedFiles={[
    { id: "f1", filename: "report.pdf", size: 124_000 },
  ]}
  onRemoveFile={(id) => removeFile(id)}
/>`;

const inputBarProps: PropDef[] = [
  {
    name: "onSend",
    type: '({ role: "user"; content: string }) => void',
    description: "Called when the user submits the input (Enter or Send button).",
  },
  {
    name: "onStop",
    type: "() => void",
    description:
      "Called when the user clicks the Stop button while `status` is 'streaming' or 'submitted'.",
  },
  {
    name: "status",
    type: "ChatStatus",
    description:
      "Vercel AI SDK ChatStatus ('ready' | 'submitted' | 'streaming' | 'error'). Drives the send/stop button state.",
  },
  {
    name: "value",
    type: "string | undefined",
    description: "Controlled input value. Pair with `onChange` for controlled mode.",
  },
  {
    name: "onChange",
    type: "(value: string) => void | undefined",
    description: "Controlled change handler.",
  },
  {
    name: "placeholder",
    type: "string | undefined",
    default: '"Send a message..."',
    description: "Placeholder shown when the textarea is empty.",
  },
  {
    name: "suggestions",
    type: "SuggestionItem[] | { items, className?, itemClassName? }",
    description:
      "Inline suggestion chips rendered below the input. Clicking a chip prefills the textarea.",
  },
  {
    name: "onAttach",
    type: "() => void | undefined",
    description:
      "When provided, an attachment button is rendered. Typically opens a file picker.",
  },
  {
    name: "attachedImages",
    type: "AttachedImage[]",
    default: "[]",
    description:
      "Currently attached images. Rendered as thumbnails above the textarea.",
  },
  {
    name: "attachedFiles",
    type: "AttachedFile[]",
    default: "[]",
    description: "Currently attached non-image files. Rendered as chips.",
  },
  {
    name: "onRemoveImage / onRemoveFile",
    type: "(id: string) => void",
    description: "Called when the user clicks the remove button on an attachment.",
  },
  {
    name: "questionBar",
    type: "{ id, questions, onSubmit, ... } | undefined",
    description:
      "Inline question prompt rendered above the textarea. Used by AgentChat to surface pending clarifying questions.",
  },
  {
    name: "infoBar",
    type: "{ title?, description?, onClose?, action?, position? } | undefined",
    description:
      "Optional banner above or below the textarea (e.g. quota notice, upgrade CTA).",
  },
  {
    name: "leftActions / rightActions",
    type: "React.ReactNode",
    description: "Custom toolbar slots adjacent to the send button.",
  },
  {
    name: "typingAnimation",
    type: "{ text, duration, image?, isActive, onComplete } | undefined",
    description:
      "Drives a scripted typing animation in the textarea (used for hero/marketing demos).",
  },
];

export default function AgentInputBarDoc() {
  return (
    <DocPage
      title="Input Bar"
      slug="agent-input-bar"
      description="Composable chat input. Auto-resizing textarea, send/stop button, suggestion chips, attachments, question prompts, and custom toolbar slots."
    >
      <DocSection title="Basic">
        <ComponentPreview code={basicCode}>
          <div className="w-full max-w-xl">
            <BasicInputBarDemo />
          </div>
        </ComponentPreview>
      </DocSection>

      <DocSection title="With suggestions">
        <ComponentPreview code={suggestionsCode}>
          <div className="w-full max-w-xl">
            <SuggestionsInputBarDemo />
          </div>
        </ComponentPreview>
      </DocSection>

      <DocSection title="Streaming">
        <ComponentPreview code={streamingCode}>
          <div className="w-full max-w-xl">
            <StreamingInputBarDemo />
          </div>
        </ComponentPreview>
      </DocSection>

      <DocSection title="With attachment">
        <ComponentPreview code={attachmentsCode}>
          <div className="w-full max-w-xl">
            <AttachmentInputBarDemo />
          </div>
        </ComponentPreview>
      </DocSection>

      <DocSection title="API Reference">
        <PropsTable props={inputBarProps} />
      </DocSection>
    </DocPage>
  );
}
