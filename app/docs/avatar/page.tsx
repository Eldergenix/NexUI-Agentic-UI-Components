"use client";

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/registry/default/avatar";
import { ComponentPreview } from "@/lib/docs/ComponentPreview";
import { PropsTable, type PropDef } from "@/lib/docs/PropsTable";
import { DocPage, DocSection } from "@/lib/docs/DocPage";

const PHOTO_URL =
  "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=128&h=128&fit=crop&crop=faces";

const imageCode = `import { Avatar, AvatarImage, AvatarFallback } from "./components";

<Avatar>
  <AvatarImage src="${PHOTO_URL}" alt="Sarah" />
  <AvatarFallback>SJ</AvatarFallback>
</Avatar>`;

const fallbackCode = `import { Avatar, AvatarFallback } from "./components";

<Avatar>
  <AvatarFallback>SJ</AvatarFallback>
</Avatar>`;

const sizesCode = `import { Avatar, AvatarImage, AvatarFallback } from "./components";

<Avatar className="size-6">
  <AvatarImage src={photo} alt="Sarah" />
  <AvatarFallback>SJ</AvatarFallback>
</Avatar>
<Avatar className="size-8">…</Avatar>
<Avatar className="size-10">…</Avatar>
<Avatar className="size-12">…</Avatar>`;

const avatarProps: PropDef[] = [
  {
    name: "className",
    type: "string",
    description:
      "Extend the root. Override size with `size-6`/`size-8`/`size-10`/`size-12`.",
  },
];

const avatarImageProps: PropDef[] = [
  {
    name: "src",
    type: "string",
    description: "Image URL. Renders the fallback while loading or on error.",
  },
  {
    name: "alt",
    type: "string",
    description: "Accessible alt text for the avatar image.",
  },
];

const avatarFallbackProps: PropDef[] = [
  {
    name: "children",
    type: "ReactNode",
    description:
      "Content shown when the image is missing or fails to load. Typically 1–2 initials.",
  },
  {
    name: "delayMs",
    type: "number",
    description:
      "Optional delay before the fallback shows (avoids flash on fast loads). Inherited from Radix.",
  },
];

export default function AvatarDoc() {
  return (
    <DocPage
      title="Avatar"
      slug="avatar"
      description="Radix-based avatar with image and initials fallback. Themed to fit nexUI surfaces in light and dark."
    >
      <DocSection title="Image">
        <ComponentPreview code={imageCode}>
          <Avatar>
            <AvatarImage src={PHOTO_URL} alt="Sarah" />
            <AvatarFallback>SJ</AvatarFallback>
          </Avatar>
        </ComponentPreview>
      </DocSection>

      <DocSection title="Fallback only">
        <ComponentPreview code={fallbackCode}>
          <Avatar>
            <AvatarFallback>SJ</AvatarFallback>
          </Avatar>
        </ComponentPreview>
      </DocSection>

      <DocSection title="Sizes">
        <ComponentPreview code={sizesCode}>
          <div className="flex items-end gap-3">
            <Avatar className="size-6">
              <AvatarImage src={PHOTO_URL} alt="Sarah" />
              <AvatarFallback>SJ</AvatarFallback>
            </Avatar>
            <Avatar className="size-8">
              <AvatarImage src={PHOTO_URL} alt="Sarah" />
              <AvatarFallback>SJ</AvatarFallback>
            </Avatar>
            <Avatar className="size-10">
              <AvatarImage src={PHOTO_URL} alt="Sarah" />
              <AvatarFallback>SJ</AvatarFallback>
            </Avatar>
            <Avatar className="size-12">
              <AvatarImage src={PHOTO_URL} alt="Sarah" />
              <AvatarFallback>SJ</AvatarFallback>
            </Avatar>
          </div>
        </ComponentPreview>
      </DocSection>

      <DocSection title="Avatar Props">
        <PropsTable props={avatarProps} />
      </DocSection>

      <DocSection title="AvatarImage Props">
        <PropsTable props={avatarImageProps} />
      </DocSection>

      <DocSection title="AvatarFallback Props">
        <PropsTable props={avatarFallbackProps} />
      </DocSection>
    </DocPage>
  );
}
