"use client";

import { useState } from "react";
import {
  Inbox,
  CircleDot,
  FolderKanban,
  Map,
  Layers,
  Sparkles,
  Box,
  Telescope,
  Triangle,
  Hammer,
  CheckCircle2,
  Tag,
  Network,
  Bell,
  Search,
  ChevronDown,
  Plus,
  Cog,
  Users,
  ListTodo,
  ChevronRight,
} from "lucide-react";

import { LinearShell } from "@/registry/default/linear-shell";
import { Badge } from "@/registry/default/badge";
import { DocPage, DocSection } from "@/lib/docs/DocPage";
import { ComponentPreview } from "@/lib/docs/ComponentPreview";
import { PropsTable, type PropDef } from "@/lib/docs/PropsTable";
import { FullscreenPreview } from "@/lib/docs/FullscreenPreview";

// ─── Sample data for the demo ───────────────────────────────────────────────

const teamItems = [
  { icon: <Box className="size-4" />, label: "Issues", active: true },
  { icon: <FolderKanban className="size-4" />, label: "Projects" },
  { icon: <Map className="size-4" />, label: "Views" },
  { icon: <CheckCircle2 className="size-4" />, label: "Active Cycle" },
];

const workspaceItems = [
  { icon: <Layers className="size-4" />, label: "Initiatives" },
  { icon: <Hammer className="size-4" />, label: "Roadmap" },
  { icon: <Triangle className="size-4" />, label: "Labels" },
];

const recentItems = [
  { icon: <Tag className="size-4" />, label: "P-Engineering" },
  { icon: <Tag className="size-4" />, label: "P-Design" },
  { icon: <Tag className="size-4" />, label: "P-Mobile" },
  { icon: <Tag className="size-4" />, label: "P-Platform" },
];

// ─── The demo ───────────────────────────────────────────────────────────────

