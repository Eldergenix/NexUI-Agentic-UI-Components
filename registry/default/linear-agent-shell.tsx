"use client";

/**
 * LinearAgentShell — example block composing the nexUI registry:
 *
 *   • LinearShell      — Linear-style application chrome (244px sidebar + framed card)
 *   • GlassAvatar      — inline frosted-glass avatar treatment (user + agent)
 *   • ThinkingSteps    — completed chain-of-thought reasoning panel
 *   • ThinkingIndicator— "agent is thinking" cycling word + morphing SVG
 *   • Markdown         — streaming-friendly markdown for assistant replies
 *   • ClaudeInput      — Claude-style prompt composer at the conversation foot
 *
 * The whole block is theme-adaptive: every color is sourced from nexUI tokens
 * (bg-background, bg-card, bg-accent, text-muted-foreground, border-border)
 * plus `color-mix(in oklab, var(--foreground) Nx%, transparent)` for the
 * glass-effect overlays. No hex literals.
 */

import * as React from "react";
import {
  Bell,
  Box,
  CheckCircle2,
  ChevronDown,
  CircleDot,
  FileSearch,
  GitBranch,
  Inbox,
  Layers,
  Map as MapIcon,
  Network,
  Plus,
  Sparkles,
  TimerReset,
  Wand2,
} from "lucide-react";

import { cn } from "@/registry/default/lib/utils";
import { LinearShell } from "@/registry/default/linear-shell";
import { ThinkingIndicator } from "@/registry/default/thinking-indicator";
import {
  ThinkingStep,
  ThinkingSteps,
  ThinkingStepsContent,
  ThinkingStepsHeader,
} from "@/registry/default/thinking-steps";
import { Markdown } from "@/registry/default/agent-ui/components/markdown";
import { ClaudeInput } from "@/components/ai-components/claude-input";

// ─── GlassAvatar ────────────────────────────────────────────────────────────
//
// Frosted-glass avatar. Uses semantic-token mixes so the surface tint adapts
// to light + dark themes without conditional logic. Two tonal variants:
//   - "user": foreground-tinted glass (cool, neutral)
//   - "agent": foreground-tinted glass + a soft inset highlight (warmer)

export interface GlassAvatarProps
  extends React.HTMLAttributes<HTMLDivElement> {
  /** Image URL. If omitted, `fallback` is rendered. */
  src?: string;
  /** Initials or icon shown when no image is available. */
  fallback?: React.ReactNode;
  /** Visual tone of the glass. */
  variant?: "user" | "agent";
  /** Size preset. */
  size?: "sm" | "md" | "lg";
  alt?: string;
}

const sizeMap = {
  sm: "size-6 text-[10px]",
  md: "size-8 text-[11px]",
  lg: "size-10 text-[12px]",
} as const;

export const GlassAvatar = React.forwardRef<HTMLDivElement, GlassAvatarProps>(
  (
    {
      className,
      src,
      fallback,
      variant = "user",
      size = "md",
      alt = "",
      ...props
    },
    ref,
  ) => {
    const tint =
      variant === "agent"
        ? // Slightly warmer/brighter glass for the agent
          "bg-[color-mix(in_oklab,var(--foreground)_6%,transparent)] ring-1 ring-[color-mix(in_oklab,var(--foreground)_14%,transparent)]"
        : // Cool neutral glass for the human
          "bg-[color-mix(in_oklab,var(--foreground)_4%,transparent)] ring-1 ring-[color-mix(in_oklab,var(--foreground)_10%,transparent)]";

    return (
      <div
        ref={ref}
        aria-hidden={!alt}
        className={cn(
          "relative shrink-0 rounded-full overflow-hidden",
          "backdrop-blur-md backdrop-saturate-150",
          // Inset specular highlight + soft drop. Works on both light + dark
          // because the highlight is rgb-white at low alpha and the drop is
          // black at low alpha — both subtle on any surface.
          "shadow-[inset_0_1px_0_rgba(255,255,255,0.18),_inset_0_-1px_0_rgba(0,0,0,0.04),_0_2px_6px_-3px_rgba(0,0,0,0.18)]",
          tint,
          sizeMap[size],
          "flex items-center justify-center",
          "font-medium text-foreground/85",
          "transition-shadow",
          className,
        )}
        {...props}
      >
        {src ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={src}
            alt={alt}
            className="absolute inset-0 w-full h-full object-cover"
          />
        ) : (
          <span className="relative">{fallback}</span>
        )}

        {/* Subtle upper-left specular highlight — pure CSS, gives the
            characteristic glass "shine" without any image asset. */}
        <span
          aria-hidden
          className="pointer-events-none absolute inset-0 rounded-full"
          style={{
            background:
              "radial-gradient(120% 80% at 20% 12%, rgba(255,255,255,0.22) 0%, rgba(255,255,255,0) 55%)",
            mixBlendMode: "screen",
          }}
        />
      </div>
    );
  },
);
GlassAvatar.displayName = "GlassAvatar";

