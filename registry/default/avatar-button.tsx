"use client";

import * as React from "react";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/registry/default/avatar";
import { Button } from "@/registry/default/button";
import { cn } from "@/registry/default/lib/utils";

/**
 * AvatarButton — a button with a leading circular avatar.
 *
 * Adapted from coss.com `p-button-28`. The coss source hardcoded a Luke
 * Tracy avatar with a `@georgelucas` label; here we accept the avatar info
 * and children freely. The visual treatment matches: pill-shaped button with
 * a tight `ps-1` so the avatar nests cleanly against the rounded edge.
 *
 * Uses FF Button (variant="secondary" maps to coss "outline" style).
 */

export interface AvatarButtonProps
  extends Omit<React.ComponentPropsWithoutRef<typeof Button>, "leadingIcon" | "trailingIcon"> {
  /** Image URL for the avatar. */
  avatarUrl?: string;
  /** Alt text + fallback source. Required for a11y. */
  avatarName: string;
  /** Explicit initials. Defaults to first/last initials of `avatarName`. */
  avatarInitials?: string;
  /** Avatar size in pixels. Defaults to 24 (size-6). */
  avatarSize?: number;
}

function defaultInitials(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "";
  if (parts.length === 1) return parts[0]!.slice(0, 2).toUpperCase();
  return ((parts[0]?.[0] ?? "") + (parts[parts.length - 1]?.[0] ?? "")).toUpperCase();
}

export const AvatarButton = React.forwardRef<
  HTMLButtonElement,
  AvatarButtonProps
>(function AvatarButton(
  {
    avatarUrl,
    avatarName,
    avatarInitials,
    avatarSize = 24,
    variant = "secondary",
    size = "sm",
    className,
    children,
    ...rest
  },
  ref
) {
  return (
    <Button
      ref={ref}
      variant={variant}
      size={size}
      className={cn("rounded-full ps-1 gap-2", className)}
      {...rest}
    >
      <Avatar style={{ width: avatarSize, height: avatarSize }}>
        {avatarUrl ? <AvatarImage alt={avatarName} src={avatarUrl} /> : null}
        <AvatarFallback className="text-[0.6em]">
          {avatarInitials ?? defaultInitials(avatarName)}
        </AvatarFallback>
      </Avatar>
      {children}
    </Button>
  );
});

export default AvatarButton;