function LinearShellDemo() {
  return (
    <FullscreenPreview height="600px">
      <LinearShell>
        <LinearShell.Sidebar>
          <LinearShell.Sidebar.Header
            icon={<Network />}
            label="nexUI"
          />

          <LinearShell.Sidebar.Body>
            <LinearShell.Section>
              <LinearShell.Item icon={<Inbox className="size-4" />}>
                Inbox
              </LinearShell.Item>
              <LinearShell.Item icon={<CircleDot className="size-4" />}>
                My Issues
              </LinearShell.Item>
            </LinearShell.Section>

            <LinearShell.Section label="Workspace">
              {workspaceItems.map((it) => (
                <LinearShell.Item key={it.label} icon={it.icon}>
                  {it.label}
                </LinearShell.Item>
              ))}
            </LinearShell.Section>

            <LinearShell.Section label="Your teams">
              {teamItems.map((it) => (
                <LinearShell.Item
                  key={it.label}
                  icon={it.icon}
                  active={it.active}
                >
                  {it.label}
                </LinearShell.Item>
              ))}
            </LinearShell.Section>

            <LinearShell.Section label="Try">
              <LinearShell.Item
                icon={<Sparkles className="size-4" />}
                indicator={<LinearShell.Dot variant="rose" />}
              >
                Customer Requests
              </LinearShell.Item>
              <LinearShell.Item icon={<Telescope className="size-4" />}>
                Insights
              </LinearShell.Item>
            </LinearShell.Section>

            <LinearShell.Section label="Recent">
              {recentItems.map((it) => (
                <LinearShell.Item key={it.label} icon={it.icon}>
                  {it.label}
                </LinearShell.Item>
              ))}
            </LinearShell.Section>
          </LinearShell.Sidebar.Body>

          <LinearShell.Help />
        </LinearShell.Sidebar>

        <LinearShell.Main>
          <LinearShell.TopBar>
            <LinearShell.TopBarAction icon={<Inbox className="size-3.5" />}>
              Inbox
            </LinearShell.TopBarAction>
            <LinearShell.TopBarAction
              icon={<Bell className="size-3.5" />}
              iconOnly
              aria-label="Notifications"
            />
          </LinearShell.TopBar>

          <LinearShell.Content>
            {/* Sample content header */}
            <div className="flex flex-row items-center justify-between px-5 py-3 border-b border-border bg-card">
              <div className="flex flex-row items-center gap-2">
                <CircleDot className="size-4 text-muted-foreground" />
                <h1 className="text-[14px] font-semibold tracking-tight">
                  All issues
                </h1>
                <span className="text-[12px] text-muted-foreground">14</span>
              </div>
              <div className="flex flex-row items-center gap-2">
                <button
                  type="button"
                  className="inline-flex items-center gap-1 h-7 px-2 rounded-md text-[12px] font-medium text-muted-foreground hover:bg-[color-mix(in_oklab,var(--foreground)_6%,transparent)] hover:text-foreground transition-colors"
                >
                  Filter
                  <ChevronDown className="size-3" />
                </button>
                <button
                  type="button"
                  className="inline-flex items-center justify-center size-7 rounded-md text-muted-foreground hover:bg-[color-mix(in_oklab,var(--foreground)_6%,transparent)] hover:text-foreground transition-colors"
                  aria-label="New issue"
                >
                  <Plus className="size-3.5" />
                </button>
              </div>
            </div>

            {/* Sample content rows */}
            <ul className="flex flex-col">
              {[
                {
                  id: "NEX-101",
                  title: "Move BorderBeam to web Canvas API",
                  status: "in-progress",
                  badge: <Badge size="sm" color="blue" variant="dot">In Progress</Badge>,
                },
                {
                  id: "NEX-098",
                  title: "Refactor AgentChat to use Suspense boundaries",
                  status: "todo",
                  badge: <Badge size="sm" color="gray" variant="dot">Todo</Badge>,
                },
                {
                  id: "NEX-095",
                  title: "Bring claude-input model picker to Base UI v2",
                  status: "review",
                  badge: <Badge size="sm" color="violet" variant="dot">In Review</Badge>,
                },
                {
                  id: "NEX-091",
                  title: "Document the surface elevation ladder",
                  status: "done",
                  badge: <Badge size="sm" color="emerald" variant="dot">Done</Badge>,
                },
                {
                  id: "NEX-088",
                  title: "Ship coss.com Table + Frame primitives",
                  status: "done",
                  badge: <Badge size="sm" color="emerald" variant="dot">Done</Badge>,
                },
              ].map((row) => (
                <li
                  key={row.id}
                  className="flex flex-row items-center gap-3 px-5 py-2.5 border-b border-border last:border-b-0 hover:bg-[color-mix(in_oklab,var(--foreground)_3%,transparent)] transition-colors cursor-pointer"
                >
                  <span className="text-[12px] font-mono text-muted-foreground w-16 shrink-0">
                    {row.id}
                  </span>
                  <span className="text-[13px] flex-1 truncate text-foreground">
                    {row.title}
                  </span>
                  {row.badge}
                </li>
              ))}
            </ul>
          </LinearShell.Content>
        </LinearShell.Main>
      </LinearShell>
    </FullscreenPreview>
  );
}

// ─── Mini demo: minimal sidebar only ────────────────────────────────────────

function LinearShellMiniDemo() {
  const [active, setActive] = useState("inbox");
  return (
    <div className="h-[380px] w-full max-w-md overflow-hidden rounded-xl border border-border bg-background">
      <LinearShell.Sidebar>
        <LinearShell.Sidebar.Header icon={<Network />} label="Acme" />
        <LinearShell.Sidebar.Body>
          <LinearShell.Section>
            <LinearShell.Item
              icon={<Inbox className="size-4" />}
              active={active === "inbox"}
              onClick={() => setActive("inbox")}
            >
              Inbox
            </LinearShell.Item>
            <LinearShell.Item
              icon={<ListTodo className="size-4" />}
              active={active === "issues"}
              onClick={() => setActive("issues")}
            >
              My Issues
            </LinearShell.Item>
          </LinearShell.Section>
          <LinearShell.Section label="Workspace">
            <LinearShell.Item
              icon={<Users className="size-4" />}
              active={active === "teams"}
              onClick={() => setActive("teams")}
            >
              Teams
            </LinearShell.Item>
            <LinearShell.Item
              icon={<Cog className="size-4" />}
              active={active === "settings"}
              onClick={() => setActive("settings")}
              indicator={<LinearShell.Dot variant="rose" />}
            >
              Settings
            </LinearShell.Item>
          </LinearShell.Section>
        </LinearShell.Sidebar.Body>
      </LinearShell.Sidebar>
    </div>
  );
}

