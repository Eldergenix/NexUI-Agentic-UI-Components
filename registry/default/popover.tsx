"use client";

import * as React from "react";
import * as PopoverPrimitive from "@radix-ui/react-popover";
import { cn } from "@/registry/default/lib/utils";

/**
 * Popover — Radix-based, themed for nexUI.
 *
 * Surfaces use the elevation ladder (`--surface-3` content over body's
 * `--surface-1`) plus `shadow-surface-4` for floating elevation. Dark mode
 * automatically inherits via the `.dark` selector in globals.css.
 *
 * Exported aliases (Popover, PopoverTrigger, PopoverContent) follow shadcn
 * conventions. We also export PopoverPopup as an alias to PopoverContent so
 * coss-style consumers that imported `PopoverPopup` from another registry can
 * drop in without churn.
 */

const Popover = PopoverPrimitive.Root;
const PopoverTrigger = PopoverPrimitive.Trigger;
const PopoverAnchor = PopoverPrimitive.Anchor;
const PopoverPortal = PopoverPrimitive.Portal;

const PopoverContent = React.forwardRef<
  React.ComponentRef<typeof PopoverPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof PopoverPrimitive.Content>
>(({ className, align = "center", sideOffset = 6, ...props }, ref) => (
  <PopoverPrimitive.Portal>
    <PopoverPrimitive.Content
      ref={ref}
      align={align}
      sideOffset={sideOffset}
      className={cn(
        "z-50 w-72 rounded-2xl p-2",
        "bg-[var(--surface-3)] text-[var(--foreground)]",
        "shadow-[var(--shadow-4)]",
        "outline-none",
        "data-[state=open]:animate-in data-[state=closed]:animate-out",
        "data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
        "data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95",
        className
      )}
      {...props}
    />
  </PopoverPrimitive.Portal>
));
PopoverContent.displayName = "PopoverContent";

// Alias for coss-derived usage (`PopoverPopup` was the coss name).
const PopoverPopup = PopoverContent;

export {
  Popover,
  PopoverTrigger,
  PopoverContent,
  PopoverPopup,
  PopoverAnchor,
  PopoverPortal,
};
