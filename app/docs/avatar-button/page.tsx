"use client";

import { AvatarButton } from "@/registry/default/avatar-button";
import { ComponentPreview } from "@/lib/docs/ComponentPreview";
import { PropsTable, type PropDef } from "@/lib/docs/PropsTable";
import { DocPage, DocSection } from "@/lib/docs/DocPage";

const LUKE_URL =
  "https://images.unsplash.com/photo-1628157588553-5eeea00af15c?w=128&h=128&dpr=2&q=80";

const defaultCode = `import { AvatarButton } from "./components";

<AvatarButton
  avatarName="Luke Tracy"
  avatarUrl="${LUKE_URL}"
>
  @georgelucas
</AvatarButton>`;

const noImageCode = `import { AvatarButton } from "./components";

<AvatarButton avatarName="Sarah Johnson">@sarahj</AvatarButton>
<AvatarButton avatarName="Marcus Williams">@marcusw</AvatarButton>`;

const sizesCode = `import { AvatarButton } from "./components";

<AvatarButton size="sm" avatarName="Luke Tracy" avatarUrl="...">
  @georgelucas
</AvatarButton>
<AvatarButton size="md" avatarName="Luke Tracy" avatarUrl="...">
  @georgelucas
</AvatarButton>
<AvatarButton size="lg" avatarName="Luke Tracy" avatarUrl="...">
  @georgelucas
</AvatarButton>`;

const avatarButtonProps: PropDef[] = [
  {
    name: "avatarUrl",
    type: "string",
    description: "Image URL for the leading avatar. Omit to show initials.",
  },
  {
    name: "avatarName",
    type: "string",
    description:
      "Required. Used as the avatar's alt text and as the source for fallback initials.",
  },
  {
    name: "avatarInitials",
    type: "string",
    description:
      "Explicit initials. Defaults to first/last initial pulled from `avatarName`.",
  },
  {
    name: "avatarSize",
    type: "number",
    default: "24",
    description: "Avatar pixel size. The button keeps the same rounded-full shape regardless.",
  },
  {
    name: "variant",
    type: '"primary" | "secondary" | "tertiary" | "ghost"',
    default: '"secondary"',
    description: "Inherits the FF Button variant system.",
  },
  {
    name: "size",
    type: '"sm" | "md" | "lg"',
    default: '"sm"',
    description: "Button height. The avatar size stays constant unless overridden.",
  },
  {
    name: "children",
    type: "ReactNode",
    description: "Label rendered to the right of the avatar — typically a name or handle.",
  },
];

export default function AvatarButtonDoc() {
  return (
    <DocPage
      title="Avatar button"
      slug="avatar-button"
      description="Pill-shaped button with a leading circular avatar. Pairs naturally with mentions, attribution rows, and assignee selectors."
    >
      <DocSection title="Default">
        <ComponentPreview code={defaultCode}>
          <AvatarButton avatarName="Luke Tracy" avatarUrl={LUKE_URL}>
            @georgelucas
          </AvatarButton>
        </ComponentPreview>
      </DocSection>

      <DocSection title="Without image">
        <ComponentPreview code={noImageCode}>
          <div className="flex flex-wrap items-center gap-3">
            <AvatarButton avatarName="Sarah Johnson">@sarahj</AvatarButton>
            <AvatarButton avatarName="Marcus Williams">@marcusw</AvatarButton>
          </div>
        </ComponentPreview>
      </DocSection>

      <DocSection title="Sizes">
        <ComponentPreview code={sizesCode}>
          <div className="flex flex-wrap items-center gap-3">
            <AvatarButton
              size="sm"
              avatarName="Luke Tracy"
              avatarUrl={LUKE_URL}
            >
              @georgelucas
            </AvatarButton>
            <AvatarButton
              size="md"
              avatarName="Luke Tracy"
              avatarUrl={LUKE_URL}
            >
              @georgelucas
            </AvatarButton>
            <AvatarButton
              size="lg"
              avatarName="Luke Tracy"
              avatarUrl={LUKE_URL}
            >
              @georgelucas
            </AvatarButton>
          </div>
        </ComponentPreview>
      </DocSection>

      <DocSection title="API Reference">
        <PropsTable props={avatarButtonProps} />
      </DocSection>
    </DocPage>
  );
}