// ─── Code snippets ──────────────────────────────────────────────────────────

const usageCode = `import { LinearShell } from "@/components/linear-shell";
import { Inbox, CircleDot, Bell, Network } from "lucide-react";

<LinearShell>
  <LinearShell.Sidebar>
    <LinearShell.Sidebar.Header icon={<Network />} label="Acme" />
    <LinearShell.Sidebar.Body>
      <LinearShell.Section>
        <LinearShell.Item icon={<Inbox />} active>Inbox</LinearShell.Item>
        <LinearShell.Item icon={<CircleDot />}>My Issues</LinearShell.Item>
      </LinearShell.Section>
      <LinearShell.Section label="Workspace">
        {/* … */}
      </LinearShell.Section>
    </LinearShell.Sidebar.Body>
    <LinearShell.Help />
  </LinearShell.Sidebar>

  <LinearShell.Main>
    <LinearShell.TopBar>
      <LinearShell.TopBarAction icon={<Inbox />}>Inbox</LinearShell.TopBarAction>
      <LinearShell.TopBarAction icon={<Bell />} iconOnly aria-label="Notifications" />
    </LinearShell.TopBar>
    <LinearShell.Content>
      {/* Your page content */}
    </LinearShell.Content>
  </LinearShell.Main>
</LinearShell>`;

const layoutCode = `// app/(app)/layout.tsx — drop straight into a Next.js App Router layout
import { LinearShell } from "@/components/linear-shell";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <LinearShell>
      <LinearShell.Sidebar>{/* … */}</LinearShell.Sidebar>
      <LinearShell.Main>
        <LinearShell.TopBar>{/* … */}</LinearShell.TopBar>
        <LinearShell.Content>{children}</LinearShell.Content>
      </LinearShell.Main>
    </LinearShell>
  );
}`;

const indicatorCode = `<LinearShell.Item
  icon={<Sparkles />}
  indicator={<LinearShell.Dot variant="rose" />}
>
  Customer Requests
</LinearShell.Item>`;

// ─── Props tables ───────────────────────────────────────────────────────────

const sidebarHeaderProps: PropDef[] = [
  { name: "icon", type: "ReactNode", description: "Leading icon (workspace logo or avatar)." },
  { name: "label", type: "ReactNode", description: "Workspace / project name." },
  { name: "trailing", type: "ReactNode", default: "<ChevronDown />", description: "Trailing affordance (default: chevron). Pass null to hide." },
  { name: "children", type: "ReactNode", description: "Custom header content (overrides the icon + label form)." },
];

const sectionProps: PropDef[] = [
  { name: "label", type: "ReactNode", description: "Small uppercase-ish heading rendered above the items." },
  { name: "children", type: "ReactNode", description: "<LinearShell.Item> nodes." },
];

const itemProps: PropDef[] = [
  { name: "icon", type: "ReactNode", description: "Leading 16px icon." },
  { name: "active", type: "boolean", default: "false", description: "Marks the item as the current page (aria-current=\"page\" + accent background)." },
  { name: "indicator", type: "ReactNode", description: "Right-aligned indicator (e.g. <LinearShell.Dot /> or a count badge)." },
];

const topBarActionProps: PropDef[] = [
  { name: "icon", type: "ReactNode", description: "Leading icon (or sole icon when iconOnly)." },
  { name: "iconOnly", type: "boolean", default: "false", description: "Renders as a 28×28 square button with no label." },
];

const dotProps: PropDef[] = [
  { name: "variant", type: '"rose" | "info" | "success" | "warning" | "neutral"', default: '"rose"', description: "Color variant. Rose is reserved for \"new\" / promotional indicators." },
];

// ─── Page ────────────────────────────────────────────────────────────────────

