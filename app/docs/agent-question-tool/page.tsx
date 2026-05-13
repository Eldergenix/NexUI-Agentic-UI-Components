"use client";

import { QuestionTool } from "@/registry/default/agent-ui/components/question/question-tool";
import type { QuestionConfig } from "@/registry/default/agent-ui/components/question/question-prompt";
import { ComponentPreview } from "@/lib/docs/ComponentPreview";
import { PropsTable, type PropDef } from "@/lib/docs/PropsTable";
import { DocPage, DocSection } from "@/lib/docs/DocPage";

// Cast to `any` for the `part` props so demos can omit the strict
// QuestionToolPart shape — the runtime component only reads input/output.

const singleQuestion: QuestionConfig[] = [
  {
    kind: "single",
    title: "Which framework should we use?",
    options: [
      { id: "next", label: "Next.js" },
      { id: "remix", label: "Remix" },
      { id: "astro", label: "Astro" },
    ],
    allowCustom: true,
    customPlaceholder: "Other framework...",
  },
];

const multiQuestion: QuestionConfig[] = [
  {
    kind: "multi",
    title: "Which integrations should we include?",
    minSelections: 1,
    maxSelections: 3,
    options: [
      { id: "auth", label: "Auth", description: "(Clerk / NextAuth)" },
      { id: "billing", label: "Billing", description: "(Stripe)" },
      { id: "analytics", label: "Analytics", description: "(PostHog)" },
      { id: "email", label: "Email", description: "(Resend)" },
    ],
  },
];

const textQuestion: QuestionConfig[] = [
  {
    kind: "text",
    title: "Describe what this app does in one sentence.",
    placeholder: "A productivity app for...",
  },
];

const multiStepQuestions: QuestionConfig[] = [
  {
    kind: "single",
    title: "Choose a database.",
    options: [
      { id: "pg", label: "Postgres" },
      { id: "sqlite", label: "SQLite" },
    ],
  },
  {
    kind: "single",
    title: "Choose a hosting provider.",
    options: [
      { id: "vercel", label: "Vercel" },
      { id: "fly", label: "Fly.io" },
    ],
  },
];

const singlePart: any = {
  type: "tool-Question",
  toolCallId: "q-single",
  state: "input-streaming",
  input: { questions: singleQuestion },
};

const multiPart: any = {
  type: "tool-Question",
  toolCallId: "q-multi",
  state: "input-streaming",
  input: { questions: multiQuestion },
};

const textPart: any = {
  type: "tool-Question",
  toolCallId: "q-text",
  state: "input-streaming",
  input: { questions: textQuestion, submitLabel: "Submit" },
};

const multiStepPart: any = {
  type: "tool-Question",
  toolCallId: "q-multi-step",
  state: "input-streaming",
  input: {
    questions: multiStepQuestions,
    questionIndex: 1,
    totalQuestions: 2,
  },
};

const singleCode = `import { QuestionTool } from "./components/question/question-tool";

const part = {
  type: "tool-Question",
  toolCallId: "q-single",
  state: "input-streaming",
  input: {
    questions: [
      {
        kind: "single",
        title: "Which framework should we use?",
        options: [
          { id: "next", label: "Next.js" },
          { id: "remix", label: "Remix" },
          { id: "astro", label: "Astro" },
        ],
        allowCustom: true,
        customPlaceholder: "Other framework...",
      },
    ],
  },
};

<QuestionTool part={part} />`;

const multiCode = `import { QuestionTool } from "./components/question/question-tool";

<QuestionTool
  part={{
    type: "tool-Question",
    toolCallId: "q-multi",
    state: "input-streaming",
    input: {
      questions: [
        {
          kind: "multi",
          title: "Which integrations should we include?",
          minSelections: 1,
          maxSelections: 3,
          options: [
            { id: "auth", label: "Auth", description: "(Clerk / NextAuth)" },
            { id: "billing", label: "Billing", description: "(Stripe)" },
            { id: "analytics", label: "Analytics", description: "(PostHog)" },
            { id: "email", label: "Email", description: "(Resend)" },
          ],
        },
      ],
    },
  }}
/>`;

const textCode = `import { QuestionTool } from "./components/question/question-tool";

<QuestionTool
  part={{
    type: "tool-Question",
    toolCallId: "q-text",
    state: "input-streaming",
    input: {
      questions: [{
        kind: "text",
        title: "Describe what this app does in one sentence.",
        placeholder: "A productivity app for...",
      }],
      submitLabel: "Submit",
    },
  }}
/>`;

const multiStepCode = `import { QuestionTool } from "./components/question/question-tool";

<QuestionTool
  part={{
    type: "tool-Question",
    toolCallId: "q-multi-step",
    state: "input-streaming",
    input: {
      questions: multiStepQuestions,
      questionIndex: 1,
      totalQuestions: 2,
    },
  }}
/>`;

const questionProps: PropDef[] = [
  {
    name: "part",
    type: "QuestionToolPart",
    description:
      "AI SDK tool-call part with `input.questions: QuestionConfig[]`. Optional input fields: `questionIndex`, `totalQuestions`, `submitLabel`, `nextLabel`, `skipLabel`, `allowSkip`, `onPreviousQuestion`, `onNextQuestion`, `onSubmitAnswer`. After submission, `output.answer` is set.",
  },
  {
    name: "chatStatus",
    type: "string | undefined",
    description:
      "Forwarded chat status. Currently informational — the component derives 'completed' from accumulated answers.",
  },
];

export default function AgentQuestionToolDoc() {
  return (
    <DocPage
      title="Question Tool"
      slug="agent-question-tool"
      description="Clarifying-question UI an agent can use to ask the user a single-select, multi-select, or free-text question. Supports pagination, optional custom answers, and skipping."
    >
      <DocSection title="Single select">
        <ComponentPreview code={singleCode}>
          <div className="w-full max-w-xl">
            <QuestionTool part={singlePart} />
          </div>
        </ComponentPreview>
      </DocSection>

      <DocSection title="Multi select">
        <ComponentPreview code={multiCode}>
          <div className="w-full max-w-xl">
            <QuestionTool part={multiPart} />
          </div>
        </ComponentPreview>
      </DocSection>

      <DocSection title="Free text">
        <ComponentPreview code={textCode}>
          <div className="w-full max-w-xl">
            <QuestionTool part={textPart} />
          </div>
        </ComponentPreview>
      </DocSection>

      <DocSection title="Multi-step">
        <ComponentPreview code={multiStepCode}>
          <div className="w-full max-w-xl">
            <QuestionTool part={multiStepPart} />
          </div>
        </ComponentPreview>
      </DocSection>

      <DocSection title="API Reference">
        <PropsTable props={questionProps} />
      </DocSection>
    </DocPage>
  );
}
