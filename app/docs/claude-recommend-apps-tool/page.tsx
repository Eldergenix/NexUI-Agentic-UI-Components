"use client";

import {
  ALL_CLAUDE_RECOMMEND_APP_IDS,
  ClaudeRecommendClaudeAppsTool,
  type ClaudeRecommendAppId,
} from "@/components/ai-components/claude-recommend-claude-apps-tool";
import { ComponentPreview } from "@/lib/docs/ComponentPreview";
import { PropsTable, type PropDef } from "@/lib/docs/PropsTable";
import { DocPage, DocSection } from "@/lib/docs/DocPage";

const defaultCode = `import { ClaudeRecommendClaudeAppsTool } from "./components/claude-recommend-claude-apps-tool";

// Defaults to ["desktop", "ios", "claude_code_terminal"] with maxVisible={3}.
<ClaudeRecommendClaudeAppsTool />`;

const subsetCode = `import { ClaudeRecommendClaudeAppsTool } from "./components/claude-recommend-claude-apps-tool";

<ClaudeRecommendClaudeAppsTool
  appIds={["claude_code_terminal", "claude_code_vscode", "claude_code_jetbrains"]}
  maxVisible={3}
/>`;

const allCode = `import {
  ALL_CLAUDE_RECOMMEND_APP_IDS,
  ClaudeRecommendClaudeAppsTool,
} from "./components/claude-recommend-claude-apps-tool";

<ClaudeRecommendClaudeAppsTool
  appIds={ALL_CLAUDE_RECOMMEND_APP_IDS}
  maxVisible={ALL_CLAUDE_RECOMMEND_APP_IDS.length}
/>`;

const recommendProps: PropDef[] = [
  {
    name: "appIds",
    type: "ClaudeRecommendAppId[]",
    default: '["desktop", "ios", "claude_code_terminal"]',
    description:
      "Ordered list of app identifiers to render. Unknown ids are dropped silently.",
  },
  {
    name: "maxVisible",
    type: "number",
    default: "3",
    description:
      "Caps the number of rows rendered. Mirrors the small payloads Claude tools usually return.",
  },
  {
    name: "className",
    type: "string",
    description: "Class names merged onto the outer wrapper.",
  },
];

const appIdProps: PropDef[] = [
  {
    name: "ClaudeRecommendAppId",
    type: '"desktop" | "ios" | "android" | "claude_code_terminal" | "claude_code_vscode" | "claude_code_jetbrains" | "claude_code_slack" | "excel" | "powerpoint" | "chrome"',
    description:
      "Union of supported app identifiers. The exported ALL_CLAUDE_RECOMMEND_APP_IDS constant contains every value in the catalog order.",
  },
];

export default function ClaudeRecommendAppsToolDoc() {
  return (
    <DocPage
      title="Claude Recommend Apps Tool"
      slug="claude-recommend-apps-tool"
      description="Recommendation card with download or install actions for the Claude apps ecosystem — desktop, mobile, Claude Code surfaces, and Office integrations. Driven by a string list of app ids."
    >
      <DocSection title="Default selection">
        <ComponentPreview code={defaultCode}>
          <div className="w-full max-w-xl">
            <ClaudeRecommendClaudeAppsTool />
          </div>
        </ComponentPreview>
      </DocSection>

      <DocSection title="Claude Code surfaces">
        <ComponentPreview code={subsetCode}>
          <div className="w-full max-w-xl">
            <ClaudeRecommendClaudeAppsTool
              appIds={
                [
                  "claude_code_terminal",
                  "claude_code_vscode",
                  "claude_code_jetbrains",
                ] as ClaudeRecommendAppId[]
              }
              maxVisible={3}
            />
          </div>
        </ComponentPreview>
      </DocSection>

      <DocSection title="All apps">
        <ComponentPreview code={allCode}>
          <div className="w-full max-w-xl">
            <ClaudeRecommendClaudeAppsTool
              appIds={ALL_CLAUDE_RECOMMEND_APP_IDS}
              maxVisible={ALL_CLAUDE_RECOMMEND_APP_IDS.length}
            />
          </div>
        </ComponentPreview>
      </DocSection>

      <DocSection title="API Reference">
        <PropsTable props={recommendProps} />
      </DocSection>

      <DocSection title="ClaudeRecommendAppId">
        <PropsTable props={appIdProps} />
      </DocSection>
    </DocPage>
  );
}
