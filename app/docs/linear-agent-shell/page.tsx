"use client";

import {
  LinearAgentShell,
  GlassAvatar,
} from "@/registry/default/linear-agent-shell";
import { Sparkles } from "lucide-react";

import { DocPage, DocSection } from "@/lib/docs/DocPage";
import { ComponentPreview } from "@/lib/docs/ComponentPreview";
import { PropsTable, type PropDef } from "@/lib/docs/PropsTable";
import { FullscreenPreview } from "@/lib/docs/FullscreenPreview";

const usageCode = `import { LinearAgentShell } from "@/components/linear-agent-shell";

// Drop into any page or layout — the block manages its own composition.
export default function Page() {
  return <LinearAgentShell />;
}`;

const glassAvatarCode = `import { GlassAvatar } from "@/components/linear-agent-shell";
import { Sparkles } from "lucide-react";

<GlassAvatar variant="user"  fallback="JS" alt="Jane" />
<GlassAvatar variant="agent" fallback={<Sparkles />} alt="Agent" />
<GlassAvatar variant="user"  fallback="JS" size="lg" />`;

const compositionCode = `<LinearShell>
  <LinearShell.Sidebar>{/* … */}</LinearShell.Sidebar>
  <LinearShell.Main>
    <LinearShell.TopBar>{/* … */}</LinearShell.TopBar>
    <LinearShell.Content>
      <ConversationThread>
        <MessageRow role="user" avatar={<GlassAvatar variant="user" />}>
          {userPrompt}
        </MessageRow>

        <MessageRow role="agent" avatar={<GlassAvatar variant="agent" />}>
          <ThinkingSteps>
            <ThinkingStepsHeader>Thought for 8s</ThinkingStepsHeader>
            <ThinkingStepsContent>
              <ThinkingStep label="Read auth middleware"  status="complete" />
              <ThinkingStep label="Trace SSO callback"    status="complete" />
              <ThinkingStep label="Compare JWT claims"    status="complete" isLast />
            </ThinkingStepsContent>
          </ThinkingSteps>
          <Markdown content={agentReply} />
        </MessageRow>

        <MessageRow role="agent" avatar={<GlassAvatar variant="agent" />}>
          <ThinkingIndicator />
        </MessageRow>
      </ConversationThread>

      <ClaudeInput placeholder="Reply to the agent…" />
    </LinearShell.Content>
  </LinearShell.Main>
</LinearShell>`;

const glassAvatarProps: PropDef[] = [
  { name: "variant", type: '"user" | "agent"', default: '"user"', description: "Tonal variant. \"agent\" uses a slightly warmer/brighter glass tint." },
  { name: "size", type: '"sm" | "md" | "lg"', default: '"md"', description: "Diameter preset. sm=24px, md=32px, lg=40px." },
  { name: "src", type: "string", description: "Optional image URL. Falls back to `fallback` if omitted." },
  { name: "fallback", type: "ReactNode", description: "Initials, icon, or any node rendered when no image is provided." },
  { name: "alt", type: "string", default: '""', description: "Alt text. When empty, the avatar is marked aria-hidden." },
];

export default function LinearAgentShellDoc() {
  return (
    <DocPage
      title="Linear Agent Shell"
      slug="linear-agent-shell"
      description="Example block composing LinearShell + GlassAvatar + ThinkingSteps + ThinkingIndicator + Markdown + ClaudeInput. A full conversation surface ready to drop into a Next.js page or layout — fully theme-adaptive via nexUI tokens."
    >
      <DocSection title="Preview">
        <ComponentPreview code={usageCode}>
          <FullscreenPreview height="640px">
            <LinearAgentShell />
          </FullscreenPreview>
        </ComponentPreview>
      </DocSection>

      <DocSection title="Glass avatars">
        <ComponentPreview code={glassAvatarCode}>
          <div className="flex items-end gap-6 py-6 px-4">
            <div className="flex flex-col items-center gap-2">
              <GlassAvatar variant="user" fallback="JS" alt="Jane" />
              <span className="text-[11px] text-muted-foreground">user · md</span>
            </div>
            <div className="flex flex-col items-center gap-2">
              <GlassAvatar
                variant="agent"
                fallback={<Sparkles className="size-3.5" />}
                alt="Agent"
              />
              <span className="text-[11px] text-muted-foreground">agent · md</span>
            </div>
            <div className="flex flex-col items-center gap-2">
              <GlassAvatar variant="user" fallback="JS" size="sm" alt="Jane" />
              <span className="text-[11px] text-muted-foreground">user · sm</span>
            </div>
            <div className="flex flex-col items-center gap-2">
              <GlassAvatar variant="user" fallback="JS" size="lg" alt="Jane" />
              <span className="text-[11px] text-muted-foreground">user · lg</span>
            </div>
            <div className="flex flex-col items-center gap-2">
              <GlassAvatar
                variant="agent"
                fallback={<Sparkles className="size-4" />}
                size="lg"
                alt="Agent"
              />
              <span className="text-[11px] text-muted-foreground">agent · lg</span>
            </div>
          </div>
        </ComponentPreview>
      </DocSection>

      <DocSection title="Composition recipe">
        <ComponentPreview code={compositionCode}>
          <div className="text-[13px] leading-relaxed text-muted-foreground space-y-2 max-w-prose px-2">
            <p>
              The block is a single composition recipe. Each region is a
              standalone registry item you can install independently — swap
              <code className="font-mono text-foreground"> ClaudeInput</code> for{" "}
              <code className="font-mono text-foreground">agent-input-bar</code>,
              replace <code className="font-mono text-foreground">ThinkingSteps</code> with{" "}
              <code className="font-mono text-foreground">agent-thinking-tool</code>,
              etc.
            </p>
            <p>
              Every color in the block resolves through nexUI&apos;s semantic
              tokens, so the glass tints, surface elevation, active items, and
              status indicators all flip cleanly between light and dark — no
              theme prop required.
            </p>
            <ul className="list-disc pl-5 space-y-1">
              <li>
                <code className="font-mono text-foreground">LinearShell.Content</code>{" "}
                wraps the thread; flex column makes the composer sticky to the bottom.
              </li>
              <li>
                <code className="font-mono text-foreground">GlassAvatar</code>{" "}
                uses <code className="font-mono">color-mix(in oklab, var(--foreground) N%, transparent)</code>{" "}
                for the frosted tint so it auto-inverts in dark mode.
              </li>
              <li>
                <code className="font-mono text-foreground">ThinkingSteps</code>{" "}
                is collapsed by default to mimic Claude/ChatGPT&apos;s "Thought for Xs" affordance.
              </li>
              <li>
                <code className="font-mono text-foreground">ThinkingIndicator</code>{" "}
                cycles "Thinking → Moonwalking → Planning → Refining" with a morphing SVG —
                the canonical "agent is working" signal.
              </li>
            </ul>
          </div>
        </ComponentPreview>
      </DocSection>

      <DocSection title="API — GlassAvatar">
        <PropsTable props={glassAvatarProps} />
      </DocSection>
    </DocPage>
  );
}
