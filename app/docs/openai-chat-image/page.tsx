"use client";

import {
  type OpenAIChatAttachment,
  OpenAIChatImage,
  type OpenAIChatIdea,
} from "@/components/ai-components/openai-chat-image";
import { ComponentPreview } from "@/lib/docs/ComponentPreview";
import { PropsTable, type PropDef } from "@/lib/docs/PropsTable";
import { DocPage, DocSection } from "@/lib/docs/DocPage";

const sampleIdeas: OpenAIChatIdea[] = [
  {
    label: "Studio headshot",
    image:
      "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=600&q=70",
    prompt:
      "Render a clean studio headshot of the uploaded subject with soft key light, neutral backdrop, and natural skin tones.",
  },
  {
    label: "Blueprint poster",
    image:
      "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=600&q=70",
    prompt:
      "Create a blueprint poster of the subject in white technical line art on a deep cobalt grid.",
  },
  {
    label: "Anime",
    image:
      "https://images.unsplash.com/photo-1578632767115-351597cf2477?w=600&q=70",
    prompt:
      "Reimagine the subject as a trending anime illustration with confident linework and minimal cel shading.",
  },
  {
    label: "Comic strip",
    image:
      "https://images.unsplash.com/photo-1612831455540-4cf0e93f1c46?w=600&q=70",
    prompt:
      "Turn the photo into a Sunday-funnies comic strip with thick outlines, halftone, and a one-line punchline.",
  },
];

const sampleAttachments: OpenAIChatAttachment[] = [
  {
    image:
      "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=600&q=70",
    alt: "Portrait reference",
  },
  {
    image:
      "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=600&q=70",
    alt: "Architectural reference",
  },
  {
    image:
      "https://images.unsplash.com/photo-1578632767115-351597cf2477?w=600&q=70",
    alt: "Lifestyle reference",
  },
];

const imageModeCode = `import { OpenAIChatImage } from "./components/openai-chat-image";

<OpenAIChatImage
  defaultImageMode
  ideas={ideas}
  attachments={attachments}
  onSubmit={(prompt, files) => console.log({ prompt, files })}
  onIdeaClick={(idea) => console.log("Idea:", idea.label)}
  onAttachmentClick={(attachment) => console.log("Attachment:", attachment.alt)}
/>`;

const askAnythingCode = `import { OpenAIChatImage } from "./components/openai-chat-image";

// Start in plain chat mode — switch to image mode via the "Create an image" chip.
<OpenAIChatImage
  defaultImageMode={false}
  initialPrompt=""
  onSubmit={(prompt) => console.log(prompt)}
/>`;

const ideaTypeProps: PropDef[] = [
  {
    name: "label",
    type: "string",
    description: "Tile caption displayed on the idea card.",
  },
  {
    name: "image",
    type: "string",
    description: "Preview image URL for the idea tile.",
  },
  {
    name: "prompt",
    type: "string",
    description: "Prompt text inserted into the composer when the idea is picked.",
  },
];

const attachmentTypeProps: PropDef[] = [
  {
    name: "image",
    type: "string",
    description: "Source URL for the attachable photo.",
  },
  {
    name: "alt",
    type: "string",
    description: "Optional alt text used for accessibility and labels.",
  },
];

const chatImageProps: PropDef[] = [
  {
    name: "initialPrompt",
    type: "string",
    default: '""',
    description: "Seed text for the composer textarea on mount.",
  },
  {
    name: "defaultImageMode",
    type: "boolean",
    default: "true",
    description:
      'When true, the composer starts in "Image" mode with the idea gallery visible.',
  },
  {
    name: "ideas",
    type: "OpenAIChatIdea[]",
    default: "built-in ideas list",
    description:
      'Cards shown in the "Explore ideas" carousel. Selecting one populates the prompt and advances to the attach step.',
  },
  {
    name: "attachments",
    type: "OpenAIChatAttachment[]",
    default: "built-in attachment list",
    description:
      'Photos shown after an idea is picked, in the "Attach a photo" stage.',
  },
  {
    name: "onSubmit",
    type: "(prompt: string, files: File[]) => void",
    description: "Called when the user presses send or hits Enter.",
  },
  {
    name: "onIdeaClick",
    type: "(idea: OpenAIChatIdea) => void",
    description: "Fired when an idea card is selected from the carousel.",
  },
  {
    name: "onAttachmentClick",
    type: "(attachment: OpenAIChatAttachment) => void",
    description: "Fired when a curated attachment is selected.",
  },
];

export default function OpenAIChatImageDoc() {
  return (
    <DocPage
      title="OpenAI Chat Image"
      slug="openai-chat-image"
      description="OpenAI-style image composer with a two-mode prompt bar, an idea carousel, and a curated attachment row. Supports file drop, attachment thumbnails, and a stop/send button that adapts to the active mode."
    >
      <DocSection title="Image mode (default)">
        <ComponentPreview code={imageModeCode}>
          <div className="w-full max-w-2xl">
            <OpenAIChatImage
              defaultImageMode
              ideas={sampleIdeas}
              attachments={sampleAttachments}
              onSubmit={() => {}}
              onIdeaClick={() => {}}
              onAttachmentClick={() => {}}
            />
          </div>
        </ComponentPreview>
      </DocSection>

      <DocSection title="Ask anything">
        <ComponentPreview code={askAnythingCode}>
          <div className="w-full max-w-2xl">
            <OpenAIChatImage
              defaultImageMode={false}
              initialPrompt=""
              onSubmit={() => {}}
            />
          </div>
        </ComponentPreview>
      </DocSection>

      <DocSection title="API Reference">
        <PropsTable props={chatImageProps} />
      </DocSection>

      <DocSection title="OpenAIChatIdea">
        <PropsTable props={ideaTypeProps} />
      </DocSection>

      <DocSection title="OpenAIChatAttachment">
        <PropsTable props={attachmentTypeProps} />
      </DocSection>
    </DocPage>
  );
}
