"use client";

import {
  DiceBearAvatar,
  JazziconAvatar,
  SpellAvatar,
  type DiceBearStyleName,
} from "@/registry/default/avatar-generators";
import { ComponentPreview } from "@/lib/docs/ComponentPreview";
import { PropsTable, type PropDef } from "@/lib/docs/PropsTable";
import { DocPage, DocSection } from "@/lib/docs/DocPage";

const dicebearStyles: DiceBearStyleName[] = [
  "avataaars",
  "bottts",
  "glass",
  "identicon",
  "icons",
  "initials",
  "pixel-art",
];

const dicebearCode = `import { DiceBearAvatar } from "./components";

<DiceBearAvatar seed="alice" styleName="avataaars" size={56} />
<DiceBearAvatar seed="alice" styleName="bottts" size={56} />
<DiceBearAvatar seed="alice" styleName="glass" size={56} />
<DiceBearAvatar seed="alice" styleName="identicon" size={56} />
<DiceBearAvatar seed="alice" styleName="icons" size={56} />
<DiceBearAvatar seed="alice" styleName="initials" size={56} />
<DiceBearAvatar seed="alice" styleName="pixel-art" size={56} />`;

const jazziconCode = `import { JazziconAvatar } from "./components";

<JazziconAvatar seed="0x1234567890abcdef1234567890abcdef12345678" size={56} />
<JazziconAvatar seed="0xabcdef1234567890abcdef1234567890abcdef12" size={56} />
<JazziconAvatar seed="0xdeadbeefdeadbeefdeadbeefdeadbeefdeadbeef" size={56} />`;

const spellCode = `import { SpellAvatar } from "./components";

<SpellAvatar seed="Sarah Johnson" size={56} />
<SpellAvatar seed="Alex Chen" size={56} />
<SpellAvatar seed="Marcus Williams" size={56} />`;

const jazziconAddresses = [
  "0x1234567890abcdef1234567890abcdef12345678",
  "0xabcdef1234567890abcdef1234567890abcdef12",
  "0xdeadbeefdeadbeefdeadbeefdeadbeefdeadbeef",
];

const spellNames = ["Sarah Johnson", "Alex Chen", "Marcus Williams"];

const diceBearProps: PropDef[] = [
  {
    name: "seed",
    type: "string",
    description:
      "Deterministic input. The same seed produces the same avatar across all DiceBear styles.",
  },
  {
    name: "styleName",
    type: '"avataaars" | "bottts" | "glass" | "identicon" | "icons" | "initials" | "pixel-art"',
    default: '"avataaars"',
    description: "Which DiceBear collection to render.",
  },
  {
    name: "size",
    type: "number",
    default: "40",
    description: "Pixel width and height of the rendered SVG.",
  },
  {
    name: "backgroundColor",
    type: "string[]",
    description:
      "Optional background palette passed to DiceBear. Empty/omitted = transparent.",
  },
  {
    name: "alt",
    type: "string",
    default: '`Avatar for {seed}`',
    description: "Accessible alt text for the underlying <img>.",
  },
];

const jazziconProps: PropDef[] = [
  {
    name: "seed",
    type: "string",
    description:
      "Any string — typically a hex address. Hashed to a 32-bit int before passing to Jazzicon.",
  },
  {
    name: "size",
    type: "number",
    default: "40",
    description: "Pixel width and height of the rendered avatar.",
  },
];

const spellProps: PropDef[] = [
  {
    name: "seed",
    type: "string",
    description:
      "Hashed for HSL color and used to derive initials when `initials` is omitted.",
  },
  {
    name: "initials",
    type: "string",
    description:
      "Explicit initials to render. Falls back to first/last initial of `seed`.",
  },
  {
    name: "size",
    type: "number",
    default: "40",
    description: "Pixel width and height of the avatar.",
  },
  {
    name: "saturation",
    type: "number",
    default: "65",
    description: "HSL saturation (0–100) used for the background fill.",
  },
  {
    name: "lightness",
    type: "number",
    default: "55",
    description: "HSL lightness (0–100). Foreground text auto-contrasts.",
  },
];

export default function AvatarGeneratorsDoc() {
  return (
    <DocPage
      title="Avatar generators"
      slug="avatar-generators"
      description="Three deterministic avatar backends with a unified prop API: DiceBear (7 styles), Jazzicon (Web3 patterns), and Spell (initials fallback)."
    >
      <DocSection title="DiceBear styles">
        <ComponentPreview code={dicebearCode}>
          <div className="grid grid-cols-4 gap-4 sm:grid-cols-7">
            {dicebearStyles.map((styleName) => (
              <div key={styleName} className="flex flex-col items-center gap-2">
                <DiceBearAvatar seed="alice" styleName={styleName} size={56} />
                <span className="text-[11px] text-muted-foreground">
                  {styleName}
                </span>
              </div>
            ))}
          </div>
        </ComponentPreview>
      </DocSection>

      <DocSection title="Jazzicon">
        <ComponentPreview code={jazziconCode}>
          <div className="flex flex-wrap items-center gap-4">
            {jazziconAddresses.map((address) => (
              <JazziconAvatar key={address} seed={address} size={56} />
            ))}
          </div>
        </ComponentPreview>
      </DocSection>

      <DocSection title="Spell fallback">
        <ComponentPreview code={spellCode}>
          <div className="flex flex-wrap items-center gap-4">
            {spellNames.map((name) => (
              <SpellAvatar key={name} seed={name} size={56} />
            ))}
          </div>
        </ComponentPreview>
      </DocSection>

      <DocSection title="DiceBearAvatar Props">
        <PropsTable props={diceBearProps} />
      </DocSection>

      <DocSection title="JazziconAvatar Props">
        <PropsTable props={jazziconProps} />
      </DocSection>

      <DocSection title="SpellAvatar Props">
        <PropsTable props={spellProps} />
      </DocSection>
    </DocPage>
  );
}
