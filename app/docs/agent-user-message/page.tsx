"use client";

import type { UIMessage } from "ai";
import { UserMessage } from "@/registry/default/agent-ui/components/user-message";
import { ComponentPreview } from "@/lib/docs/ComponentPreview";
import { PropsTable, type PropDef } from "@/lib/docs/PropsTable";
import { DocPage, DocSection } from "@/lib/docs/DocPage";

const textCode = `import { UserMessage } from "./components";
import type { UIMessage } from "ai";

const message: UIMessage = {
  id: "demo-1",
  role: "user",
  parts: [{ type: "text", text: "Hello, can you help me debug this issue?" }],
};

<UserMessage message={message} />`;

const longCode = `import { UserMessage } from "./components";
import type { UIMessage } from "ai";

const message: UIMessage = {
  id: "demo-2",
  role: "user",
  parts: [
    {
      type: "text",
      text: "I'm running into a confusing TypeScript error when generic constraints meet conditional types. The compiler reports that the inferred type does not satisfy the constraint, but I can't figure out which branch of the conditional is triggering it. Can you walk me through how to diagnose this kind of error?",
    },
  ],
};

<UserMessage message={message} />`;

const shortMessage = {
  id: "demo-1",
  role: "user",
  parts: [{ type: "text", text: "Hello, can you help me debug this issue?" }],
} as unknown as UIMessage;

const longMessage = {
  id: "demo-2",
  role: "user",
  parts: [
    {
      type: "text",
      text: "I'm running into a confusing TypeScript error when generic constraints meet conditional types. The compiler reports that the inferred type does not satisfy the constraint, but I can't figure out which branch of the conditional is triggering it. Can you walk me through how to diagnose this kind of error?",
    },
  ],
} as unknown as UIMessage;

const userMessageProps: PropDef[] = [
  {
    name: "message",
    type: "UIMessage",
    description:
      'Required. A UIMessage from the "ai" package. Text parts are concatenated and rendered; image and file parts are rendered as attachments.',
  },
  {
    name: "className",
    type: "string",
    description: "Additional class names to merge with the outer wrapper.",
  },
  {
    name: "enableImagePreview",
    type: "boolean",
    default: "true",
    description:
      "When true, clicking an attached image opens a fullscreen lightbox preview. Set to false to render images as plain thumbnails.",
  },
];

export default function UserMessageDoc() {
  return (
    <DocPage
      title="UserMessage"
      slug="agent-user-message"
      description="Renders a user turn from a UIMessage. Handles text, image attachments (with optional lightbox), and file attachments."
    >
      <DocSection title="Text message">
        <ComponentPreview code={textCode}>
          <div className="w-full max-w-md">
            <UserMessage message={shortMessage} />
          </div>
        </ComponentPreview>
      </DocSection>

      <DocSection title="Long message">
        <ComponentPreview code={longCode}>
          <div className="w-full max-w-md">
            <UserMessage message={longMessage} />
          </div>
        </ComponentPreview>
      </DocSection>

      <DocSection title="API Reference">
        <PropsTable props={userMessageProps} />
      </DocSection>
    </DocPage>
  );
}
