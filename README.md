<div align="center">

# NexUI &nbsp;·&nbsp; Agentic UI Components for AI SDK v6

**The shadcn/ui registry for AI agent applications.**
Chat composers, tool renderers, streaming UI, thinking indicators, glass avatars, agent shell layouts, MCP support, and AI artifacts — production-ready React components built for **Vercel AI SDK v6**, **Next.js 15**, **React 19**, and **Tailwind v4**.

<br />

[![shadcn registry](https://img.shields.io/badge/shadcn-registry-000?style=flat-square&logo=shadcnui&logoColor=white)](https://ui.shadcn.com)
[![AI SDK v6](https://img.shields.io/badge/AI%20SDK-v6-FF6F00?style=flat-square&logo=vercel&logoColor=white)](https://sdk.vercel.ai)
[![Next.js 15](https://img.shields.io/badge/Next.js-15-000?style=flat-square&logo=nextdotjs&logoColor=white)](https://nextjs.org)
[![React 19](https://img.shields.io/badge/React-19-61DAFB?style=flat-square&logo=react&logoColor=white)](https://react.dev)
[![Tailwind v4](https://img.shields.io/badge/Tailwind-v4-06B6D4?style=flat-square&logo=tailwindcss&logoColor=white)](https://tailwindcss.com)
[![TypeScript](https://img.shields.io/badge/TypeScript-strict-3178C6?style=flat-square&logo=typescript&logoColor=white)](https://typescriptlang.org)
[![MIT](https://img.shields.io/badge/license-MIT-22C55E?style=flat-square)](LICENSE)
[![X follow](https://img.shields.io/badge/follow-@elderatlantean-000?style=flat-square&logo=x&logoColor=white)](https://x.com/elderatlantean)

<a href="https://github.com/Eldergenix/NexUI-Agentic-UI-Components"><strong>GitHub →</strong></a>&nbsp; · &nbsp;
<a href="#components">Browse 90+ Components</a>&nbsp; · &nbsp;
<a href="#install">Install</a>&nbsp; · &nbsp;
<a href="#featured-layouts">Featured Layouts</a>&nbsp; · &nbsp;
<a href="#examples">Examples</a>

</div>

<br />

> **TL;DR** — `npx shadcn@latest add https://cdn.jsdelivr.net/gh/Eldergenix/NexUI-Agentic-UI-Components@main/public/r/agent-chat.json` and you have a Vercel AI SDK–wired chat shell in your Next.js app. 90+ pre-built primitives, blocks, and full-page layouts for shipping AI agents fast.

<br />

## Why NexUI

If you're building an **AI agent**, an **AI chat app**, an **AI-powered SaaS**, or any product that calls an LLM through the **Vercel AI SDK** — NexUI is the registry that gives you the entire UI surface, not just buttons.

- 🧠 **Built for agents, not chatbots.** Tool call cards (Bash, Edit, Search, Plan, Todo, MCP, Subagent, Thinking), approval rows, plan-and-implement renderers, and a chain-of-thought "thinking steps" component — all the patterns Vercel + Anthropic + OpenAI products converged on, packaged as installable shadcn items.
- ⚡ **Vercel AI SDK v6 native.** Drop-in components consume `UIMessage[]`, work with `useChat`, support streaming via Streamdown + Shiki, and handle tool-state transitions out of the box.
- 🎨 **Two design systems, one registry.** Fluid Functionalism's spring physics and surface elevation, plus Agent Elements' production agent UI. All themed via OKLch tokens with automatic light + dark adaptation.
- 🧩 **90+ items, real install paths.** Standalone primitives (Button, Slider, Accordion), interactive tables, sheets, command palettes, full agent shells, and animated effects — all individually installable.
- 🚀 **One-command setup.** Powered by the official shadcn CLI; works in any Next.js, Remix, Astro, Vite, or RedwoodJS project. CDN-backed by jsDelivr — zero deployment infrastructure required.

<br />

## Install

You don't need to clone or fork. Install any component directly into your project with the official **shadcn CLI**:

```bash
npx shadcn@latest add https://cdn.jsdelivr.net/gh/Eldergenix/NexUI-Agentic-UI-Components@main/public/r/agent-chat.json
```

Replace `agent-chat` with any of the [90+ registered items](#components). Cross-component dependencies (other registry items + npm packages) install automatically.

### Bring an entire kit

```bash
# Full agentic UI kit — chat, tools, streaming, composer, all wired up
npx shadcn@latest add https://cdn.jsdelivr.net/gh/Eldergenix/NexUI-Agentic-UI-Components@main/public/r/linear-agent-shell.json

# Linear-style application chrome (sidebar, top bar, framed card)
npx shadcn@latest add https://cdn.jsdelivr.net/gh/Eldergenix/NexUI-Agentic-UI-Components@main/public/r/linear-shell.json

# Animated traveling-glow border for AI surfaces
npx shadcn@latest add https://cdn.jsdelivr.net/gh/Eldergenix/NexUI-Agentic-UI-Components@main/public/r/border-beam.json
```

Want your own domain? Override the CDN by deploying this repo (or just the `public/r` folder) anywhere and setting `NEXUI_REGISTRY_URL=https://your-domain.com/r` before `pnpm registry:build`.

<br />

## Featured layouts

### `linear-shell` &nbsp;·&nbsp; Linear-app inspired application chrome

A compound-API application shell — 244px scrollable sidebar with grouped sections, 32px top action bar, framed content card, floating help button. Built entirely on semantic tokens (`bg-background`, `bg-card`, `bg-accent`, `text-muted-foreground`, `border-border`) for automatic light + dark adaptation. Zero hex literals in the source.

```tsx
import { LinearShell } from "@/components/linear-shell";

<LinearShell>
  <LinearShell.Sidebar>
    <LinearShell.Sidebar.Header icon={<Logo />} label="Acme" />
    <LinearShell.Sidebar.Body>
      <LinearShell.Section>
        <LinearShell.Item icon={<Inbox />} active>Inbox</LinearShell.Item>
        <LinearShell.Item icon={<CircleDot />}>My Issues</LinearShell.Item>
      </LinearShell.Section>
    </LinearShell.Sidebar.Body>
    <LinearShell.Help />
  </LinearShell.Sidebar>
  <LinearShell.Main>
    <LinearShell.TopBar>{/* … */}</LinearShell.TopBar>
    <LinearShell.Content>{children}</LinearShell.Content>
  </LinearShell.Main>
</LinearShell>
```

### `linear-agent-shell` &nbsp;·&nbsp; Full AI conversation surface

A complete user↔agent conversation page combining LinearShell + GlassAvatar + ThinkingSteps + ThinkingIndicator + Markdown + ClaudeInput. Drops straight into `app/page.tsx` — no boilerplate. Includes realistic example data showing completed chain-of-thought, syntax-highlighted code in markdown replies, a live "agent is thinking" cycling word, and the Claude-style composer.

```tsx
import { LinearAgentShell } from "@/components/linear-agent-shell";

export default function Page() {
  return <LinearAgentShell />;
}
```

<br />

## Components

### 🧠 AI Agent UI &nbsp;·&nbsp; `agent-*` &nbsp;(20)

Production-ready agentic interfaces. All consume Vercel AI SDK's `UIMessage[]` and respond to `useChat()` state transitions.

| Component | Purpose |
|---|---|
| `agent-chat` | Drop-in chat shell. Wraps MessageList + InputBar, dispatches tool renderers. |
| `agent-message-list` | Streaming message list. Handles tool parts, copy actions, image lightbox. |
| `agent-input-bar` | Composer with suggestions, attachments, model picker, mode selector. |
| `agent-markdown` | Streaming markdown via Streamdown + Shiki (light/dark code themes). |
| `agent-user-message` | Contrast-aware user bubble with custom theme tokens. |
| `agent-error-message` | Error card for failed tool calls or model errors. |
| `agent-text-shimmer` | Streaming-token skeleton with shimmer animation. |
| `agent-spiral-loader` | Lottie-driven spiral spinner for agent-thinking states. |
| `agent-bash-tool` | Terminal tool renderer with ANSI color output. |
| `agent-edit-tool` | File diff viewer with approval footer (`@pierre/diffs`). |
| `agent-search-tool` | Web search results grid. |
| `agent-todo-tool` | Animated checklist with state transitions. |
| `agent-plan-tool` | Task/step breakdown for agent planning. |
| `agent-thinking-tool` | Collapsible chain-of-thought reasoning panel. |
| `agent-mcp-tool` | Model Context Protocol tool renderer. |
| `agent-subagent-tool` | Nested agent invocation card. |
| `agent-generic-tool` | Fallback renderer for unknown tool types. |
| `agent-tool-group` | Groups multiple tool calls into one collapsible card. |
| `agent-question-tool` | Clarifying questions UI (single/multi/free-text). |
| `claude-input` | Claude-style landing composer (model menu, attachments, voice, chips). |

### 🛠️ AI SDK Pro Blocks &nbsp;·&nbsp; `claude-* / cursor-* / openai-*` &nbsp;(7)

Battle-tested AI block patterns from across the ecosystem.

`claude-email-tool` · `claude-recipe-tool` · `claude-map-itinerary-tool` · `claude-recommend-apps-tool` · `cursor-questions-panel` · `openai-chat-image`

### 🎨 Fluid Primitives &nbsp;(20)

Refined web primitives with proximity hover, spring physics, and elevation system.

`accordion` · `badge` · `button` · `checkbox-group` · `color-picker` · `dialog` · `dropdown` · `input-copy` · `input-group` · `radio-group` · `select` · `slider` · `switch` · `table` · `tabs` · `tabs-subtle` · `thinking-indicator` · `thinking-steps` · `tooltip`

### 📊 Tables &nbsp;`p-table-*` &nbsp;(5)

`p-table-2` · `p-table-3` (selectable + paginated) · `p-table-4` (flights/status) · `p-table-6` · `p-table-8`

### 🔤 Inputs &nbsp;`p-input-*` &nbsp;(4)

`p-input-11` (with `Kbd` shortcut) · `p-input-group-20` (search) · `p-input-group-23` (search + mic + loader) · `p-autocomplete-12` (async combobox)

### 🪟 Frames &nbsp;`p-frame-*` &nbsp;(4)

`p-frame-1` · `p-frame-2` (header + panel) · `p-frame-3` (split) · `p-frame-4` (separator + sections)

### 💎 Surface Blocks &nbsp;`p-card-* / p-sheet-* / p-command-*` &nbsp;(4)

`p-card-11` (empty-state) · `p-sheet-2` (form sheet) · `p-command-1` · `p-command-2` (command palette with autocomplete)

### 📐 Layouts &nbsp;(2)

`linear-shell` · `linear-agent-shell` — see [Featured layouts](#featured-layouts)

### ✨ Effects &nbsp;(1)

`border-beam` — Animated traveling glow border. Web port of the React Native original. Sizes (sm / md / line), 4 color variants (colorful / mono / ocean / sunset), dark / light themes, configurable duration, brightness, hue range.

### 📅 Calendar &nbsp;(5)

`calendar` (react-day-picker v10) · `calendar-pricing` · `calendar-with-date-input` · `calendar-with-time` · `date-picker-presets`

### 👤 Avatar &nbsp;(6)

`avatar` (Radix-based) · `avatar-generators` (DiceBear + Jazzicon + spell.sh) · `avatar-group` · `avatar-button` · `avatar-select` · `member-filter`

### 📋 Form &nbsp;(1)

`theme-card-radio` — Visual theme selector with image previews.

<br />

## Examples

### Build a Vercel AI SDK chat in 30 seconds

```bash
npx shadcn@latest add https://cdn.jsdelivr.net/gh/Eldergenix/NexUI-Agentic-UI-Components@main/public/r/agent-chat.json
```

```tsx
"use client";
import { useChat } from "@ai-sdk/react";
import { AgentChat } from "@/components/agent-elements/agent-chat";

export default function ChatPage() {
  const chat = useChat();
  return <AgentChat chat={chat} />;
}
```

That's the entire client. Wire a backend with `streamText` from `ai` and you have a complete AI chat with tool calling, streaming markdown, syntax-highlighted code, and full theming.

### Render any tool call

```tsx
import { ToolRenderer } from "@/components/agent-elements/tools/tool-renderer";

// In your MessageList render loop, for any UIMessage tool part:
<ToolRenderer part={toolPart} chatStatus={status} />
```

Recognizes `Bash`, `Edit`, `Search`, `Todo`, `Plan`, `Thinking`, `Subagent`, MCP tools, and falls back to a generic card for unknown tools.

### Animated agent-thinking states

```tsx
import { ThinkingIndicator } from "@/components/thinking-indicator";
import {
  ThinkingSteps,
  ThinkingStepsHeader,
  ThinkingStepsContent,
  ThinkingStep,
} from "@/components/thinking-steps";

// Live state — cycles "Thinking → Moonwalking → Planning → Refining"
<ThinkingIndicator />

// Completed reasoning — collapsible chain-of-thought
<ThinkingSteps>
  <ThinkingStepsHeader>Thought for 8 seconds</ThinkingStepsHeader>
  <ThinkingStepsContent>
    <ThinkingStep index={0} label="Read auth middleware" status="complete" />
    <ThinkingStep index={1} label="Trace SSO callback" status="complete" />
    <ThinkingStep index={2} label="Compare JWT claims" status="complete" isLast />
  </ThinkingStepsContent>
</ThinkingSteps>
```

### Glass avatar

```tsx
import { GlassAvatar } from "@/components/linear-agent-shell";

<GlassAvatar variant="user"  fallback="JS" alt="Jane" />
<GlassAvatar variant="agent" fallback={<Sparkles />} alt="Agent" />
```

Frosted-glass effect using `color-mix(in oklab, var(--foreground) N%, transparent)` — the tint auto-inverts in dark mode because `--foreground` is dark in light mode and light in dark mode.

<br />

## Tech stack

| Layer | Choice |
|---|---|
| Framework | Next.js 15 (App Router, Turbopack) |
| UI | React 19 + Tailwind CSS v4 |
| Primitives | Radix UI + Base UI (both supported) |
| Animation | Framer Motion / Motion |
| AI | Vercel AI SDK v6 (`ai` + `@ai-sdk/react`) |
| Markdown | Streamdown + Shiki + `@streamdown/code` |
| Theme | OKLch design tokens, `class`-based dark mode |
| Icons | Lucide + Tabler + Hugeicons + Phosphor (icon-library context lets users swap) |

<br />

## Browse the registry

The full machine-readable index lives at [`public/r/registry.json`](public/r/registry.json) — 90+ items each with their own JSON manifest. Programmatic install via the official shadcn CLI:

```bash
# List all items
curl -s https://cdn.jsdelivr.net/gh/Eldergenix/NexUI-Agentic-UI-Components@main/public/r/registry.json | jq '.items[] | .name'

# Install any item by name
npx shadcn@latest add https://cdn.jsdelivr.net/gh/Eldergenix/NexUI-Agentic-UI-Components@main/public/r/<name>.json
```

Each manifest declares its npm dependencies, registry dependencies (other NexUI items it requires), and a list of files to install. shadcn handles the recursive resolution.

<br />

## Local development

```bash
# Clone the registry repo
git clone https://github.com/Eldergenix/NexUI-Agentic-UI-Components.git
cd NexUI-Agentic-UI-Components

# Install + run the docs/demo site
pnpm install
pnpm dev                 # → http://localhost:3000

# Rebuild the registry JSONs after editing registry.json
pnpm registry:build

# Override the CDN base URL for the published registry
NEXUI_REGISTRY_URL="https://your-domain.com/r" pnpm registry:build
```

<br />

## Roadmap

- [ ] AI artifact components (Claude-style streaming artifacts, OpenAI Canvas-style editors)
- [ ] MCP server registry components (server cards, connection status, tool discovery UI)
- [ ] Voice agent UI (waveform, push-to-talk, transcript)
- [ ] Vercel AI Gateway-aware components (model fallback indicators, observability badges)
- [ ] More layout variants (Vercel-style, Notion-style, Slack-style shells)

<br />

## Contributing

PRs welcome. Please open an issue first for substantial changes so we can align on scope and design tokens.

1. Fork and clone
2. `pnpm install && pnpm dev`
3. Add your component to `registry/default/<name>.tsx`
4. Add a doc page to `app/docs/<slug>/page.tsx`
5. Register it in `registry.json`, `lib/docs/components.ts`, and `scripts/postbuild-registry.mjs` (the `CUSTOM_ITEMS` set)
6. Run `pnpm registry:build` to regenerate `public/r/*.json`
7. Open a PR

<br />

## Acknowledgments

NexUI stands on three foundations: **Fluid Functionalism** (refined web primitives, spring physics, elevation system), **Agent Elements** (the 21st.dev agent UI kit), and selected blocks from **aisdkagents.com** (Claude/Cursor/OpenAI pro patterns) and **coss.com/ui** (tables, frames, command palettes). The unification, layouts, blocks, and theming work in this repo is by **Eldergenix** — every component now uses a single token system and ships as one installable registry.

<br />

## License

MIT © [Eldergenix](https://x.com/elderatlantean)

<br />

## Author

**Eldergenix** &nbsp; &mdash; &nbsp; [@elderatlantean on X](https://x.com/elderatlantean) &nbsp; · &nbsp; [GitHub](https://github.com/Eldergenix)

If NexUI ships your AI agent product, **a ⭐ on the repo** means a lot.

<br />

---

<sub>
<strong>Keywords</strong> · shadcn registry · shadcn ui · AI SDK v6 · Vercel AI SDK · AI agent UI · agentic UI · AI chat components · streaming UI · tool calling UI · thinking indicator · AI artifacts · MCP · Model Context Protocol · Claude UI · Next.js 15 · React 19 · Tailwind v4 · NexUI · Linear-style shell · glass avatar · BorderBeam · ChatGPT clone · Claude clone · AI artifacts UI · multi-agent UI · agent shell · plan and implement · evaluator-optimizer · streaming chat · Vercel AI Gateway components
</sub>
