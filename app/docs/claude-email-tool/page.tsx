"use client";

import {
  ClaudeEmailTool,
  type EmailMessageVariant,
} from "@/components/ai-components/claude-email-tool";
import { ComponentPreview } from "@/lib/docs/ComponentPreview";
import { PropsTable, type PropDef } from "@/lib/docs/PropsTable";
import { DocPage, DocSection } from "@/lib/docs/DocPage";

const basicCode = `import { ClaudeEmailTool } from "./components";

<ClaudeEmailTool
  kind="email"
  summary_title="Draft email to Avery"
  variants={[
    {
      label: "Warm",
      subject: "Quick check-in before Thursday",
      body: \`Hi Avery,

Wanted to send a quick note before our Thursday review.
I pulled the latest numbers and they look on track — happy
to walk through them whenever works for you.

Thanks for making the time,
Jamie\`,
    },
  ]}
/>`;

const variantsCode = `import { ClaudeEmailTool } from "./components";

<ClaudeEmailTool
  kind="email"
  summary_title="Reply to launch announcement"
  variants={[
    { label: "Warm",       subject: "...", body: "..." },
    { label: "Direct",     subject: "...", body: "..." },
    { label: "Enthusiastic", subject: "...", body: "..." },
  ]}
  onBodyChange={(body) => console.log(body)}
/>`;

const warmDraft: EmailMessageVariant = {
  label: "Warm",
  subject: "Quick check-in before Thursday",
  body: `Hi Avery,

Wanted to send a quick note before our Thursday review.
I pulled the latest numbers and they look on track — happy
to walk through them whenever works for you.

Thanks for making the time,
Jamie`,
};

const directDraft: EmailMessageVariant = {
  label: "Direct",
  subject: "Thursday review — numbers attached",
  body: `Avery,

Numbers for Thursday's review are in good shape. Let me know
if you want to sync before then; otherwise see you at 2.

Jamie`,
};

const enthusiasticDraft: EmailMessageVariant = {
  label: "Enthusiastic",
  subject: "Excited for Thursday — quick preview!",
  body: `Hey Avery!

Really looking forward to Thursday — the numbers came in
even better than we expected and I cannot wait to walk you
through them. Let me know if you want a quick preview before.

Cheers,
Jamie`,
};

const emailToolProps: PropDef[] = [
  {
    name: "kind",
    type: '"email"',
    description: "Discriminator for the tool kind. Always `\"email\"`.",
  },
  {
    name: "summary_title",
    type: "string",
    description: "Short label shown above the draft (e.g. card or list title).",
  },
  {
    name: "variants",
    type: "EmailMessageVariant[]",
    description:
      "One or more writing versions. Multiple entries render a style switcher above the draft.",
  },
  {
    name: "onBodyChange",
    type: "(body: string) => void",
    description:
      "Fired when the user edits the body. The component also tracks the edit internally.",
  },
];

export default function ClaudeEmailToolDoc() {
  // Demo callback is a no-op.
  const noop = () => {};

  return (
    <DocPage
      title="Claude Email Tool"
      slug="claude-email-tool"
      description="Inline email draft tool with optional writing-style variants, copy-to-clipboard, reset, and send via Gmail or Mail."
    >
      <DocSection title="Basic">
        <ComponentPreview code={basicCode}>
          <div className="w-full max-w-3xl">
            <ClaudeEmailTool
              kind="email"
              summary_title="Draft email to Avery"
              variants={[warmDraft]}
            />
          </div>
        </ComponentPreview>
      </DocSection>

      <DocSection title="Multiple writing styles">
        <ComponentPreview code={variantsCode}>
          <div className="w-full max-w-3xl">
            <ClaudeEmailTool
              kind="email"
              summary_title="Reply to launch announcement"
              variants={[warmDraft, directDraft, enthusiasticDraft]}
              onBodyChange={noop}
            />
          </div>
        </ComponentPreview>
      </DocSection>

      <DocSection title="API Reference">
        <PropsTable props={emailToolProps} />
      </DocSection>
    </DocPage>
  );
}
