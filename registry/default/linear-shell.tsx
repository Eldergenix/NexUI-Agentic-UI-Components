"use client";

/**
 * LinearShell — a Linear.app-inspired application shell layout.
 *
 * Replicates the geometry of Linear's main UI (244px sidebar, scrollable nav
 * with grouped sections + group headings, framed content card with a 32px
 * top action bar and a floating help affordance) while mapping every color
 * to nexUI's semantic tokens so it adapts to light + dark themes automatically.
 *
 * Compound API — every visual region is its own subcomponent, so consumers
 * can swap pieces without rebuilding the framing.
 *
 *   <LinearShell>
 *     <LinearShell.Sidebar>
 *       <LinearShell.Sidebar.Header icon={<Logo />} label="Acme" />
 *       <LinearShell.Sidebar.Body>
 *         <LinearShell.Section>
 *           <LinearShell.Item icon={<Inbox />} active>Inbox</LinearShell.Item>
 *         </LinearShell.Section>
 *         <LinearShell.Section label="Workspace">
 *           <LinearShell.Item icon={<Folder />}>Projects</LinearShell.Item>
 *           <LinearShell.Item icon={<Sparkles />} indicator={<LinearShell.Dot />}>
 *             Try new feature
 *           </LinearShell.Item>
 *         </LinearShell.Section>
 *       </LinearShell.Sidebar.Body>
 *       <LinearShell.Help />
 *     </LinearShell.Sidebar>
 *     <LinearShell.Main>
 *       <LinearShell.TopBar>
 *         <LinearShell.TopBarAction icon={<Inbox />}>Inbox</LinearShell.TopBarAction>
 *         <LinearShell.TopBarAction icon={<Bell />} iconOnly />
 *       </LinearShell.TopBar>
 *       <LinearShell.Content>
 *         {children}
 *       </LinearShell.Content>
 *     </LinearShell.Main>
 *   </LinearShell>
 */

import * as React from "react";
import { cn } from "@/registry/default/lib/utils";
import { ChevronDown, HelpCircle } from "lucide-react";

// ─── Root ───────────────────────────────────────────────────────────────────

export interface LinearShellProps
  extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

const Root = React.forwardRef<HTMLDivElement, LinearShellProps>(
  ({ className, children, ...props }, ref) => (
    <div
      ref={ref}
      data-slot="linear-shell"
      className={cn(
        "relative flex flex-row items-stretch w-full h-full min-h-[600px] bg-background text-foreground",
        className,
      )}
      {...props}
    >
      {children}
    </div>
  ),
);
Root.displayName = "LinearShell";

// ─── Sidebar ────────────────────────────────────────────────────────────────

const Sidebar = React.forwardRef<HTMLElement, React.HTMLAttributes<HTMLElement>>(
  ({ className, children, ...props }, ref) => (
    <nav
      ref={ref}
      aria-label="Primary"
      data-slot="linear-shell-sidebar"
      className={cn(
        "relative flex flex-col w-[244px] shrink-0 h-full bg-background",
        className,
      )}
      {...props}
    >
      {children}
    </nav>
  ),
);
Sidebar.displayName = "LinearShellSidebar";

export interface LinearShellSidebarHeaderProps
  extends React.HTMLAttributes<HTMLDivElement> {
  icon?: React.ReactNode;
  label?: React.ReactNode;
  /** Replace the default chevron with custom trailing content. */
  trailing?: React.ReactNode;
}

const SidebarHeader = React.forwardRef<
  HTMLDivElement,
  LinearShellSidebarHeaderProps
>(({ className, children, icon, label, trailing, ...props }, ref) => (
  <div
    ref={ref}
    data-slot="linear-shell-sidebar-header"
    className={cn("flex flex-col px-3 pt-2 pb-0 shrink-0", className)}
    {...props}
  >
    <div className="flex flex-row items-center pl-1 h-[44.5px]">
      {children ?? (
        <button
          type="button"
          className={cn(
            "inline-flex items-center gap-1.5 h-7 pl-1.5 pr-3 rounded-full",
            "text-[13px] font-medium text-muted-foreground",
            "transition-colors hover:bg-[color-mix(in_oklab,var(--foreground)_6%,transparent)] hover:text-foreground",
            "outline-none focus-visible:ring-2 focus-visible:ring-ring",
          )}
        >
          {icon && (
            <span className="shrink-0 inline-flex items-center justify-center size-3.5 [&_svg]:size-3.5">
              {icon}
            </span>
          )}
          {label}
          {trailing ?? <ChevronDown className="size-3 opacity-60" />}
        </button>
      )}
    </div>
  </div>
));
SidebarHeader.displayName = "LinearShellSidebarHeader";