export default function LinearShellDoc() {
  return (
    <DocPage
      title="Linear Shell"
      slug="linear-shell"
      description="Application shell layout inspired by Linear.app — 244px scrollable sidebar with grouped sections, 32px top action bar, framed content card, and floating help button. Built entirely on nexUI tokens for automatic light/dark adaptation."
    >
      <DocSection title="Preview">
        <ComponentPreview code={usageCode}>
          <LinearShellDemo />
        </ComponentPreview>
      </DocSection>

      <DocSection title="Sidebar only">
        <ComponentPreview code={`<LinearShell.Sidebar>
  <LinearShell.Sidebar.Header icon={<Network />} label="Acme" />
  <LinearShell.Sidebar.Body>
    <LinearShell.Section>
      <LinearShell.Item icon={<Inbox />} active>Inbox</LinearShell.Item>
      <LinearShell.Item icon={<ListTodo />}>My Issues</LinearShell.Item>
    </LinearShell.Section>
    <LinearShell.Section label="Workspace">
      <LinearShell.Item icon={<Users />}>Teams</LinearShell.Item>
      <LinearShell.Item
        icon={<Cog />}
        indicator={<LinearShell.Dot variant="rose" />}
      >
        Settings
      </LinearShell.Item>
    </LinearShell.Section>
  </LinearShell.Sidebar.Body>
</LinearShell.Sidebar>`}>
          <LinearShellMiniDemo />
        </ComponentPreview>
      </DocSection>

      <DocSection title="As a Next.js layout file">
        <ComponentPreview code={layoutCode}>
          <div className="text-[13px] text-muted-foreground leading-relaxed space-y-2 max-w-prose">
            <p>
              Drop <code className="font-mono text-foreground">LinearShell</code> into{" "}
              <code className="font-mono text-foreground">app/(app)/layout.tsx</code> to
              wrap every page in the shell. The <code className="font-mono text-foreground">Content</code> slot
              receives the route children — sidebar and top bar stay persistent across navigations.
            </p>
            <p>
              The component uses semantic tokens (<code className="font-mono">bg-background</code>,{" "}
              <code className="font-mono">bg-card</code>, <code className="font-mono">bg-accent</code>,{" "}
              <code className="font-mono">text-muted-foreground</code>, <code className="font-mono">border-border</code>) —
              so it inherits whatever <code className="font-mono">.dark</code> /{" "}
              <code className="font-mono">.light</code> scope wraps it. No theme prop needed.
            </p>
          </div>
        </ComponentPreview>
      </DocSection>

      <DocSection title="Indicators">
        <ComponentPreview code={indicatorCode}>
          <div className="flex flex-col gap-2 w-[244px] bg-background border border-border rounded-xl p-3">
            <LinearShell.Section>
              <LinearShell.Item icon={<Sparkles className="size-4" />} indicator={<LinearShell.Dot variant="rose" />}>
                Rose (new)
              </LinearShell.Item>
              <LinearShell.Item icon={<ChevronRight className="size-4" />} indicator={<LinearShell.Dot variant="info" />}>
                Info
              </LinearShell.Item>
              <LinearShell.Item icon={<CheckCircle2 className="size-4" />} indicator={<LinearShell.Dot variant="success" />}>
                Success
              </LinearShell.Item>
              <LinearShell.Item icon={<Bell className="size-4" />} indicator={<LinearShell.Dot variant="warning" />}>
                Warning
              </LinearShell.Item>
              <LinearShell.Item icon={<Search className="size-4" />} indicator={<LinearShell.Dot variant="neutral" />}>
                Neutral
              </LinearShell.Item>
            </LinearShell.Section>
          </div>
        </ComponentPreview>
      </DocSection>

      <DocSection title="API — LinearShell.Sidebar.Header">
        <PropsTable props={sidebarHeaderProps} />
      </DocSection>

      <DocSection title="API — LinearShell.Section">
        <PropsTable props={sectionProps} />
      </DocSection>

      <DocSection title="API — LinearShell.Item">
        <PropsTable props={itemProps} />
      </DocSection>

      <DocSection title="API — LinearShell.TopBarAction">
        <PropsTable props={topBarActionProps} />
      </DocSection>

      <DocSection title="API — LinearShell.Dot">
        <PropsTable props={dotProps} />
      </DocSection>
    </DocPage>
  );
}
