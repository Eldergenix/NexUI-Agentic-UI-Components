"use client";

import { useState } from "react";
import { BorderBeam } from "@/registry/default/border-beam";
import { Button } from "@/registry/default/button";
import { ComponentPreview } from "@/lib/docs/ComponentPreview";
import { PropsTable, type PropDef } from "@/lib/docs/PropsTable";
import { DocPage, DocSection } from "@/lib/docs/DocPage";

const basicCode = `import { BorderBeam } from "./components";

<BorderBeam size="md" colorVariant="colorful">
  <button className="px-4 py-2 rounded-2xl bg-neutral-900 text-white">
    Click me
  </button>
</BorderBeam>`;

const variantsCode = `import { BorderBeam } from "./components";

<BorderBeam colorVariant="colorful">…</BorderBeam>
<BorderBeam colorVariant="mono">…</BorderBeam>
<BorderBeam colorVariant="ocean">…</BorderBeam>
<BorderBeam colorVariant="sunset">…</BorderBeam>`;

const sizesCode = `import { BorderBeam } from "./components";

<BorderBeam size="sm">…</BorderBeam>
<BorderBeam size="md">…</BorderBeam>
<BorderBeam size="line">…</BorderBeam>`;

const controlsCode = `import { BorderBeam } from "./components";

<BorderBeam
  size="md"
  colorVariant="colorful"
  duration={1.96}
  brightness={1.3}
  hueRange={30}
  strength={1}
  active
/>`;

const borderBeamProps: PropDef[] = [
  { name: "size", type: '"sm" | "md" | "line"', default: '"md"', description: "Visual size preset." },
  { name: "colorVariant", type: '"colorful" | "mono" | "ocean" | "sunset"', default: '"colorful"', description: "Color palette for the traveling beam." },
  { name: "theme", type: '"dark" | "light" | "auto"', default: '"dark"', description: "Theme-aware opacity/saturation defaults." },
  { name: "duration", type: "number", default: "1.96", description: "Seconds per full revolution. `line` size defaults to 2.4." },
  { name: "active", type: "boolean", default: "true", description: "Pause / play the animation. Fires onActivate/onDeactivate when toggled." },
  { name: "borderRadius", type: "number", description: "Border radius in pixels. Defaults derive from `size`." },
  { name: "brightness", type: "number", default: "1.3", description: "Multiplies the glow brightness." },
  { name: "saturation", type: "number", description: "Color saturation. Theme-aware default." },
  { name: "hueRange", type: "number", default: "30", description: "Hue rotation range in degrees (animated)." },
  { name: "strength", type: "number", default: "1", description: "Effect opacity multiplier (0..1)." },
  { name: "staticColors", type: "boolean", default: "false", description: "Disable the hue-shift animation; only rotate the beam." },
  { name: "onActivate", type: "() => void", description: "Called when `active` becomes true." },
  { name: "onDeactivate", type: "() => void", description: "Called when `active` becomes false." },
];

function DemoCard({ label }: { label: string }) {
  return (
    <div className="px-4 py-3 rounded-2xl bg-neutral-900 text-white text-[13px] min-w-32 text-center">
      {label}
    </div>
  );
}

export default function BorderBeamDoc() {
  const [active, setActive] = useState(true);

  return (
    <DocPage
      title="Border Beam"
      slug="border-beam"
      description="Animated traveling glow border for cards, buttons, and AI surfaces. Web port of the React Native original."
    >
      <DocSection title="Basic">
        <ComponentPreview code={basicCode}>
          <div className="flex items-center justify-center py-8">
            <BorderBeam size="md" colorVariant="colorful">
              <DemoCard label="Hello, nexUI" />
            </BorderBeam>
          </div>
        </ComponentPreview>
      </DocSection>

      <DocSection title="Color variants">
        <ComponentPreview code={variantsCode}>
          <div className="grid grid-cols-2 gap-4 py-6 place-items-center">
            <BorderBeam colorVariant="colorful"><DemoCard label="Colorful" /></BorderBeam>
            <BorderBeam colorVariant="mono"><DemoCard label="Mono" /></BorderBeam>
            <BorderBeam colorVariant="ocean"><DemoCard label="Ocean" /></BorderBeam>
            <BorderBeam colorVariant="sunset"><DemoCard label="Sunset" /></BorderBeam>
          </div>
        </ComponentPreview>
      </DocSection>

      <DocSection title="Sizes">
        <ComponentPreview code={sizesCode}>
          <div className="flex flex-wrap items-center gap-6 justify-center py-6">
            <BorderBeam size="sm"><DemoCard label="sm" /></BorderBeam>
            <BorderBeam size="md"><DemoCard label="md" /></BorderBeam>
            <BorderBeam size="line"><DemoCard label="line" /></BorderBeam>
          </div>
        </ComponentPreview>
      </DocSection>

      <DocSection title="Play / pause">
        <ComponentPreview code={controlsCode}>
          <div className="flex flex-col items-center gap-3 py-6">
            <BorderBeam active={active} colorVariant="ocean" size="md">
              <DemoCard label={active ? "Active" : "Paused"} />
            </BorderBeam>
            <Button variant="secondary" size="sm" onClick={() => setActive((a) => !a)}>
              {active ? "Pause" : "Play"}
            </Button>
          </div>
        </ComponentPreview>
      </DocSection>

      <DocSection title="API Reference">
        <PropsTable props={borderBeamProps} />
      </DocSection>
    </DocPage>
  );
}