const SidebarBody = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, children, ...props }, ref) => (
  <div
    ref={ref}
    data-slot="linear-shell-sidebar-body"
    className={cn(
      "flex flex-col flex-1 min-h-0 overflow-y-auto px-3 pt-1 pb-12 gap-4",
      // Hide scrollbar (Linear-style) while keeping scrollability
      "[scrollbar-width:none] [&::-webkit-scrollbar]:hidden",
      className,
    )}
    {...props}
  >
    {children}
  </div>
));
SidebarBody.displayName = "LinearShellSidebarBody";

// ─── Section + Item ─────────────────────────────────────────────────────────

export interface LinearShellSectionProps
  extends React.HTMLAttributes<HTMLDivElement> {
  /** Optional small section header rendered above the items. */
  label?: React.ReactNode;
}

const Section = React.forwardRef<HTMLDivElement, LinearShellSectionProps>(
  ({ className, label, children, ...props }, ref) => (
    <section
      ref={ref}
      data-slot="linear-shell-section"
      className={cn("flex flex-col gap-px", className)}
      {...props}
    >
      {label && (
        <h2 className="flex items-center pl-2.5 h-4 text-[13px] font-medium text-muted-foreground tracking-tight">
          {label}
        </h2>
      )}
      {children}
    </section>
  ),
);
Section.displayName = "LinearShellSection";

export interface LinearShellItemProps
  extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, "type"> {
  icon?: React.ReactNode;
  active?: boolean;
  /** Rendered right-aligned (e.g. <LinearShell.Dot /> or a count badge). */
  indicator?: React.ReactNode;
}

const Item = React.forwardRef<HTMLButtonElement, LinearShellItemProps>(
  (
    { className, icon, active, indicator, children, ...props },
    ref,
  ) => (
    <button
      ref={ref}
      type="button"
      data-slot="linear-shell-item"
      data-active={active || undefined}
      aria-current={active ? "page" : undefined}
      className={cn(
        "group flex flex-row items-center w-full h-7 pl-2.5 pr-2 rounded-lg text-left",
        "text-[13px] font-medium transition-colors outline-none",
        "focus-visible:ring-2 focus-visible:ring-ring",
        active
          ? "bg-accent text-foreground"
          : "text-muted-foreground hover:bg-[color-mix(in_oklab,var(--foreground)_6%,transparent)] hover:text-foreground",
        className,
      )}
      {...props}
    >
      {icon && (
        <span
          aria-hidden
          className={cn(
            "shrink-0 inline-flex items-center justify-center size-4 [&_svg]:size-4",
            active
              ? "text-foreground"
              : "text-muted-foreground group-hover:text-foreground",
          )}
        >
          {icon}
        </span>
      )}
      <span className="flex-1 truncate pl-2">{children}</span>
      {indicator && (
        <span className="ml-1 inline-flex items-center shrink-0">{indicator}</span>
      )}
    </button>
  ),
);
Item.displayName = "LinearShellItem";

// ─── Indicator dot (rose / info / success / warning) ────────────────────────

export interface LinearShellDotProps
  extends React.HTMLAttributes<HTMLSpanElement> {
  /** Color variant. `rose` is the Linear-style "new" highlight. */
  variant?: "rose" | "info" | "success" | "warning" | "neutral";
}

const Dot = React.forwardRef<HTMLSpanElement, LinearShellDotProps>(
  ({ className, variant = "rose", ...props }, ref) => {
    const color = {
      rose: "bg-rose-500",
      info: "bg-[var(--info)]",
      success: "bg-[var(--success)]",
      warning: "bg-[var(--warning)]",
      neutral: "bg-muted-foreground",
    }[variant];
    return (
      <span
        ref={ref}
        aria-hidden
        data-slot="linear-shell-dot"
        className={cn("size-1.5 rounded-full", color, className)}
        {...props}
      />
    );
  },
);
Dot.displayName = "LinearShellDot";

// ─── Floating help button (bottom-left of sidebar) ──────────────────────────

const Help = React.forwardRef<
  HTMLButtonElement,
  React.ButtonHTMLAttributes<HTMLButtonElement>
