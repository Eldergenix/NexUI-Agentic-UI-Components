"use client";

import { TodoTool } from "@/registry/default/agent-ui/components/tools/todo-tool";
import { ComponentPreview } from "@/lib/docs/ComponentPreview";
import { PropsTable, type PropDef } from "@/lib/docs/PropsTable";
import { DocPage, DocSection } from "@/lib/docs/DocPage";

const mixedPart: any = {
  type: "tool-todo",
  toolCallId: "todo-1",
  state: "output-available",
  input: {
    todos: [
      { content: "Set up project", status: "completed" },
      {
        content: "Add tests",
        status: "in_progress",
        activeForm: "Adding tests",
      },
      { content: "Deploy", status: "pending" },
    ],
  },
};

const allCompletePart: any = {
  type: "tool-todo",
  toolCallId: "todo-2",
  state: "output-available",
  input: {
    todos: [
      { content: "Scaffold routes", status: "completed" },
      { content: "Wire up auth", status: "completed" },
      { content: "Ship to staging", status: "completed" },
    ],
  },
};

const streamingPart: any = {
  type: "tool-todo",
  toolCallId: "todo-3",
  state: "input-streaming",
  input: { todos: [] },
};

const mixedCode = `import { TodoTool } from "./components/tools/todo-tool";

const part = {
  type: "tool-todo",
  toolCallId: "todo-1",
  state: "output-available",
  input: {
    todos: [
      { content: "Set up project", status: "completed" },
      {
        content: "Add tests",
        status: "in_progress",
        activeForm: "Adding tests",
      },
      { content: "Deploy", status: "pending" },
    ],
  },
};

<TodoTool part={part} />`;

const allCompleteCode = `import { TodoTool } from "./components/tools/todo-tool";

const part = {
  type: "tool-todo",
  toolCallId: "todo-2",
  state: "output-available",
  input: {
    todos: [
      { content: "Scaffold routes", status: "completed" },
      { content: "Wire up auth", status: "completed" },
      { content: "Ship to staging", status: "completed" },
    ],
  },
};

<TodoTool part={part} />`;

const streamingCode = `import { TodoTool } from "./components/tools/todo-tool";

const part = {
  type: "tool-todo",
  toolCallId: "todo-3",
  state: "input-streaming",
  input: { todos: [] },
};

<TodoTool part={part} />`;

const todoProps: PropDef[] = [
  {
    name: "part",
    type: "any",
    description:
      "Tool invocation part. Reads `input.todos` (or `output.newTodos`) as `{ content, status, activeForm? }[]`. `state: 'input-streaming'` or an empty list renders a shimmer placeholder.",
  },
  {
    name: "chatStatus",
    type: "string | undefined",
    description:
      "Parent chat status (`'streaming' | 'submitted' | 'ready' | ...`). Used to determine whether the in-progress todo should pulse.",
  },
];

export default function AgentTodoToolDoc() {
  return (
    <DocPage
      title="Todo Tool"
      slug="agent-todo-tool"
      description="Inline task list rendered when an agent emits a TodoWrite-style tool call. Shows pending, in-progress, and completed items with the proper status icon for each."
    >
      <DocSection title="Mixed states">
        <ComponentPreview code={mixedCode}>
          <div className="w-full max-w-md">
            <TodoTool part={mixedPart} />
          </div>
        </ComponentPreview>
      </DocSection>

      <DocSection title="All complete">
        <ComponentPreview code={allCompleteCode}>
          <div className="w-full max-w-md">
            <TodoTool part={allCompletePart} />
          </div>
        </ComponentPreview>
      </DocSection>

      <DocSection title="Streaming">
        <ComponentPreview code={streamingCode}>
          <div className="w-full max-w-md">
            <TodoTool part={streamingPart} />
          </div>
        </ComponentPreview>
      </DocSection>

      <DocSection title="API Reference">
        <PropsTable props={todoProps} />
      </DocSection>
    </DocPage>
  );
}
