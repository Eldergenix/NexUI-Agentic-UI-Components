"use client";

import { SearchGroupRich } from "@/registry/default/agent-ui/components/tools/search-tool";
import { ComponentPreview } from "@/lib/docs/ComponentPreview";
import { PropsTable, type PropDef } from "@/lib/docs/PropsTable";
import { DocPage, DocSection } from "@/lib/docs/DocPage";

const searchSteps: any[] = [
  {
    id: "search-1",
    type: "tool-call",
    toolName: "WebSearch",
    toolDetail: "Next.js 15 release notes",
    duration: 2,
    toolVariant: "search",
    searchQuery: "Next.js 15 release notes",
    searchSource: "google",
  },
  {
    id: "search-2",
    type: "tool-call",
    toolName: "WebSearch",
    toolDetail: "App Router streaming patterns",
    duration: 2,
    toolVariant: "search",
    searchQuery: "App Router streaming patterns",
    searchSource: "google",
  },
];

const sampleResults = [
  {
    source: "google" as const,
    title: "Next.js 15 release notes",
    date: "2024-09-15",
  },
  {
    source: "github" as const,
    title: "vercel/next.js — App Router examples",
    date: "2024-08-22",
  },
  {
    source: "stackoverflow" as const,
    title: "Streaming server components: best practices",
    date: "2024-07-09",
  },
];

const animatingStepStates: Record<string, "pending" | "animating" | "complete"> =
  {
    "search-1": "animating",
    "search-2": "animating",
  };

const completeStepStates: Record<string, "pending" | "animating" | "complete"> =
  {
    "search-1": "complete",
    "search-2": "complete",
  };

const collapsedCode = `import { SearchGroupRich } from "./components/tools/search-tool";

const toolSteps = [
  {
    id: "search-1",
    type: "tool-call",
    toolName: "WebSearch",
    toolDetail: "Next.js 15 release notes",
    duration: 2,
    searchQuery: "Next.js 15 release notes",
  },
  {
    id: "search-2",
    type: "tool-call",
    toolName: "WebSearch",
    toolDetail: "App Router streaming patterns",
    duration: 2,
    searchQuery: "App Router streaming patterns",
  },
];

const results = [
  { source: "google", title: "Next.js 15 release notes", date: "2024-09-15" },
  { source: "github", title: "vercel/next.js — App Router examples", date: "2024-08-22" },
  { source: "stackoverflow", title: "Streaming server components: best practices", date: "2024-07-09" },
];

<SearchGroupRich
  toolSteps={toolSteps}
  stepStates={{ "search-1": "complete", "search-2": "complete" }}
  onStepComplete={() => {}}
  results={results}
/>`;

const expandedCode = `import { SearchGroupRich } from "./components/tools/search-tool";

<SearchGroupRich
  toolSteps={toolSteps}
  stepStates={{ "search-1": "complete", "search-2": "complete" }}
  onStepComplete={() => {}}
  results={results}
  defaultOpen
/>`;

const animatingCode = `import { SearchGroupRich } from "./components/tools/search-tool";

<SearchGroupRich
  toolSteps={toolSteps}
  stepStates={{ "search-1": "animating", "search-2": "animating" }}
  onStepComplete={() => {}}
  results={[]}
/>`;

const searchProps: PropDef[] = [
  {
    name: "toolSteps",
    type: "(TimelineStep & { type: 'tool-call' })[]",
    description:
      "One or more search tool-call steps. The first non-empty `searchQuery` is used in the panel header.",
  },
  {
    name: "stepStates",
    type: "Record<string, 'pending' | 'animating' | 'complete'>",
    description:
      "State per step keyed by `step.id`. If any step is `animating`, the row shimmers as 'Searching...'.",
  },
  {
    name: "onStepComplete",
    type: "(id: string) => void",
    description:
      "Called for each step after its `duration` elapses while animating.",
  },
  {
    name: "results",
    type: "{ source: SourceType; title: string; date: string }[] | undefined",
    description:
      "Aggregate result list shown in the expandable panel. The expand affordance only appears once at least one result is present.",
  },
  {
    name: "defaultOpen",
    type: "boolean | undefined",
    description: "Start with the results panel expanded.",
  },
];

export default function AgentSearchToolDoc() {
  return (
    <DocPage
      title="Search Tool"
      slug="agent-search-tool"
      description="Aggregates one or more search tool calls into a single expandable row with a unified result list. Designed for fan-out queries where the user only cares about the final hits."
    >
      <DocSection title="Collapsed">
        <ComponentPreview code={collapsedCode}>
          <div className="w-full max-w-xl">
            <SearchGroupRich
              toolSteps={searchSteps}
              stepStates={completeStepStates}
              onStepComplete={() => {}}
              results={sampleResults}
            />
          </div>
        </ComponentPreview>
      </DocSection>

      <DocSection title="Expanded">
        <ComponentPreview code={expandedCode}>
          <div className="w-full max-w-xl">
            <SearchGroupRich
              toolSteps={searchSteps}
              stepStates={completeStepStates}
              onStepComplete={() => {}}
              results={sampleResults}
              defaultOpen
            />
          </div>
        </ComponentPreview>
      </DocSection>

      <DocSection title="Animating">
        <ComponentPreview code={animatingCode}>
          <div className="w-full max-w-xl">
            <SearchGroupRich
              toolSteps={searchSteps}
              stepStates={animatingStepStates}
              onStepComplete={() => {}}
              results={[]}
            />
          </div>
        </ComponentPreview>
      </DocSection>

      <DocSection title="API Reference">
        <PropsTable props={searchProps} />
      </DocSection>
    </DocPage>
  );
}