// ─── MessageRow ─────────────────────────────────────────────────────────────

interface MessageRowProps {
  role: "user" | "agent";
  authorName: string;
  authorMeta?: string;
  avatar: React.ReactNode;
  children: React.ReactNode;
}

function MessageRow({
  role,
  authorName,
  authorMeta,
  avatar,
  children,
}: MessageRowProps) {
  return (
    <article className="flex flex-row gap-3 px-6 py-4">
      <div className="pt-0.5">{avatar}</div>
      <div className="min-w-0 flex-1">
        <header className="flex items-baseline gap-2 pb-1.5">
          <h3 className="text-[13px] font-semibold tracking-tight text-foreground">
            {authorName}
          </h3>
          {authorMeta && (
            <span className="text-[11px] text-muted-foreground">
              {authorMeta}
            </span>
          )}
          {role === "agent" && (
            <span className="inline-flex items-center gap-1 text-[11px] text-muted-foreground">
              <Sparkles className="size-2.5" />
              agent
            </span>
          )}
        </header>
        <div className="text-[14px] leading-[1.55] text-foreground/90 [&_p:not(:last-child)]:mb-2">
          {children}
        </div>
      </div>
    </article>
  );
}

// ─── LinearAgentShell (the example block) ──────────────────────────────────

export interface LinearAgentShellProps
  extends React.HTMLAttributes<HTMLDivElement> {}

export const LinearAgentShell = React.forwardRef<
  HTMLDivElement,
  LinearAgentShellProps
