"use client";

import { ErrorMessage } from "@/registry/default/agent-ui/components/error-message";
import { ComponentPreview } from "@/lib/docs/ComponentPreview";
import { PropsTable, type PropDef } from "@/lib/docs/PropsTable";
import { DocPage, DocSection } from "@/lib/docs/DocPage";

const defaultCode = `import { ErrorMessage } from "./components";

<ErrorMessage message="Unable to complete the request. Please try again." />`;

const customTitleCode = `import { ErrorMessage } from "./components";

<ErrorMessage
  title="Network error"
  message="We couldn't reach the model provider. Check your connection and retry."
/>`;

const errorMessageProps: PropDef[] = [
  {
    name: "title",
    type: "string",
    default: '"Something went wrong"',
    description: "Headline shown above the message body.",
  },
  {
    name: "message",
    type: "string",
    description: "Required. Details about what went wrong.",
  },
  {
    name: "className",
    type: "string",
    description: "Additional class names to merge with the outer wrapper.",
  },
];

export default function ErrorMessageDoc() {
  return (
    <DocPage
      title="ErrorMessage"
      slug="agent-error-message"
      description="Inline error notice for an agent transcript. Renders a red-tinted card with a title and body."
    >
      <DocSection title="Default">
        <ComponentPreview code={defaultCode}>
          <ErrorMessage message="Unable to complete the request. Please try again." />
        </ComponentPreview>
      </DocSection>

      <DocSection title="Custom title">
        <ComponentPreview code={customTitleCode}>
          <ErrorMessage
            title="Network error"
            message="We couldn't reach the model provider. Check your connection and retry."
          />
        </ComponentPreview>
      </DocSection>

      <DocSection title="API Reference">
        <PropsTable props={errorMessageProps} />
      </DocSection>
    </DocPage>
  );
}
