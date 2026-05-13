"use client";

import { CursorQuestionsPanel } from "@/components/ai-components/cursor-questions-panel";
import { ComponentPreview } from "@/lib/docs/ComponentPreview";
import { PropsTable, type PropDef } from "@/lib/docs/PropsTable";
import { DocPage, DocSection } from "@/lib/docs/DocPage";

const basicCode = `import { CursorQuestionsPanel } from "./components";

<CursorQuestionsPanel
  questions={[
    {
      id: "stack",
      question: "Which stack should we use?",
      options: [
        { id: "next",   label: "Next.js App Router" },
        { id: "remix",  label: "Remix" },
        { id: "astro",  label: "Astro" },
        { id: "other",  label: "Other", isOther: true },
      ],
    },
    {
      id: "auth",
      question: "How should users sign in?",
      options: [
        { id: "magic",  label: "Magic link" },
        { id: "oauth",  label: "OAuth (Google, GitHub)" },
        { id: "pass",   label: "Email + password" },
      ],
    },
  ]}
  onSubmit={(answers) => console.log(answers)}
  onSkip={() => console.log("skipped")}
/>`;

const multiSelectCode = `import { CursorQuestionsPanel } from "./components";

<CursorQuestionsPanel
  questions={[
    {
      id: "features",
      multiSelect: true,
      question: "Which features do you need?",
      options: [
        { id: "rt",   label: "Realtime sync" },
        { id: "ai",   label: "AI suggestions" },
        { id: "team", label: "Team workspaces" },
        { id: "api",  label: "Public API" },
      ],
    },
  ]}
/>`;

// Cast question data with `as any` to avoid coupling the doc to the
// component's private `Question` / `Option` types (they are not exported).
const sampleQuestions = [
  {
    id: "stack",
    question: "Which stack should we use?",
    options: [
      { id: "next", label: "Next.js App Router" },
      { id: "remix", label: "Remix" },
      { id: "astro", label: "Astro" },
      { id: "other", label: "Other", isOther: true },
    ],
  },
  {
    id: "auth",
    question: "How should users sign in?",
    options: [
      { id: "magic", label: "Magic link" },
      { id: "oauth", label: "OAuth (Google, GitHub)" },
      { id: "pass", label: "Email + password" },
    ],
  },
  {
    id: "deploy",
    question: "Where should we deploy?",
    options: [
      { id: "vercel", label: "Vercel" },
      { id: "fly", label: "Fly.io" },
      { id: "self", label: "Self-host" },
    ],
  },
] as any;

const multiSelectQuestions = [
  {
    id: "features",
    multiSelect: true,
    question: "Which features do you need?",
    options: [
      { id: "rt", label: "Realtime sync" },
      { id: "ai", label: "AI suggestions" },
      { id: "team", label: "Team workspaces" },
      { id: "api", label: "Public API" },
    ],
  },
] as any;

const questionsPanelProps: PropDef[] = [
  {
    name: "questions",
    type: "Question[]",
    description:
      "Question list. Each question has id, question text, options[], and optional multiSelect flag.",
  },
  {
    name: "onSubmit",
    type: "(answers: Record<string, string | string[]>) => void",
    description:
      "Fired when the user presses Continue or Enter. Single-select answers are strings; multiSelect answers are string arrays.",
  },
  {
    name: "onSkip",
    type: "() => void",
    description: "Fired when the user clicks Skip or presses Escape.",
  },
  {
    name: "defaultOpen",
    type: "boolean",
    default: "true",
    description: "Initial open state when the panel is uncontrolled.",
  },
  {
    name: "open",
    type: "boolean",
    description: "Controlled open state. Pair with onOpenChange.",
  },
  {
    name: "onOpenChange",
    type: "(open: boolean) => void",
    description: "Fired when the panel toggles open or closed.",
  },
];

export default function CursorQuestionsPanelDoc() {
  // Demo callbacks are no-ops.
  const noop = () => {};

  return (
    <DocPage
      title="Cursor Questions Panel"
      slug="cursor-questions-panel"
      description="Collapsible question-and-answer panel for clarifying agent intent. Supports single- and multi-select, an Other free-text option, and keyboard navigation."
    >
      <DocSection title="Basic">
        <ComponentPreview code={basicCode}>
          <CursorQuestionsPanel
            questions={sampleQuestions}
            onSubmit={noop as any}
            onSkip={noop}
          />
        </ComponentPreview>
      </DocSection>

      <DocSection title="Multi-select">
        <ComponentPreview code={multiSelectCode}>
          <CursorQuestionsPanel
            questions={multiSelectQuestions}
            onSubmit={noop as any}
          />
        </ComponentPreview>
      </DocSection>

      <DocSection title="API Reference">
        <PropsTable props={questionsPanelProps} />
      </DocSection>
    </DocPage>
  );
}
