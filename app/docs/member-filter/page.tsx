"use client";

import { MemberFilter } from "@/registry/default/member-filter";
import { ComponentPreview } from "@/lib/docs/ComponentPreview";
import { PropsTable, type PropDef } from "@/lib/docs/PropsTable";
import { DocPage, DocSection } from "@/lib/docs/DocPage";

const members = [
  {
    id: "alex",
    label: "Alex Chen",
    avatarUrl:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=72&h=72&dpr=2&q=80",
  },
  {
    id: "sarah",
    label: "Sarah Johnson",
    avatarUrl:
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=72&h=72&dpr=2&q=80",
  },
  {
    id: "marcus",
    label: "Marcus Williams",
    avatarUrl:
      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=72&h=72&dpr=2&q=80",
  },
  {
    id: "emma",
    label: "Emma Davis",
    avatarUrl:
      "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=72&h=72&dpr=2&q=80",
  },
  {
    id: "james",
    label: "James Miller",
    avatarUrl:
      "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=72&h=72&dpr=2&q=80",
  },
];

const preselected = members.slice(0, 2);

const defaultCode = `import { MemberFilter } from "./components";

const members = [
  { id: "alex",    label: "Alex Chen",        avatarUrl: "..." },
  { id: "sarah",   label: "Sarah Johnson",    avatarUrl: "..." },
  { id: "marcus",  label: "Marcus Williams",  avatarUrl: "..." },
  { id: "emma",    label: "Emma Davis",       avatarUrl: "..." },
  { id: "james",   label: "James Miller",     avatarUrl: "..." },
];

<MemberFilter
  members={members}
  defaultSelected={members.slice(0, 2)}
/>`;

const customLabelCode = `import { MemberFilter } from "./components";

<MemberFilter
  members={members}
  defaultSelected={[members[0]]}
  label="Assignee"
/>`;

const memberFilterProps: PropDef[] = [
  {
    name: "members",
    type: "MemberOption[]",
    description:
      "Full list of selectable members. Each option supports `id`, `label`, optional `avatarUrl`, and optional `initials`.",
  },
  {
    name: "defaultSelected",
    type: "MemberOption[]",
    description: "Initially selected members when uncontrolled.",
  },
  {
    name: "selected",
    type: "MemberOption[]",
    description:
      "Currently selected members. Pass to make the component controlled.",
  },
  {
    name: "onSelectedChange",
    type: "(selected: MemberOption[]) => void",
    description: "Fires whenever the selection changes (add, remove, clear).",
  },
  {
    name: "className",
    type: "string",
    description: "Forwarded to the outer filter pill wrapper.",
  },
  {
    name: "label",
    type: "string",
    default: '"Member"',
    description: "Filter group label shown next to the funnel icon.",
  },
];

export default function MemberFilterDoc() {
  return (
    <DocPage
      title="Member filter"
      slug="member-filter"
      description="Segmented filter pill with a searchable multi-select popover. Shows the first-selected avatar plus a “+N” badge on the trigger."
    >
      <DocSection title="Default">
        <ComponentPreview code={defaultCode}>
          <MemberFilter members={members} defaultSelected={preselected} />
        </ComponentPreview>
      </DocSection>

      <DocSection title="Custom label">
        <ComponentPreview code={customLabelCode}>
          <MemberFilter
            members={members}
            defaultSelected={[members[0]!]}
            label="Assignee"
          />
        </ComponentPreview>
      </DocSection>

      <DocSection title="API Reference">
        <PropsTable props={memberFilterProps} />
      </DocSection>
    </DocPage>
  );
}
