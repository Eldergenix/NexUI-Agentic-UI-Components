"use client";

import * as React from "react";
import { createAvatar } from "@dicebear/core";
import * as avataaars from "@dicebear/avataaars";
import * as bottts from "@dicebear/bottts";
import * as glass from "@dicebear/glass";
import * as identicon from "@dicebear/identicon";
import * as icons from "@dicebear/icons";
import * as initials from "@dicebear/initials";
import * as pixelArt from "@dicebear/pixel-art";
import jazzicon from "@metamask/jazzicon";
import { cn } from "@/registry/default/lib/utils";

/**
 * Avatar generators — three backends with one prop API.
 *
 * - **DiceBear** (7 styles: avataaars, bottts, glass, identicon, icons,
 *   initials, pixel-art): deterministic, seed-based SVG avatars rendered as
 *   data-URI images so we never inject raw HTML.
 * - **Jazzicon**: MetaMask's geometric pattern. Library returns a detached
 *   DOM node so we mount it via a ref (no `dangerouslySetInnerHTML`).
 * - **Spell**: spell.sh-style fallback — pure CSS, HSL color from seed hash +
 *   initials.
 *
 * Same `seed` → same avatar across all backends. SVG output stays crisp at any
 * size and looks identical in light/dark themes.
 */

export type DiceBearStyleName =
  | "avataaars"
  | "bottts"
  | "glass"
  | "identicon"
  | "icons"
  | "initials"
  | "pixel-art";

const DICEBEAR_STYLES = {
  avataaars,
  bottts,
  glass,
  identicon,
  icons,
  initials,
  "pixel-art": pixelArt,
} as const;

export interface DiceBearAvatarProps
  extends Omit<React.HTMLAttributes<HTMLImageElement>, "children" | "src"> {
  /** Seed used to deterministically generate the avatar. */
  seed: string;
  /** DiceBear style. Defaults to "avataaars". */
  styleName?: DiceBearStyleName;
  /** Pixel size (width = height). Defaults to 40. */
  size?: number;
  /** Background colors. Empty array = transparent. */
  backgroundColor?: string[];
  /** Alt text for screen readers. Defaults to "Avatar for {seed}". */
  alt?: string;
}

/**
 * DiceBearAvatar — renders a data-URI <img> generated from the DiceBear core
 * renderer. Memoized per (seed, style, size) to avoid re-runs.
 */
export const DiceBearAvatar = React.memo(function DiceBearAvatar({
  seed,
  styleName = "avataaars",
  size = 40,
  backgroundColor,
  alt,
  className,
  style,
  ...rest
}: DiceBearAvatarProps) {
  const dataUri = React.useMemo(() => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const styleModule = DICEBEAR_STYLES[styleName] as any;
    const avatar = createAvatar(styleModule, {
      seed,
      size,
      ...(backgroundColor ? { backgroundColor } : {}),
    });
    return avatar.toDataUri();
  }, [seed, styleName, size, backgroundColor]);

  return (
    <img
      alt={alt ?? `Avatar for ${seed}`}
      src={dataUri}
      width={size}
      height={size}
      className={cn(
        "inline-block shrink-0 overflow-hidden rounded-full select-none",
        className
      )}
      style={{ width: size, height: size, ...style }}
      {...rest}
    />
  );
});

export interface JazziconAvatarProps
  extends Omit<React.HTMLAttributes<HTMLSpanElement>, "children"> {
  /** Hex address or any string. Will be hashed to 32-bit int. */
  seed: string;
  /** Pixel size (width = height). Defaults to 40. */
  size?: number;
}

function djb2Hash(input: string): number {
  let h = 5381;
  for (let i = 0; i < input.length; i++) {
    h = ((h << 5) + h + input.charCodeAt(i)) | 0;
  }
  return h >>> 0;
}

/**
 * JazziconAvatar — `@metamask/jazzicon` returns a detached `<div>` containing
 * its own SVG. We mount it imperatively via `ref` so React's reconciler
 * doesn't step on Jazzicon's internal tree.
 */
export const JazziconAvatar = React.memo(function JazziconAvatar({
  seed,
  size = 40,
  className,
  style,
  ...rest
}: JazziconAvatarProps) {
  const hostRef = React.useRef<HTMLSpanElement | null>(null);

  React.useEffect(() => {
    const host = hostRef.current;
    if (!host) return;
    while (host.firstChild) host.removeChild(host.firstChild);
    const node = jazzicon(size, djb2Hash(seed));
    host.appendChild(node);
    return () => {
      while (host.firstChild) host.removeChild(host.firstChild);
    };
  }, [seed, size]);

  return (
    <span
      ref={hostRef}
      aria-hidden
      className={cn("inline-flex shrink-0 overflow-hidden rounded-full", className)}
      style={{ width: size, height: size, ...style }}
      {...rest}
    />
  );
});

export interface SpellAvatarProps
  extends Omit<React.HTMLAttributes<HTMLSpanElement>, "children"> {
  /** Seed for color hash + initials extraction. */
  seed: string;
  /** Optional explicit initials. Falls back to first 2 letters of seed. */
  initials?: string;
  /** Pixel size. Defaults to 40. */
  size?: number;
  /** Saturation 0..100. Defaults to 65. */
  saturation?: number;
  /** Lightness 0..100. Defaults to 55. */
  lightness?: number;
}

function hashToHue(input: string): number {
  return djb2Hash(input) % 360;
}

function defaultInitials(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "";
  if (parts.length === 1) return parts[0]!.slice(0, 2).toUpperCase();
  return ((parts[0]?.[0] ?? "") + (parts[parts.length - 1]?.[0] ?? "")).toUpperCase();
}

/**
 * SpellAvatar — spell.sh-style fallback: deterministic HSL fill + 1–2 letter
 * initials. Pure CSS, no external deps beyond a string hash.
 */
export const SpellAvatar = React.memo(function SpellAvatar({
  seed,
  initials,
  size = 40,
  saturation = 65,
  lightness = 55,
  className,
  style,
  ...rest
}: SpellAvatarProps) {
  const hue = hashToHue(seed);
  const bg = `hsl(${hue} ${saturation}% ${lightness}%)`;
  const text = `hsl(${hue} ${saturation}% ${lightness > 50 ? 12 : 96}%)`;
  const letters = initials ?? defaultInitials(seed);

  return (
    <span
      aria-hidden
      className={cn(
        "inline-flex shrink-0 items-center justify-center rounded-full font-medium tracking-tight select-none",
        className
      )}
      style={{
        width: size,
        height: size,
        background: bg,
        color: text,
        fontSize: Math.round(size * 0.42),
        ...style,
      }}
      {...rest}
    >
      {letters}
    </span>
  );
});
