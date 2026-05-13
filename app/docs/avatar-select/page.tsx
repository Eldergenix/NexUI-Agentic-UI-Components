"use client";

import { AvatarSelect } from "@/registry/default/avatar-select";
import { ComponentPreview } from "@/lib/docs/ComponentPreview";
import { PropsTable, type PropDef } from "@/lib/docs/PropsTable";
import { DocPage, DocSection } from "@/lib/docs/DocPage";

const users = [
  {
    value: "jenny",
    label: "Jenny Hamilton",
    initials: "JH",
    avatarUrl:
      "https://images.unsplash.com/photo-1543610892-0b1f7e6d8ac1?w=72&h=72&dpr=2&q=80",
  },
  {
    value: "paul",
    label: "Paul Smith",
    initials: "PS",
    avatarUrl:
      "https://images.unsplash.com/photo-1628157588553-5eeea00af15c?w=72&h=72&dpr=2&q=80",
  },
  {
    value: "luna",
    label: "Luna Wyen",
    initials: "LW",
    avatarUrl:
      "https://images.unsplash.com/photo-1655874819398-c6dfbec68ac7?w=72&h=72&dpr=2&q=80",
  },
];

const defaultCode = `import { AvatarSelect } from "./components";

const users = [
  { value: "jenny", label: "Jenny Hamilton", initials: "JH", avatarUrl: "..." },
  { value: "paul",  label: "Paul Smith",     initials: "PS", avatarUrl: "..." },
  { value: "luna",  label: "Luna Wyen",      initials: "LW", avatarUrl: "..." },
];

<AvatarSelect
  options={users}
  defaultValue="jenny"
  placeholder="Select member…"
  ariaLabel="Assignee"
/>`;

const groupLabelCode = `import { AvatarSelect } from "./components";

<AvatarSelect
  options={users}
  defaultValue="paul"
  groupLabel="Team"
  ariaLabel="Reviewer"
/>`;

const avatarSelectProps: PropDef[] = [
  {
    name: "options",
    type: "AvatarSelectOption[]",
    description:
      "Selectable options. Each option supports `value`, `label`, optional `avatarUrl`, and optional `initials`.",
  },
  {
    name: "value",
    type: "string",
    description:
      "Currently selected value. Pass to make the component controlled.",
  },
  {
    name: "defaultValue",
    type: "string",
    description: "Initial value when uncontrolled.",
  },
  {
    name: "onValueChange",
    type: "(value: string) => void",
    description: "Fires whenever the user selects a new option.",
  },
  {
    name: "placeholder",
    type: "string",
    default: '"Select…"',
    description: "Shown on the trigger when nothing is selected.",
  },
  {
    name: "groupLabel",
    type: "string",
    description:
      "Optional uppercase caption rendered above the option list inside the popover.",
  },
  {
    name: "className",
    type: "string",
    description: "Forwarded to the trigger button.",
  },
  {
    name: "ariaLabel",
    type: "string",
    description: "Accessible label for the trigger and the option list.",
  },
];

export default function AvatarSelectDoc() {
  return (
    <DocPage
      title="Avatar select"
      slug="avatar-select"
      description="Single-select dropdown that renders each option as an avatar plus name. Ideal for assignee, owner, or reviewer pickers."
    >
      <DocSection title="Default">
        <ComponentPreview code={defaultCode}>
          <div className="w-64">
            <AvatarSelect
              options={users}
              defaultValue="jenny"
              placeholder="Select member…"
              ariaLabel="Assignee"
            />
          </div>
        </ComponentPreview>
      </DocSection>

      <DocSection title="With group label">
        <ComponentPreview code={groupLabelCode}>
          <div className="w-64">
            <AvatarSelect
              options={users}
              defaultValue="paul"
              groupLabel="Team"
              ariaLabel="Reviewer"
            />
          </div>
        </ComponentPreview>
      </DocSection>

      <DocSection title="API Reference">
        <PropsTable props={avatarSelectProps} />
      </DocSection>
    </DocPage>
  );
}
