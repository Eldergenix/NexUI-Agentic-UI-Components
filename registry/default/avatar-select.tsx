"use client";

import * as React from "react";
import { ChevronDown, Check } from "lucide-react";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/registry/default/avatar";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/registry/default/popover";
import { cn } from "@/registry/default/lib/utils";

/**
 * AvatarSelect — controlled select that shows each option as `<avatar> name`.
 *
 * Adapted from coss.com `p-select-19`. The coss source used a Base UI Select
 * with `itemToStringValue`; we build it on Radix Popover + native buttons
 * since the visual API is simple enough (single-select, no virtualization
 * needed for the small option counts shown in agent UIs).
 *
 * Theme tokens used: `--surface-3` (popover body), `--accent` / `--accent-foreground`
 * (hover/selected), `--ring` (focus), `--muted-foreground` (placeholder).
 */

export interface AvatarSelectOption {
  value: string;
  label: string;
  avatarUrl?: string;
  initials?: string;
}

export interface AvatarSelectProps {
  /** Selectable options. */
  options: AvatarSelectOption[];
  /** Currently selected value (controlled). */
  value?: string;
  /** Initial value (uncontrolled). */
  defaultValue?: string;
  /** Called when selection changes. */
  onValueChange?: (value: string) => void;
  /** Placeholder text when nothing selected. */
  placeholder?: string;
  /** Optional group label shown above options. */
  groupLabel?: string;
  /** Trigger className passthrough. */
  className?: string;
  /** aria-label for the trigger. */
  ariaLabel?: string;
}

function defaultInitials(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "";
  if (parts.length === 1) return parts[0]!.slice(0, 2).toUpperCase();
  return ((parts[0]?.[0] ?? "") + (parts[parts.length - 1]?.[0] ?? "")).toUpperCase();
}

function OptionRow({
  option,
}: {
  option: AvatarSelectOption;
}) {
  return (
    <span className="flex items-center gap-2">
      <Avatar style={{ width: 20, height: 20 }}>
        {option.avatarUrl ? (
          <AvatarImage alt={option.label} src={option.avatarUrl} />
        ) : null}
        <AvatarFallback className="text-[0.55em]">
          {option.initials ?? defaultInitials(option.label)}
        </AvatarFallback>
      </Avatar>
      <span className="truncate">{option.label}</span>
    </span>
  );
}

export function AvatarSelect({
  options,
  value,
  defaultValue,
  onValueChange,
  placeholder = "Select…",
  groupLabel,
  className,
  ariaLabel,
}: AvatarSelectProps) {
  const [internal, setInternal] = React.useState<string | undefined>(defaultValue);
  const [open, setOpen] = React.useState(false);
  const current = value ?? internal;
  const selected = options.find((o) => o.value === current);

  const handleSelect = (next: string) => {
    if (value === undefined) setInternal(next);
    onValueChange?.(next);
    setOpen(false);
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger
        aria-label={ariaLabel}
        className={cn(
          "inline-flex w-full items-center justify-between gap-2 rounded-md px-3 py-2 text-sm",
          "border border-[var(--border)] bg-[var(--background)] text-[var(--foreground)]",
          "hover:bg-[var(--accent)] data-[state=open]:bg-[var(--accent)]",
          "focus:outline-none focus:ring-2 focus:ring-[var(--ring)]",
          className
        )}
      >
        {selected ? (
          <OptionRow option={selected} />
        ) : (
          <span className="text-[var(--muted-foreground)]">{placeholder}</span>
        )}
        <ChevronDown className="h-4 w-4 opacity-60" />
      </PopoverTrigger>
      <PopoverContent
        align="start"
        className="w-[var(--radix-popover-trigger-width)] min-w-[200px] p-1"
      >
        {groupLabel ? (
          <div className="px-2 py-1 text-[0.7rem] uppercase tracking-wide text-[var(--muted-foreground)]">
            {groupLabel}
          </div>
        ) : null}
        <ul role="listbox" aria-label={ariaLabel}>
          {options.map((option) => {
            const isSelected = option.value === current;
            return (
              <li key={option.value}>
                <button
                  type="button"
                  role="option"
                  aria-selected={isSelected}
                  onClick={() => handleSelect(option.value)}
                  className={cn(
                    "flex w-full items-center justify-between gap-2 rounded-sm px-2 py-1.5 text-sm",
                    "text-[var(--foreground)]",
                    "hover:bg-[var(--accent)] hover:text-[var(--accent-foreground)]",
                    "focus:outline-none focus:bg-[var(--accent)] focus:text-[var(--accent-foreground)]",
                    isSelected && "bg-[var(--accent)] text-[var(--accent-foreground)]"
                  )}
                >
                  <OptionRow option={option} />
                  {isSelected ? <Check className="h-4 w-4" /> : null}
                </button>
              </li>
            );
          })}
        </ul>
      </PopoverContent>
    </Popover>
  );
}
AvatarSelect.displayName = "AvatarSelect";

export default AvatarSelect;
