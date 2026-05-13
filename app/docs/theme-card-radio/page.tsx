"use client";

import { useState } from "react";
import { ThemeCardRadio, type ThemeChoice } from "@/registry/default/theme-card-radio";
import { ComponentPreview } from "@/lib/docs/ComponentPreview";
import { PropsTable, type PropDef } from "@/lib/docs/PropsTable";
import { DocPage, DocSection } from "@/lib/docs/DocPage";

const basicCode = `import { ThemeCardRadio } from "./components";

<ThemeCardRadio defaultValue="system" />`;

const controlledCode = `import { ThemeCardRadio, type ThemeChoice } from "./components";
import { useState } from "react";

const [theme, setTheme] = useState<ThemeChoice>("system");

<ThemeCardRadio value={theme} onValueChange={setTheme} />`;

const themeCardRadioProps: PropDef[] = [
  {
    name: "value",
    type: '"system" | "light" | "dark"',
    description: "Currently selected theme. Pass to control externally.",
  },
  {
    name: "defaultValue",
    type: '"system" | "light" | "dark"',
    default: '"system"',
    description: "Initial selected theme for uncontrolled mode.",
  },
  {
    name: "onValueChange",
    type: "(value: ThemeChoice) => void",
    description: "Called when the user selects a different theme.",
  },
  {
    name: "name",
    type: "string",
    description: "Radio group name (must be unique per form). Defaults to a generated id.",
  },
  {
    name: "legend",
    type: "ReactNode",
    default: '"Choose a theme"',
    description: "Override the fieldset legend.",
  },
  {
    name: "className",
    type: "string",
    description: "Extra class for the outer fieldset.",
  },
];

export default function ThemeCardRadioDoc() {
  const [theme, setTheme] = useState<ThemeChoice>("system");

  return (
    <DocPage
      title="ThemeCardRadio"
      slug="theme-card-radio"
      description="Visual theme selector with image card previews (System / Light / Dark). Adapted from coss.com p-radio-group-6."
    >
      <DocSection title="Basic">
        <ComponentPreview code={basicCode}>
          <ThemeCardRadio defaultValue="system" />
        </ComponentPreview>
      </DocSection>

      <DocSection title="Controlled">
        <ComponentPreview code={controlledCode}>
          <div className="flex flex-col items-center gap-4">
            <ThemeCardRadio value={theme} onValueChange={setTheme} />
            <p className="text-[12px] text-[var(--muted-foreground)]">
              Selected: <span className="font-mono text-[var(--foreground)]">{theme}</span>
            </p>
          </div>
        </ComponentPreview>
      </DocSection>

      <DocSection title="API Reference">
        <PropsTable props={themeCardRadioProps} />
      </DocSection>
    </DocPage>
  );
}
