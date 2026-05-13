"use client";

import * as React from "react";
import { cn } from "@/registry/default/lib/utils";

/**
 * ThemeCardRadio — visual theme selector with image-card previews.
 *
 * Adapted from coss.com `p-radio-group-6` but rewritten to drop the coss
 * `Field`/`Fieldset`/`Radio` primitives. Uses native HTML `<input type=radio>`
 * with `peer-checked` Tailwind v4 selectors so the card UI styles itself
 * based on the hidden radio's checked state.
 *
 * Theme tokens used:
 * - `--foreground`, `--muted-foreground` (label colors)
 * - `--ring`, `--background` (selected-card ring offset)
 * - SVG fills use neutral-700/800/900 (dark preview) and neutral-200/300
 *   (light preview) for theme-independent visual contrast inside the card.
 */

export type ThemeChoice = "system" | "light" | "dark";

export interface ThemeCardRadioProps {
  /** Currently selected theme. Controlled mode. */
  value?: ThemeChoice;
  /** Default theme. Uncontrolled mode. */
  defaultValue?: ThemeChoice;
  /** Called when selection changes. */
  onValueChange?: (value: ThemeChoice) => void;
  /** Radio group name (must be unique per form). Defaults to a generated id. */
  name?: string;
  /** Override the fieldset legend. */
  legend?: React.ReactNode;
  /** Extra class for the outer fieldset. */
  className?: string;
}

const items: { label: string; value: ThemeChoice }[] = [
  { label: "System", value: "system" },
  { label: "Light", value: "light" },
  { label: "Dark", value: "dark" },
];

export function ThemeCardRadio({
  value,
  defaultValue = "system",
  onValueChange,
  name: nameProp,
  legend = "Choose a theme",
  className,
}: ThemeCardRadioProps) {
  const generatedName = React.useId();
  const name = nameProp ?? `theme-${generatedName}`;
  const [internal, setInternal] = React.useState<ThemeChoice>(defaultValue);
  const current = value ?? internal;

  const handleChange = (next: ThemeChoice) => {
    if (value === undefined) setInternal(next);
    onValueChange?.(next);
  };

  return (
    <fieldset className={cn("flex flex-col gap-4", className)}>
      <legend className="text-sm font-medium text-[var(--foreground)]">
        {legend}
      </legend>
      <div role="radiogroup" className="flex flex-row gap-4">
        {items.map((item) => (
          <label
            key={item.value}
            className="flex cursor-pointer flex-col items-center gap-2"
          >
            <input
              type="radio"
              name={name}
              value={item.value}
              checked={current === item.value}
              onChange={() => handleChange(item.value)}
              className="peer sr-only"
            />
            <span
              className={cn(
                "relative block h-[70px] w-[88px] overflow-hidden rounded-lg shadow-[var(--shadow-1)]",
                "opacity-80 peer-checked:opacity-100",
                "transition-[opacity,box-shadow] duration-150",
                "peer-checked:ring-2 peer-checked:ring-[var(--foreground)]/40 peer-checked:ring-offset-2 peer-checked:ring-offset-[var(--background)]",
                "peer-focus-visible:ring-2 peer-focus-visible:ring-[var(--ring)]"
              )}
            >
              {themePreviews[item.value]}
            </span>
            <span
              className={cn(
                "text-xs",
                current === item.value
                  ? "text-[var(--foreground)]"
                  : "text-[var(--muted-foreground)]"
              )}
            >
              {item.label}
            </span>
          </label>
        ))}
      </div>
    </fieldset>
  );
}
ThemeCardRadio.displayName = "ThemeCardRadio";

const themePreviews: Record<ThemeChoice, React.ReactElement> = {
  dark: (
    <svg
      aria-hidden
      className="size-full"
      fill="none"
      viewBox="0 0 88 70"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path className="fill-neutral-900" d="M0 0h88v70H0z" />
      <path className="fill-neutral-800" d="M10 12a4 4 0 0 1 4-4h74v62H10V12Z" />
      <circle className="fill-neutral-600" cx="28" cy="26" r="8" />
      <rect className="fill-neutral-700" height="4" rx="2" width="58" x="20" y="42" />
      <rect className="fill-neutral-700" height="4" rx="2" width="58" x="20" y="49" />
      <rect className="fill-neutral-700" height="4" rx="2" width="29" x="20" y="56" />
    </svg>
  ),
  light: (
    <svg
      aria-hidden
      className="size-full"
      fill="none"
      viewBox="0 0 88 70"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path className="fill-neutral-200" d="M0 0h88v70H0z" />
      <path className="fill-white" d="M10 12a4 4 0 0 1 4-4h74v62H10V12Z" />
      <circle className="fill-neutral-300" cx="28" cy="26" r="8" />
      <rect className="fill-neutral-200" height="4" rx="2" width="58" x="20" y="42" />
      <rect className="fill-neutral-200" height="4" rx="2" width="58" x="20" y="49" />
      <rect className="fill-neutral-200" height="4" rx="2" width="29" x="20" y="56" />
    </svg>
  ),
  system: (
    <svg
      aria-hidden
      className="size-full"
      fill="none"
      viewBox="0 0 88 70"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path className="fill-neutral-200" d="M0 0h44v70H0z" />
      <path className="fill-neutral-900" d="M44 0h44v70H44z" />
      <path className="fill-white" d="M10 12a4 4 0 0 1 4-4h30v62H10V12Z" />
      <circle className="fill-neutral-300" cx="28" cy="26" r="8" />
      <path
        className="fill-neutral-200"
        d="M20 44a2 2 0 0 1 2-2h22v4H22a2 2 0 0 1-2-2ZM20 51a2 2 0 0 1 2-2h22v4H22a2 2 0 0 1-2-2ZM20 58a2 2 0 0 1 2-2h22v4H22a2 2 0 0 1-2-2Z"
      />
      <path className="fill-neutral-800" d="M54 12a4 4 0 0 1 4-4h30v62H54V12Z" />
      <circle className="fill-neutral-600" cx="72" cy="26" r="8" />
      <path
        className="fill-neutral-700"
        d="M64 44a2 2 0 0 1 2-2h22v4H66a2 2 0 0 1-2-2ZM64 51a2 2 0 0 1 2-2h22v4H66a2 2 0 0 1-2-2ZM64 58a2 2 0 0 1 2-2h22v4H66a2 2 0 0 1-2-2Z"
      />
    </svg>
  ),
};
