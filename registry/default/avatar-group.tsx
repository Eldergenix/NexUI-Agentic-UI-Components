"use client";

import * as React from "react";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/registry/default/avatar";
import { cn } from "@/registry/default/lib/utils";

/**
 * AvatarGroup — small stack of overlapping avatars with a `ring` separator.
 *
 * Adapted from coss.com `p-avatar-13` but accepts the avatar list as a prop
 * instead of hardcoding three Unsplash URLs. Ring color uses
 * `var(--background)` so the separation reads correctly in both themes.
 *
 * If `users.length > max`, the overflow is collapsed into a "+N" pill that
 * uses the same ring treatment.
 */

export interface AvatarGroupUser {
  id: string;
  name: string;
  imageUrl?: string;
  initials?: string;
}

export interface AvatarGroupProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, "children"> {
  users: AvatarGroupUser[];
  /** Avatar pixel size. Defaults to 24 (size-6). */
  size?: number;
  /** Max avatars to render before collapsing the rest into "+N". */
  max?: number;
  /** Ring thickness in pixels. Defaults to 2. */
  ringWidth?: number;
}

function defaultInitials(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "";
  if (parts.length === 1) return parts[0]!.slice(0, 2).toUpperCase();
  return ((parts[0]?.[0] ?? "") + (parts[parts.length - 1]?.[0] ?? "")).toUpperCase();
}

export function AvatarGroup({
  users,
  size = 24,
  max = 4,
  ringWidth = 2,
  className,
  ...rest
}: AvatarGroupProps) {
  const visible = users.slice(0, max);
  const overflow = users.length - visible.length;

  return (
    <div className={cn("flex", className)} style={{ marginRight: -ringWidth }} {...rest}>
      {visible.map((u) => (
        <Avatar
          key={u.id}
          className="-mr-[6px] rounded-full"
          style={{
            width: size,
            height: size,
            boxShadow: `0 0 0 ${ringWidth}px var(--background)`,
          }}
        >
          {u.imageUrl ? <AvatarImage alt={u.name} src={u.imageUrl} /> : null}
          <AvatarFallback className="text-[0.55em]">
            {u.initials ?? defaultInitials(u.name)}
          </AvatarFallback>
        </Avatar>
      ))}
      {overflow > 0 ? (
        <span
          aria-label={`${overflow} more`}
          className={cn(
            "-mr-[6px] inline-flex items-center justify-center rounded-full",
            "bg-[var(--muted)] text-[var(--muted-foreground)] text-[0.6em] font-medium tabular-nums"
          )}
          style={{
            width: size,
            height: size,
            boxShadow: `0 0 0 ${ringWidth}px var(--background)`,
          }}
        >
          +{overflow}
        </span>
      ) : null}
    </div>
  );
}
AvatarGroup.displayName = "AvatarGroup";

export default AvatarGroup;
