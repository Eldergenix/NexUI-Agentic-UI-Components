"use client";

import { Markdown } from "@/registry/default/agent-ui/components/markdown";
import { ComponentPreview } from "@/lib/docs/ComponentPreview";
import { PropsTable, type PropDef } from "@/lib/docs/PropsTable";
import { DocPage, DocSection } from "@/lib/docs/DocPage";

const basicCode = `import { Markdown } from "./components";

<Markdown content={\`# Hello

This is a **markdown** paragraph with _inline emphasis_ and \\\`inline code\\\`.

## Subheading

Another paragraph for context.\`} />`;

const basicContent = `# Hello

This is a **markdown** paragraph with _inline emphasis_ and \`inline code\`.

## Subheading

Another paragraph for context.`;

const codeBlocksCode = `import { Markdown } from "./components";

<Markdown content={\`Here is a TypeScript snippet:

\\\`\\\`\\\`ts
function greet(name: string): string {
  return \\\`Hello, \\\${name}!\\\`;
}

console.log(greet("world"));
\\\`\\\`\\\`

And a shell command:

\\\`\\\`\\\`bash
npm install streamdown
\\\`\\\`\\\`\`} />`;

const codeBlocksContent = `Here is a TypeScript snippet:

\`\`\`ts
function greet(name: string): string {
  return \`Hello, \${name}!\`;
}

console.log(greet("world"));
\`\`\`

And a shell command:

\`\`\`bash
npm install streamdown
\`\`\``;

const listsCode = `import { Markdown } from "./components";

<Markdown content={\`Unordered list:

- First item
- Second item
- Third item with \\\`inline code\\\`

Ordered list:

1. Plan the work
2. Write the code
3. Ship it\`} />`;

const listsContent = `Unordered list:

- First item
- Second item
- Third item with \`inline code\`

Ordered list:

1. Plan the work
2. Write the code
3. Ship it`;

const markdownProps: PropDef[] = [
  {
    name: "content",
    type: "string",
    description:
      "Required. The markdown source to render. Code fences with unknown languages are normalized to plain text.",
  },
  {
    name: "className",
    type: "string",
    description: "Additional class names to merge with the outer wrapper.",
  },
  {
    name: "textContrast",
    type: '"normal" | "high"',
    description: "Reserved for future use to adjust text contrast.",
  },
];

export default function MarkdownDoc() {
  return (
    <DocPage
      title="Markdown"
      slug="agent-markdown"
      description="Streaming-friendly markdown renderer for agent responses. Built on Streamdown with syntax highlighting and styled defaults."
    >
      <DocSection title="Basic">
        <ComponentPreview code={basicCode}>
          <div className="w-full max-w-2xl">
            <Markdown content={basicContent} />
          </div>
        </ComponentPreview>
      </DocSection>

      <DocSection title="Code blocks">
        <ComponentPreview code={codeBlocksCode}>
          <div className="w-full max-w-2xl">
            <Markdown content={codeBlocksContent} />
          </div>
        </ComponentPreview>
      </DocSection>

      <DocSection title="Lists">
        <ComponentPreview code={listsCode}>
          <div className="w-full max-w-2xl">
            <Markdown content={listsContent} />
          </div>
        </ComponentPreview>
      </DocSection>

      <DocSection title="API Reference">
        <PropsTable props={markdownProps} />
      </DocSection>
    </DocPage>
  );
}
