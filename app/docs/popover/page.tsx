"use client";

import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/registry/default/popover";
import { Button } from "@/registry/default/button";
import { ComponentPreview } from "@/lib/docs/ComponentPreview";
import { PropsTable, type PropDef } from "@/lib/docs/PropsTable";
import { DocPage, DocSection } from "@/lib/docs/DocPage";

const defaultCode = `import { Popover, PopoverTrigger, PopoverContent } from "./components";
import { Button } from "./components";

<Popover>
  <PopoverTrigger asChild>
    <Button variant="secondary">Open popover</Button>
  </PopoverTrigger>
  <PopoverContent>
    <div className="flex flex-col gap-1 p-2">
      <p className="text-[13px] text-foreground">Quick settings</p>
      <p className="text-[12px] text-muted-foreground">
        Adjust workspace preferences without leaving this view.
      </p>
    </div>
  </PopoverContent>
</Popover>`;

const alignmentCode = `import { Popover, PopoverTrigger, PopoverContent } from "./components";
import { Button } from "./components";

<Popover>
  <PopoverTrigger asChild>
    <Button variant="secondary">Start</Button>
  </PopoverTrigger>
  <PopoverContent align="start">Aligned to start</PopoverContent>
</Popover>

<Popover>
  <PopoverTrigger asChild>
    <Button variant="secondary">Center</Button>
  </PopoverTrigger>
  <PopoverContent align="center">Aligned to center</PopoverContent>
</Popover>

<Popover>
  <PopoverTrigger asChild>
    <Button variant="secondary">End</Button>
  </PopoverTrigger>
  <PopoverContent align="end">Aligned to end</PopoverContent>
</Popover>`;

const popoverContentProps: PropDef[] = [
  {
    name: "align",
    type: '"start" | "center" | "end"',
    default: '"center"',
    description:
      "Horizontal alignment relative to the trigger. Mirrors Radix Popover's align prop.",
  },
  {
    name: "sideOffset",
    type: "number",
    default: "6",
    description: "Pixel distance between the trigger and the popover surface.",
  },
  {
    name: "className",
    type: "string",
    description:
      "Override or extend the default surface styles (surface-3, shadow-4, rounded-2xl).",
  },
];

export default function PopoverDoc() {
  return (
    <DocPage
      title="Popover"
      slug="popover"
      description="Radix-based floating surface used for quick actions, settings, and contextual info. Themed for nexUI's elevation ladder."
    >
      <DocSection title="Default">
        <ComponentPreview code={defaultCode}>
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="secondary">Open popover</Button>
            </PopoverTrigger>
            <PopoverContent>
              <div className="flex flex-col gap-1 p-2">
                <p className="text-[13px] text-foreground">Quick settings</p>
                <p className="text-[12px] text-muted-foreground">
                  Adjust workspace preferences without leaving this view.
                </p>
              </div>
            </PopoverContent>
          </Popover>
        </ComponentPreview>
      </DocSection>

      <DocSection title="Alignment">
        <ComponentPreview code={alignmentCode}>
          <div className="flex flex-wrap items-center gap-3">
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="secondary">Start</Button>
              </PopoverTrigger>
              <PopoverContent align="start">
                <div className="p-2 text-[13px] text-foreground">
                  Aligned to start
                </div>
              </PopoverContent>
            </Popover>

            <Popover>
              <PopoverTrigger asChild>
                <Button variant="secondary">Center</Button>
              </PopoverTrigger>
              <PopoverContent align="center">
                <div className="p-2 text-[13px] text-foreground">
                  Aligned to center
                </div>
              </PopoverContent>
            </Popover>

            <Popover>
              <PopoverTrigger asChild>
                <Button variant="secondary">End</Button>
              </PopoverTrigger>
              <PopoverContent align="end">
                <div className="p-2 text-[13px] text-foreground">
                  Aligned to end
                </div>
              </PopoverContent>
            </Popover>
          </div>
        </ComponentPreview>
      </DocSection>

      <DocSection title="API Reference">
        <PropsTable props={popoverContentProps} />
      </DocSection>
    </DocPage>
  );
}
