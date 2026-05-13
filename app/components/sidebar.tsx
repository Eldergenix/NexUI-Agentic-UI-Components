"use client";

import { usePathname } from "next/navigation";
import { NavMenu } from "@/components/ui/nav-menu";
import { NavItem } from "@/components/ui/nav-item";
import { componentList, systemList } from "@/lib/docs/components";
import { cn } from "@/registry/default/lib/utils";


interface SidebarProps {
  mobile?: boolean;
}

export function Sidebar({ mobile }: SidebarProps) {
  const pathname = usePathname();

  const fluidList = componentList.filter((c) => !c.group || c.group === "fluid");
  const agentList = componentList.filter((c) => c.group === "agent");
  const effectList = componentList.filter((c) => c.group === "effect");
  const aiBlockList = componentList.filter((c) => c.group === "ai-block");
  const formList = componentList.filter((c) => c.group === "form");
  const calendarList = componentList.filter((c) => c.group === "calendar");
  const avatarList = componentList.filter((c) => c.group === "avatar");
  const tableList = componentList.filter((c) => c.group === "table");
  const inputBlockList = componentList.filter((c) => c.group === "input-block");
  const frameList = componentList.filter((c) => c.group === "frame");
  const surfaceBlockList = componentList.filter((c) => c.group === "surface-block");
  const layoutList = componentList.filter((c) => c.group === "layout");

  return (
    <aside
      className={cn(
        "shrink-0 w-56 overflow-y-auto p-4 flex flex-col gap-4",
        mobile
          ? "w-full"
          : "sticky top-0 h-screen hidden lg:flex"
      )}
    >
      {/* Top-level navigation */}
      <NavMenu activeSlug={pathname === "/" ? "/" : pathname === "/docs" ? "/docs" : null} aria-label="Main navigation">
        <NavItem index={0} href="/" label="Showcase" />
        <NavItem index={1} href="/docs" label="Introduction" />
      </NavMenu>

      {/* System section */}
      <div>
        <span className="text-[13px] text-muted-foreground/50 pl-1 pb-1.5 flex items-center gap-2">
          System
          <span className="text-[11px]">{systemList.length}</span>
        </span>
        <NavMenu activeSlug={pathname} aria-label="System navigation">
          {systemList.map((s, i) => (
            <NavItem
              key={s.slug}
              index={i}
              href={`/docs/${s.slug}`}
              label={s.name}
              isNew={s.isNew}
            />
          ))}
        </NavMenu>
      </div>

      {/* Fluid Components */}
      <div>
        <span className="text-[13px] text-muted-foreground/50 pl-1 pb-1.5 flex items-center gap-2">
          Fluid
          <span className="text-[11px]">{fluidList.length}</span>
        </span>
        <NavMenu activeSlug={pathname} aria-label="Fluid components navigation">
          {fluidList.map((c, i) => (
            <NavItem
              key={c.slug}
              index={i}
              href={`/docs/${c.slug}`}
              label={c.name}
              isNew={c.isNew}
            />
          ))}
        </NavMenu>
      </div>

      {/* Agent Components */}
      <div>
        <span className="text-[13px] text-muted-foreground/50 pl-1 pb-1.5 flex items-center gap-2">
          Agent
          <span className="text-[11px]">{agentList.length}</span>
        </span>
        <NavMenu activeSlug={pathname} aria-label="Agent components navigation">
          {agentList.map((c, i) => (
            <NavItem
              key={c.slug}
              index={i}
              href={`/docs/${c.slug}`}
              label={c.name}
              isNew={c.isNew}
            />
          ))}
        </NavMenu>
      </div>

      {/* Effects */}
      <div>
        <span className="text-[13px] text-muted-foreground/50 pl-1 pb-1.5 flex items-center gap-2">
          Effects
          <span className="text-[11px]">{effectList.length}</span>
        </span>
        <NavMenu activeSlug={pathname} aria-label="Effect components navigation">
          {effectList.map((c, i) => (
            <NavItem
              key={c.slug}
              index={i}
              href={`/docs/${c.slug}`}
              label={c.name}
              isNew={c.isNew}
            />
          ))}
        </NavMenu>
      </div>

      {/* AI SDK Pro Blocks */}
      <div>
        <span className="text-[13px] text-muted-foreground/50 pl-1 pb-1.5 flex items-center gap-2">
          AI Blocks
          <span className="text-[11px]">{aiBlockList.length}</span>
        </span>
        <NavMenu activeSlug={pathname} aria-label="AI Blocks navigation">
          {aiBlockList.map((c, i) => (
            <NavItem
              key={c.slug}
              index={i}
              href={`/docs/${c.slug}`}
              label={c.name}
              isNew={c.isNew}
            />
          ))}
        </NavMenu>
      </div>

      {/* Form */}
      {formList.length > 0 && (
        <div>
          <span className="text-[13px] text-muted-foreground/50 pl-1 pb-1.5 flex items-center gap-2">
            Form
            <span className="text-[11px]">{formList.length}</span>
          </span>
          <NavMenu activeSlug={pathname} aria-label="Form components navigation">
            {formList.map((c, i) => (
              <NavItem
                key={c.slug}
                index={i}
                href={`/docs/${c.slug}`}
                label={c.name}
                isNew={c.isNew}
              />
            ))}
          </NavMenu>
        </div>
      )}

      {/* Calendar */}
      {calendarList.length > 0 && (
        <div>
          <span className="text-[13px] text-muted-foreground/50 pl-1 pb-1.5 flex items-center gap-2">
            Calendar
            <span className="text-[11px]">{calendarList.length}</span>
          </span>
          <NavMenu activeSlug={pathname} aria-label="Calendar components navigation">
            {calendarList.map((c, i) => (
              <NavItem
                key={c.slug}
                index={i}
                href={`/docs/${c.slug}`}
                label={c.name}
                isNew={c.isNew}
              />
            ))}
          </NavMenu>
        </div>
      )}

      {/* Avatar */}
      {avatarList.length > 0 && (
        <div>
          <span className="text-[13px] text-muted-foreground/50 pl-1 pb-1.5 flex items-center gap-2">
            Avatar
            <span className="text-[11px]">{avatarList.length}</span>
          </span>
          <NavMenu activeSlug={pathname} aria-label="Avatar components navigation">
            {avatarList.map((c, i) => (
              <NavItem
                key={c.slug}
                index={i}
                href={`/docs/${c.slug}`}
                label={c.name}
                isNew={c.isNew}
              />
            ))}
          </NavMenu>
        </div>
      )}

      {/* Tables (coss) */}
      {tableList.length > 0 && (
        <div>
          <span className="text-[13px] text-muted-foreground/50 pl-1 pb-1.5 flex items-center gap-2">
            Tables
            <span className="text-[11px]">{tableList.length}</span>
          </span>
          <NavMenu activeSlug={pathname} aria-label="Table components navigation">
            {tableList.map((c, i) => (
              <NavItem
                key={c.slug}
                index={i}
                href={`/docs/${c.slug}`}
                label={c.name}
                isNew={c.isNew}
              />
            ))}
          </NavMenu>
        </div>
      )}

      {/* Inputs (coss) */}
      {inputBlockList.length > 0 && (
        <div>
          <span className="text-[13px] text-muted-foreground/50 pl-1 pb-1.5 flex items-center gap-2">
            Inputs
            <span className="text-[11px]">{inputBlockList.length}</span>
          </span>
          <NavMenu activeSlug={pathname} aria-label="Input components navigation">
            {inputBlockList.map((c, i) => (
              <NavItem
                key={c.slug}
                index={i}
                href={`/docs/${c.slug}`}
                label={c.name}
                isNew={c.isNew}
              />
            ))}
          </NavMenu>
        </div>
      )}

      {/* Frames (coss) */}
      {frameList.length > 0 && (
        <div>
          <span className="text-[13px] text-muted-foreground/50 pl-1 pb-1.5 flex items-center gap-2">
            Frames
            <span className="text-[11px]">{frameList.length}</span>
          </span>
          <NavMenu activeSlug={pathname} aria-label="Frame components navigation">
            {frameList.map((c, i) => (
              <NavItem
                key={c.slug}
                index={i}
                href={`/docs/${c.slug}`}
                label={c.name}
                isNew={c.isNew}
              />
            ))}
          </NavMenu>
        </div>
      )}

      {/* Surface Blocks (coss) — cards, sheets, command palettes */}
      {surfaceBlockList.length > 0 && (
        <div>
          <span className="text-[13px] text-muted-foreground/50 pl-1 pb-1.5 flex items-center gap-2">
            Surface Blocks
            <span className="text-[11px]">{surfaceBlockList.length}</span>
          </span>
          <NavMenu activeSlug={pathname} aria-label="Surface block components navigation">
            {surfaceBlockList.map((c, i) => (
              <NavItem
                key={c.slug}
                index={i}
                href={`/docs/${c.slug}`}
                label={c.name}
                isNew={c.isNew}
              />
            ))}
          </NavMenu>
        </div>
      )}

      {/* Layouts */}
      {layoutList.length > 0 && (
        <div>
          <span className="text-[13px] text-muted-foreground/50 pl-1 pb-1.5 flex items-center gap-2">
            Layouts
            <span className="text-[11px]">{layoutList.length}</span>
          </span>
          <NavMenu activeSlug={pathname} aria-label="Layout components navigation">
            {layoutList.map((c, i) => (
              <NavItem
                key={c.slug}
                index={i}
                href={`/docs/${c.slug}`}
                label={c.name}
                isNew={c.isNew}
              />
            ))}
          </NavMenu>
        </div>
      )}

    </aside>
  );
}

export default Sidebar;
