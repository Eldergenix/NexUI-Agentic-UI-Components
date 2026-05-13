"use client";

import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { fontWeights } from "@/registry/default/lib/font-weight";
import { buttonVariants } from "@/registry/default/button";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
} from "@/registry/default/select";
import {
  useShape,
  useShapeContext,
  type ShapeVariant,
} from "@/lib/shape-context";
import { useThemeContext, type Theme } from "@/registry/default/lib/theme-context";
import {
  useIcon,
  useIconLibrary,
  iconLibraryOrder,
  iconLibraryLabels,
  type IconLibrary,
} from "@/lib/icon-context";
import { Tooltip } from "@/registry/default/tooltip";

const REPO = "Eldergenix/NexUI-Agentic-UI-Components";

function formatStars(n: number): string {
  if (n >= 1000) {
    const k = n / 1000;
    return k % 1 === 0 ? `${k}k` : `${k.toFixed(1)}k`;
  }
  return String(n);
}

/** The inner settings content — reused in the right column and mobile drawer. */
export function SettingsContent({ tooltipSide = "left", hideSocial }: { tooltipSide?: "left" | "right" | "top" | "bottom"; hideSocial?: boolean }) {
  const { theme, setTheme } = useThemeContext();
  const { shape, setShape } = useShapeContext();
  const { iconLibrary, setIconLibrary } = useIconLibrary();
  const shapeCtx = useShape();
  const [stars, setStars] = useState<number | null>(null);

  const MonitorIcon = useIcon("monitor");
  const SunIcon = useIcon("sun");
  const MoonIcon = useIcon("moon");
  const RectHorizIcon = useIcon("rectangle-horizontal");
  const CircleIcon = useIcon("circle");
  const PaletteIcon = useIcon("palette");

  const themeOptions = [
    { label: "System", value: "system" as Theme, icon: MonitorIcon },
    { label: "Light", value: "light" as Theme, icon: SunIcon },
    { label: "Dark", value: "dark" as Theme, icon: MoonIcon },
  ];

  const shapeOptions = [
    { label: "Rounded", value: "rounded" as ShapeVariant, icon: RectHorizIcon },
    { label: "Pill", value: "pill" as ShapeVariant, icon: CircleIcon },
  ];

  const iconOptions = iconLibraryOrder.map((lib) => ({
    label: iconLibraryLabels[lib],
    value: lib,
    icon: PaletteIcon,
  }));

  useEffect(() => {
    fetch(`https://api.github.com/repos/${REPO}`, {
      headers: { Accept: "application/vnd.github.v3+json" },
    })
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data?.stargazers_count != null) {
          setStars(data.stargazers_count);
        }
      })
      .catch(() => {});
  }, []);

  return (
    <div className="flex flex-col gap-2">
      {/* Theme, Radius & Icons selects */}
      <div className="flex flex-col gap-1.5 py-3">
        <Tooltip content={<span>Press &ensp;<kbd className="font-mono opacity-50">T</kbd>&ensp; to cycle</span>} side={tooltipSide}>
          <div className="flex items-center justify-between px-2">
            <span className="text-[13px] text-muted-foreground">Theme</span>
            <Select value={theme} onValueChange={(v) => setTheme(v as Theme)}>
              <SelectTrigger
                variant="borderless"
                className="min-w-0 w-auto h-7 px-2 text-[13px]"
                icon={themeOptions.find((o) => o.value === theme)?.icon}
              />
              <SelectContent>
                {themeOptions.map((o, i) => (
                  <SelectItem key={o.value} value={o.value} index={i} icon={o.icon}>
                    {o.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </Tooltip>
        <Tooltip content={<span>Press &ensp;<kbd className="font-mono opacity-50">R</kbd>&ensp; to toggle</span>} side={tooltipSide}>
          <div className="flex items-center justify-between px-2">
            <span className="text-[13px] text-muted-foreground">Radius</span>
            <Select value={shape} onValueChange={(v) => setShape(v as ShapeVariant)}>
              <SelectTrigger
                variant="borderless"
                className="min-w-0 w-auto h-7 px-2 text-[13px]"
                icon={shapeOptions.find((o) => o.value === shape)?.icon}
              />
              <SelectContent>
                {shapeOptions.map((o, i) => (
                  <SelectItem key={o.value} value={o.value} index={i} icon={o.icon}>
                    {o.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </Tooltip>
        <Tooltip content={<span>Press &ensp;<kbd className="font-mono opacity-50">I</kbd>&ensp; to cycle</span>} side={tooltipSide}>
          <div className="flex items-center justify-between px-2">
            <span className="text-[13px] text-muted-foreground">Icons</span>
            <Select value={iconLibrary} onValueChange={(v) => setIconLibrary(v as IconLibrary)}>
              <SelectTrigger
                variant="borderless"
                className="min-w-0 w-auto h-7 px-2 text-[13px]"
                icon={PaletteIcon}
              />
              <SelectContent>
                {iconOptions.map((o, i) => (
                  <SelectItem key={o.value} value={o.value} index={i} icon={o.icon}>
                    {o.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </Tooltip>
      </div>

      {/* Credit */}
      <Tooltip content="I help teams ship memorable design systems" side={tooltipSide}>
        <div className="flex items-center gap-2 px-2">
          <span
            aria-hidden
            className="w-5 h-5 rounded-full shrink-0 inline-flex items-center justify-center text-[10px] font-semibold bg-accent text-foreground"
          >
            E
          </span>
          <p className="text-[13px] text-muted-foreground">
            Created by{" "}
            <a
              href="https://x.com/elderatlantean"
              target="_blank"
              rel="noopener noreferrer"
              className="rounded text-muted-foreground hover:text-foreground transition-colors duration-80 outline-none focus-visible:ring-1 focus-visible:ring-[#6B97FF] focus-visible:ring-offset-2"
            >
              @elderatlantean
            </a>
          </p>
        </div>
      </Tooltip>

      {/* X (Twitter) + GitHub buttons */}
      {!hideSocial && (<div className="flex items-center gap-1 pt-1">
        <a
          href="https://x.com/elderatlantean"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Follow @elderatlantean on X"
          className={cn(
            buttonVariants({ variant: "tertiary", size: "sm", iconLeft: true }),
            shapeCtx.button
          )}
        >
          <svg
            width={16}
            height={16}
            viewBox="0 0 24 24"
            fill="currentColor"
            aria-hidden="true"
          >
            <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
          </svg>
          Follow on X
        </a>
        <a
          href={`https://github.com/${REPO}`}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="View on GitHub"
          className={cn(
            buttonVariants({ variant: "ghost", size: "sm", iconLeft: true }),
            shapeCtx.button
          )}
        >
          <svg
            width={16}
            height={16}
            viewBox="0 0 16 16"
            fill="currentColor"
            aria-hidden="true"
          >
            <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27s1.36.09 2 .27c1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.01 8.01 0 0016 8c0-4.42-3.58-8-8-8z" />
          </svg>
          {stars !== null && (
            <span style={{ fontVariantNumeric: "tabular-nums" }}>
              {formatStars(stars)}
            </span>
          )}
        </a>
      </div>)}
    </div>
  );
}

/** Desktop-only right column that mirrors the left sidebar styling. */
export function RightPanel() {
  return (
    <aside className="shrink-0 w-64 p-4 sticky top-4 self-start mt-4 mr-4 rounded-lg bg-muted hidden lg:block">
      <h2
        className="text-[16px] text-foreground leading-none pl-1 pt-2 pb-2"
        style={{ fontVariationSettings: fontWeights.semibold }}
      >
        Make them yours
      </h2>
      <SettingsContent tooltipSide="left" />
    </aside>
  );
}
