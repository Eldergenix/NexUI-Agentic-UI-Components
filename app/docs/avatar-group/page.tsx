"use client";

import { AvatarGroup } from "@/registry/default/avatar-group";
import { ComponentPreview } from "@/lib/docs/ComponentPreview";
import { PropsTable, type PropDef } from "@/lib/docs/PropsTable";
import { DocPage, DocSection } from "@/lib/docs/DocPage";

const users = [
  {
    id: "1",
    name: "Alex Chen",
    imageUrl:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=72&h=72&dpr=2&q=80",
  },
  {
    id: "2",
    name: "Sarah Johnson",
    imageUrl:
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=72&h=72&dpr=2&q=80",
  },
  {
    id: "3",
    name: "Marcus Williams",
    imageUrl:
      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=72&h=72&dpr=2&q=80",
  },
  {
    id: "4",
    name: "Emma Davis",
    imageUrl:
      "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=72&h=72&dpr=2&q=80",
  },
  {
    id: "5",
    name: "James Miller",
    imageUrl:
      "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=72&h=72&dpr=2&q=80",
  },
];

const defaultCode = `import { AvatarGroup } from "./components";

const users = [
  { id: "1", name: "Alex Chen", imageUrl: "..." },
  { id: "2", name: "Sarah Johnson", imageUrl: "..." },
  { id: "3", name: "Marcus Williams", imageUrl: "..." },
  { id: "4", name: "Emma Davis", imageUrl: "..." },
  { id: "5", name: "James Miller", imageUrl: "..." },
];

<AvatarGroup users={users} />`;

const overflowCode = `import { AvatarGroup } from "./components";

<AvatarGroup users={users} max={3} />
// renders 3 avatars + a "+2" overflow pill`;

const sizesCode = `import { AvatarGroup } from "./components";

<AvatarGroup users={users} size={20} max={3} />
<AvatarGroup users={users} size={28} max={3} />
<AvatarGroup users={users} size={36} max={3} />`;

const avatarGroupProps: PropDef[] = [
  {
    name: "users",
    type: "AvatarGroupUser[]",
    description:
      "List of users to render. Each item supports `id`, `name`, optional `imageUrl`, and optional `initials`.",
  },
  {
    name: "size",
    type: "number",
    default: "24",
    description: "Pixel size of each avatar (width = height).",
  },
  {
    name: "max",
    type: "number",
    default: "4",
    description:
      "Maximum avatars to render before collapsing the remainder into a “+N” pill.",
  },
  {
    name: "ringWidth",
    type: "number",
    default: "2",
    description:
      "Ring thickness in pixels. The ring color is `var(--background)` so the stack reads cleanly on either theme.",
  },
];

export default function AvatarGroupDoc() {
  return (
    <DocPage
      title="Avatar group"
      slug="avatar-group"
      description="Stacked overlapping avatars with theme-aware ring separators and a “+N” overflow pill."
    >
      <DocSection title="Default">
        <ComponentPreview code={defaultCode}>
          <AvatarGroup users={users} />
        </ComponentPreview>
      </DocSection>

      <DocSection title="Overflow">
        <ComponentPreview code={overflowCode}>
          <AvatarGroup users={users} max={3} />
        </ComponentPreview>
      </DocSection>

      <DocSection title="Sizes">
        <ComponentPreview code={sizesCode}>
          <div className="flex flex-col items-start gap-4">
            <AvatarGroup users={users} size={20} max={3} />
            <AvatarGroup users={users} size={28} max={3} />
            <AvatarGroup users={users} size={36} max={3} />
          </div>
        </ComponentPreview>
      </DocSection>

      <DocSection title="API Reference">
        <PropsTable props={avatarGroupProps} />
      </DocSection>
    </DocPage>
  );
}
