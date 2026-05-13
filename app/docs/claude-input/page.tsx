"use client";

import { useState } from "react";
import {
  ClaudeInput,
  defaultClaudeModels,
  defaultPromptCategories,
  defaultPromptSuggestions,
  type ClaudeInputSubmitPayload,
} from "@/components/ai-components/claude-input";
import { ComponentPreview } from "@/lib/docs/ComponentPreview";
import { PropsTable, type PropDef } from "@/lib/docs/PropsTable";
import { DocPage, DocSection } from "@/lib/docs/DocPage";

const basicCode = `import { ClaudeInput } from "./components";

<ClaudeInput
  placeholder="How can I help you today?"
  onSubmit={(payload) => console.log(payload)}
/>`;

const modelsCode = `import {
  ClaudeInput,
  defaultClaudeModels,
} from "./components";

// Pick the first model id from the bundled defaults.
const initialModelId = defaultClaudeModels[0].id;

<ClaudeInput
  models={defaultClaudeModels}
  defaultModelId={initialModelId}
  onModelChange={(id, model) => console.log(id, model)}
/>`;

const suggestionsCode = `import {
  ClaudeInput,
  defaultPromptCategories,
  defaultPromptSuggestions,
} from "./components";

<ClaudeInput
  categories={defaultPromptCategories}
  suggestions={defaultPromptSuggestions}
  onCategorySelect={(category) => console.log(category)}
  onSuggestionSelect={(suggestion, category) =>
    console.log(suggestion, category)
  }
/>`;

const controlledCode = `import { ClaudeInput } from "./components";
import { useState } from "react";

function Example() {
  const [extended, setExtended] = useState(false);

  return (
    <ClaudeInput
      extendedThinking={extended}
      onExtendedThinkingChange={setExtended}
      defaultValue="Summarize this RFC into three bullets"
    />
  );
}`;

// Pick the first id from the bundled default list so the demo always
// renders with a valid model selected, regardless of registry order.
const firstModelId = defaultClaudeModels[0]?.id ?? "opus-46";

const claudeInputProps: PropDef[] = [
  {
    name: "defaultValue",
    type: "string",
    default: '""',
    description: "Initial textarea value when uncontrolled.",
  },
  {
    name: "placeholder",
    type: "string",
    default: '"How can I help you today?"',
    description: "Placeholder text shown in the prompt textarea.",
  },
  {
    name: "models",
    type: "ClaudeModelOption[]",
    default: "defaultClaudeModels",
    description:
      "Model list shown in the model picker. Each option has id, name, and description.",
  },
  {
    name: "defaultModelId",
    type: "string",
    default: '"opus-46"',
    description: "Uncontrolled id of the initially selected model.",
  },
  {
    name: "categories",
    type: "PromptCategory[]",
    default: "defaultPromptCategories",
    description: "Category chips shown above the input (Write, Learn, Code, etc.).",
  },
  {
    name: "suggestions",
    type: "Record<string, PromptSuggestion[]>",
    default: "defaultPromptSuggestions",
    description: "Prompt suggestion lists keyed by category id.",
  },
  {
    name: "defaultExtendedThinking",
    type: "boolean",
    default: "true",
    description: "Uncontrolled initial state for the extended thinking toggle.",
  },
  {
    name: "extendedThinking",
    type: "boolean",
    description: "Controlled extended thinking value. Pair with onExtendedThinkingChange.",
  },
  {
    name: "onSubmit",
    type: "(payload: ClaudeInputSubmitPayload) => void",
    description:
      "Fired when the user submits. Payload contains prompt, modelId, modelName, extendedThinking, and files.",
  },
  {
    name: "onModelChange",
    type: "(id: string, model: ClaudeModelOption) => void",
    description: "Fired when the user selects a model from the picker.",
  },
  {
    name: "onSuggestionSelect",
    type: "(suggestion, category) => void",
    description: "Fired when the user clicks a suggestion chip inside a category panel.",
  },
  {
    name: "onFilesSelected",
    type: "(files: File[]) => void",
    description: "Fired after the user picks files via the + control.",
  },
];

export default function ClaudeInputDoc() {
  // Controlled extended-thinking demo state.
  const [extended, setExtended] = useState(false);

  // Demo callbacks are no-ops — cast to `as any` where the type would
  // require a specific payload shape we do not need to model in the doc.
  const noop = () => {};

  return (
    <DocPage
      title="Claude Input"
      slug="claude-input"
      description="Composer-style prompt input with model picker, prompt categories, suggestions, attachments, and voice mode."
    >
      <DocSection title="Basic">
        <ComponentPreview code={basicCode}>
          <div className="w-full max-w-3xl">
            <ClaudeInput onSubmit={noop as any} />
          </div>
        </ComponentPreview>
      </DocSection>

      <DocSection title="With model picker">
        <ComponentPreview code={modelsCode}>
          <div className="w-full max-w-3xl">
            <ClaudeInput
              models={defaultClaudeModels}
              defaultModelId={firstModelId}
              onModelChange={noop as any}
            />
          </div>
        </ComponentPreview>
      </DocSection>

      <DocSection title="With prompt suggestions">
        <ComponentPreview code={suggestionsCode}>
          <div className="w-full max-w-3xl">
            <ClaudeInput
              categories={defaultPromptCategories}
              suggestions={defaultPromptSuggestions}
              onCategorySelect={noop as any}
              onSuggestionSelect={noop as any}
            />
          </div>
        </ComponentPreview>
      </DocSection>

      <DocSection title="Controlled extended thinking">
        <ComponentPreview code={controlledCode}>
          <div className="w-full max-w-3xl">
            <ClaudeInput
              defaultValue="Summarize this RFC into three bullets"
              extendedThinking={extended}
              onExtendedThinkingChange={setExtended}
            />
          </div>
        </ComponentPreview>
      </DocSection>

      <DocSection title="API Reference">
        <PropsTable props={claudeInputProps} />
      </DocSection>
    </DocPage>
  );
}
