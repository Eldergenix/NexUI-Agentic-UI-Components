"use client";

import * as React from "react";
import { ChevronsUpDown, Funnel, Search, X, Check } from "lucide-react";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/registry/default/avatar";
import { Badge } from "@/registry/default/badge";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/registry/default/popover";
import { cn } from "@/registry/default/lib/utils";

/**
 * MemberFilter — segmented filter pill: [Funnel | Member ▼ | ✕].
 *
 * Adapted from coss.com `p-group-23` (combobox multi-select). The coss source
 * relied on `@coss/group` + `@coss/combobox` primitives which we don't ship.
 * Instead we compose:
 *   - A grouped flex row with `divide-x` styled to behave like FF's pill
 *     buttons (rounded outer corners, square inner corners).
 *   - A Radix Popover containing a search input + scrollable option list with
 *     inline checkmarks for selected members.
 *
 * Behaviorally matches the source: multi-select with avatar+name rows,
 * showing the first-selected avatar + "+N" badge on the trigger when 2+
 * options are selected.
 */

export interface MemberOption {
  id: string;
  label: string;
  avatarUrl?: string;
  initials?: string;
}

export interface MemberFilterProps {
  /** Full list of selectable members. */
  members: MemberOption[];
  /** Initially selected members (uncontrolled). */
  defaultSelected?: MemberOption[];
  /** Selected members (controlled). */
  selected?: MemberOption[];
  /** Called on each selection change. */
  onSelectedChange?: (selected: MemberOption[]) => void;
  /** Outer wrapper className. */
  className?: string;
  /** Filter group label. Defaults to "Member". */
  label?: string;
}

function defaultInitials(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "";
  if (parts.length === 1) return parts[0]!.slice(0, 2).toUpperCase();
  return ((parts[0]?.[0] ?? "") + (parts[parts.length - 1]?.[0] ?? "")).toUpperCase();
}

function MemberAvatar({
  member,
  size = 20,
}: {
  member: MemberOption;
  size?: number;
}) {
  return (
    <Avatar style={{ width: size, height: size }}>
      {member.avatarUrl ? (
        <AvatarImage alt={member.label} src={member.avatarUrl} />
      ) : null}
      <AvatarFallback className="text-[0.55em]">
        {member.initials ?? defaultInitials(member.label)}
      </AvatarFallback>
    </Avatar>
  );
}

export function MemberFilter({
  members,
  defaultSelected,
  selected: controlled,
  onSelectedChange,
  className,
  label = "Member",
}: MemberFilterProps) {
  const [internal, setInternal] = React.useState<MemberOption[]>(defaultSelected ?? []);
  const selected = controlled ?? internal;
  const [open, setOpen] = React.useState(false);
  const [query, setQuery] = React.useState("");

  const update = (next: MemberOption[]) => {
    if (controlled === undefined) setInternal(next);
    onSelectedChange?.(next);
  };

  const toggle = (option: MemberOption) => {
    const exists = selected.find((s) => s.id === option.id);
    update(exists ? selected.filter((s) => s.id !== option.id) : [...selected, option]);
  };

  const clear = () => update([]);

  const filtered = members.filter((m) =>
    m.label.toLowerCase().includes(query.toLowerCase())
  );

  const renderTriggerContent = () => {
    if (selected.length === 0) {
      return (
        <>
          <span>Select</span>
          <ChevronsUpDown className="h-3.5 w-3.5 -mr-1 opacity-60" />
        </>
      );
    }
    const first = selected[0]!;
    const remaining = selected.length - 1;
    return (
      <span className="flex items-center gap-2">
        <MemberAvatar member={first} />
        <span className="truncate">{first.label}</span>
        {remaining > 0 ? (
          <Badge size="sm" color="gray" className="tabular-nums">
            +{remaining}
          </Badge>
        ) : null}
      </span>
    );
  };

  return (
    <div
      className={cn(
        "inline-flex items-stretch divide-x divide-[var(--border)]",
        "rounded-full border border-[var(--border)] bg-[var(--background)] overflow-hidden text-sm",
        className
      )}
    >
      <span
        className={cn(
          "inline-flex items-center gap-1.5 px-3 text-[var(--muted-foreground)] select-none"
        )}
      >
        <Funnel className="h-3.5 w-3.5" />
        {label}
      </span>

      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger
          className={cn(
            "inline-flex items-center gap-2 px-3 py-1.5",
            "text-[var(--foreground)] hover:bg-[var(--accent)] data-[state=open]:bg-[var(--accent)]",
            "focus:outline-none focus:bg-[var(--accent)]"
          )}
        >
          {renderTriggerContent()}
        </PopoverTrigger>

        <PopoverContent align="start" sideOffset={6} className="w-72 p-0">
          <div className="border-b border-[var(--border)] p-2">
            <div className="relative">
              <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-[var(--muted-foreground)]" />
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search members…"
                className={cn(
                  "w-full rounded-md border border-[var(--border)] bg-[var(--background)]",
                  "py-1.5 pl-8 pr-2 text-sm text-[var(--foreground)] placeholder:text-[var(--muted-foreground)]",
                  "focus:outline-none focus:ring-2 focus:ring-[var(--ring)]"
                )}
              />
            </div>
          </div>

          <ul role="listbox" aria-multiselectable className="max-h-64 overflow-y-auto py-1">
            {filtered.length === 0 ? (
              <li className="px-3 py-2 text-sm text-[var(--muted-foreground)]">
                No members found.
              </li>
            ) : (
              filtered.map((option) => {
                const isSelected = !!selected.find((s) => s.id === option.id);
                return (
                  <li key={option.id}>
                    <button
                      type="button"
                      role="option"
                      aria-selected={isSelected}
                      onClick={() => toggle(option)}
                      className={cn(
                        "flex w-full items-center justify-between gap-2 px-3 py-1.5 text-sm",
                        "hover:bg-[var(--accent)] hover:text-[var(--accent-foreground)]",
                        "focus:outline-none focus:bg-[var(--accent)] focus:text-[var(--accent-foreground)]",
                        isSelected && "bg-[var(--accent)]/60 text-[var(--accent-foreground)]"
                      )}
                    >
                      <span className="flex items-center gap-2 truncate">
                        <MemberAvatar member={option} />
                        <span className="truncate">{option.label}</span>
                      </span>
                      {isSelected ? <Check className="h-4 w-4 shrink-0" /> : null}
                    </button>
                  </li>
                );
              })
            )}
          </ul>
        </PopoverContent>
      </Popover>

      <button
        type="button"
        onClick={clear}
        aria-label="Remove filter"
        className={cn(
          "inline-flex items-center justify-center px-3",
          "text-[var(--muted-foreground)] hover:text-[var(--foreground)]",
          "hover:bg-[var(--accent)] focus:outline-none focus:bg-[var(--accent)]"
        )}
      >
        <X className="h-3.5 w-3.5" />
      </button>
    </div>
  );
}
MemberFilter.displayName = "MemberFilter";

export default MemberFilter;