>(({ className, ...props }, ref) => {
  return (
    <div
      ref={ref}
      className={cn("flex h-full w-full bg-background", className)}
      {...props}
    >
      <LinearShell>
        {/* ── Sidebar ────────────────────────────────────────────────── */}
        <LinearShell.Sidebar>
          <LinearShell.Sidebar.Header icon={<Network />} label="nexUI" />

          <LinearShell.Sidebar.Body>
            <LinearShell.Section>
              <LinearShell.Item icon={<Inbox className="size-4" />}>
                Inbox
              </LinearShell.Item>
              <LinearShell.Item icon={<CircleDot className="size-4" />}>
                My Issues
              </LinearShell.Item>
            </LinearShell.Section>

            <LinearShell.Section label="Conversations">
              <LinearShell.Item
                icon={<Wand2 className="size-4" />}
                active
              >
                Auth flow debug
              </LinearShell.Item>
              <LinearShell.Item icon={<FileSearch className="size-4" />}>
                Project plan v3
              </LinearShell.Item>
              <LinearShell.Item icon={<GitBranch className="size-4" />}>
                Refactor checkout
              </LinearShell.Item>
              <LinearShell.Item icon={<TimerReset className="size-4" />}>
                Release notes Q4
              </LinearShell.Item>
            </LinearShell.Section>

            <LinearShell.Section label="Workspace">
              <LinearShell.Item icon={<Layers className="size-4" />}>
                Initiatives
              </LinearShell.Item>
              <LinearShell.Item icon={<MapIcon className="size-4" />}>
                Roadmap
              </LinearShell.Item>
              <LinearShell.Item
                icon={<Sparkles className="size-4" />}
                indicator={<LinearShell.Dot variant="rose" />}
              >
                Customer Requests
              </LinearShell.Item>
            </LinearShell.Section>

            <LinearShell.Section label="Your teams">
              <LinearShell.Item icon={<Box className="size-4" />}>
                Issues
              </LinearShell.Item>
              <LinearShell.Item icon={<CheckCircle2 className="size-4" />}>
                Active Cycle
              </LinearShell.Item>
            </LinearShell.Section>
          </LinearShell.Sidebar.Body>

          <LinearShell.Help />
        </LinearShell.Sidebar>

        {/* ── Main column ───────────────────────────────────────────── */}
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
            <div className="flex h-full flex-col">
              {/* Thread header */}
              <div className="flex items-center justify-between border-b border-border px-6 py-3">
                <div className="flex items-center gap-2">
                  <Wand2 className="size-4 text-muted-foreground" />
                  <h1 className="text-[14px] font-semibold tracking-tight">
                    Auth flow debug
                  </h1>
                  <span className="text-[12px] text-muted-foreground">
                    · 6 messages
                  </span>
                </div>
                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    className="inline-flex items-center gap-1 h-7 px-2 rounded-md text-[12px] font-medium text-muted-foreground hover:bg-[color-mix(in_oklab,var(--foreground)_6%,transparent)] hover:text-foreground transition-colors outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  >
                    Share
                    <ChevronDown className="size-3" />
                  </button>
                  <button
                    type="button"
                    aria-label="New conversation"
                    className="inline-flex items-center justify-center size-7 rounded-md text-muted-foreground hover:bg-[color-mix(in_oklab,var(--foreground)_6%,transparent)] hover:text-foreground transition-colors outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  >
                    <Plus className="size-3.5" />
                  </button>
                </div>
              </div>

              {/* Scrollable conversation */}
              <div className="flex-1 min-h-0 overflow-y-auto divide-y divide-border/60">
                {/* Turn 1: user → agent (completed) */}
                <MessageRow
                  role="user"
                  authorName="Jane"
                  authorMeta="2:41 PM"
                  avatar={
                    <GlassAvatar variant="user" fallback="JS" alt="Jane" />
                  }
                >
                  <p>
                    Can you investigate why the SSO auth flow is failing for
                    some users? They&apos;re getting kicked back to the login
                    screen right after the callback.
                  </p>
                </MessageRow>

                <MessageRow
                  role="agent"
                  authorName="Agent"
                  authorMeta="2:41 PM"
                  avatar={
                    <GlassAvatar
                      variant="agent"
                      fallback={<Sparkles className="size-3.5" />}
                      alt="Agent"
                    />
                  }
                >
                  <div className="space-y-3">
                    <ThinkingSteps defaultOpen={false}>
                      <ThinkingStepsHeader>
                        Thought for 8 seconds
                      </ThinkingStepsHeader>
                      <ThinkingStepsContent>
                        <ThinkingStep
                          index={0}
                          label="Read auth middleware"
                          description="lib/auth/middleware.ts (146 lines)"
                          status="complete"
                        />
                        <ThinkingStep
                          index={1}
                          label="Trace the SSO callback chain"
                          description="3 redirects, JWT exchange at step 2"
                          status="complete"
                        />
                        <ThinkingStep
                          index={2}
                          label="Compare claims against session schema"
                          description="Mismatch on the `aud` claim for new tenants"
                          status="complete"
                          isLast
                        />
                      </ThinkingStepsContent>
                    </ThinkingSteps>

                    <Markdown
                      content={`I found the cause. The SSO callback verifies the JWT \`aud\` claim against a hardcoded list of legacy tenant IDs in \`lib/auth/verify.ts\`. New tenants provisioned after **Aug 2024** aren't in that list, so verification fails silently and the user is bounced back to login.

**Fix**: replace the hardcoded list with a lookup against the \`tenants\` table:

\`\`\`ts
const tenant = await db.tenant.findUnique({ where: { id: claims.aud } });
if (!tenant) throw new AuthError("unknown_tenant");
\`\`\`

Want me to open a PR with this change plus a regression test?`}
                    />
                  </div>
                </MessageRow>

                {/* Turn 2: user → agent (currently thinking) */}
                <MessageRow
                  role="user"
                  authorName="Jane"
                  authorMeta="2:43 PM"
                  avatar={
                    <GlassAvatar variant="user" fallback="JS" alt="Jane" />
                  }
                >
                  <p>
                    Yes please. Also — could you double-check the token
                    refresh interval? I think we set it too aggressively last
                    sprint.
                  </p>
                </MessageRow>

                <MessageRow
                  role="agent"
                  authorName="Agent"
                  authorMeta="just now"
                  avatar={
                    <GlassAvatar
                      variant="agent"
                      fallback={<Sparkles className="size-3.5" />}
                      alt="Agent"
                    />
                  }
                >
                  <div className="-mx-3">
                    {/* ThinkingIndicator has its own padding */}
                    <ThinkingIndicator />
                  </div>
                </MessageRow>
              </div>

              {/* Composer */}
              <div className="shrink-0 border-t border-border bg-card px-4 py-3">
                <ClaudeInput placeholder="Reply to the agent…" />
              </div>
            </div>
          </LinearShell.Content>
        </LinearShell.Main>
      </LinearShell>
    </div>
  );
});
LinearAgentShell.displayName = "LinearAgentShell";