>(({ className, children, ...props }, ref) => (
  <div
    aria-hidden={false}
    className="absolute left-2.5 bottom-2 z-10"
  >
    <button
      ref={ref}
      type="button"
      aria-label="Help"
      data-slot="linear-shell-help"
      className={cn(
        "inline-flex items-center justify-center size-6 rounded-xl",
        "bg-background text-muted-foreground",
        // Surface-2-ish: subtle ring + 2-layer drop shadow to lift it off the sidebar
        "ring-1 ring-border shadow-[0_4px_4px_-1px_rgba(0,0,0,0.04),_0_1px_1px_rgba(0,0,0,0.08)]",
        "transition-colors hover:bg-[color-mix(in_oklab,var(--foreground)_6%,transparent)] hover:text-foreground",
        "outline-none focus-visible:ring-2 focus-visible:ring-ring",
        className,
      )}
      {...props}
    >
      {children ?? <HelpCircle className="size-3.5" />}
    </button>
  </div>
));
Help.displayName = "LinearShellHelp";

// ─── Main column ────────────────────────────────────────────────────────────

const Main = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, children, ...props }, ref) => (
  <div
    ref={ref}
    data-slot="linear-shell-main"
    className={cn(
      "flex flex-col flex-1 min-w-0 min-h-0 h-full bg-background",
      className,
    )}
    {...props}
  >
    {children}
  </div>
));
Main.displayName = "LinearShellMain";

// ─── Top bar ────────────────────────────────────────────────────────────────

const TopBar = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, children, ...props }, ref) => (
  <div
    ref={ref}
    data-slot="linear-shell-topbar"
    className={cn(
      "flex flex-row items-center h-8 px-2 shrink-0 gap-0.5 justify-end",
      className,
    )}
    {...props}
  >
    {children}
  </div>
));
TopBar.displayName = "LinearShellTopBar";

export interface LinearShellTopBarActionProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  icon?: React.ReactNode;
  iconOnly?: boolean;
}

const TopBarAction = React.forwardRef<
  HTMLButtonElement,
  LinearShellTopBarActionProps
>(({ className, icon, iconOnly, children, ...props }, ref) => (
  <button
    ref={ref}
    type="button"
    data-slot="linear-shell-topbar-action"
    className={cn(
      "inline-flex items-center justify-center h-7 rounded-lg",
      "text-[12px] font-medium text-muted-foreground",
      "transition-colors outline-none",
      "hover:bg-[color-mix(in_oklab,var(--foreground)_6%,transparent)] hover:text-foreground",
      "focus-visible:ring-2 focus-visible:ring-ring",
      iconOnly ? "size-7" : "gap-1.5 pl-2 pr-3 min-w-7",
      className,
    )}
    {...props}
  >
    {icon && (
      <span className="shrink-0 inline-flex items-center justify-center size-3.5 [&_svg]:size-3.5">
        {icon}
      </span>
    )}
    {!iconOnly && children}
  </button>
));
TopBarAction.displayName = "LinearShellTopBarAction";

// ─── Content card ───────────────────────────────────────────────────────────

const Content = React.forwardRef<
  HTMLElement,
  React.HTMLAttributes<HTMLElement>
>(({ className, children, ...props }, ref) => (
  <main
    ref={ref}
    data-slot="linear-shell-content"
    className={cn(
      "relative flex-1 min-h-0 overflow-hidden rounded-xl mx-1 mb-2",
      "bg-card border border-border text-card-foreground",
      "shadow-[0_4px_4px_-1px_rgba(0,0,0,0.04),_0_1px_1px_rgba(0,0,0,0.08)]",
      className,
    )}
    {...props}
  >
    {children}
  </main>
));
Content.displayName = "LinearShellContent";

// ─── Public exports + compound namespace ────────────────────────────────────

type LinearShellComponent = typeof Root & {
  Sidebar: typeof Sidebar & {
    Header: typeof SidebarHeader;
    Body: typeof SidebarBody;
  };
  Section: typeof Section;
  Item: typeof Item;
  Dot: typeof Dot;
  Help: typeof Help;
  Main: typeof Main;
  TopBar: typeof TopBar;
  TopBarAction: typeof TopBarAction;
  Content: typeof Content;
};

const sidebarWithSlots = Object.assign(Sidebar, {
  Header: SidebarHeader,
  Body: SidebarBody,
});

export const LinearShell = Object.assign(Root, {
  Sidebar: sidebarWithSlots,
  Section,
  Item,
  Dot,
  Help,
  Main,
  TopBar,
  TopBarAction,
  Content,
}) as LinearShellComponent;

// Named re-exports for consumers who prefer not to destructure
export {
  Sidebar as LinearShellSidebar,
  SidebarHeader as LinearShellSidebarHeader,
  SidebarBody as LinearShellSidebarBody,
  Section as LinearShellSection,
  Item as LinearShellItem,
  Dot as LinearShellDot,
  Help as LinearShellHelp,
  Main as LinearShellMain,
  TopBar as LinearShellTopBar,
  TopBarAction as LinearShellTopBarAction,
  Content as LinearShellContent,
};
