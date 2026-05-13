"use client";

import { Collapsible as CollapsiblePrimitive } from "@base-ui/react/collapsible";
import * as React from "react";
import { cn } from "@/lib/utils";

export function Collapsible({
  ...props
}: CollapsiblePrimitive.Root.Props): React.ReactElement {
  return <CollapsiblePrimitive.Root data-slot="collapsible" {...props} />;
}

// CollapsibleTrigger — extends Base UI's Trigger with Radix-style `asChild`
// compatibility. Base UI uses a `render` prop instead of `asChild`; this
// wrapper translates so consumers can use the universal shadcn pattern
// (`<CollapsibleTrigger asChild><MyButton/></CollapsibleTrigger>`) without
// producing nested <button> nodes or unknown DOM attributes.
type CollapsibleTriggerProps = CollapsiblePrimitive.Trigger.Props & {
  asChild?: boolean;
};

export function CollapsibleTrigger({
  className,
  asChild,
  children,
  ...props
}: CollapsibleTriggerProps): React.ReactElement {
  if (asChild && React.isValidElement(children)) {
    // Base UI's `render` accepts a ReactElement; it clones the element and
    // merges Trigger props/state onto it. Net result: just the inner element
    // renders (no Trigger-owned <button>), so no nesting.
    return (
      <CollapsiblePrimitive.Trigger
        data-slot="collapsible-trigger"
        render={children as React.ReactElement}
        {...props}
      />
    );
  }
  return (
    <CollapsiblePrimitive.Trigger
      className={className}
      data-slot="collapsible-trigger"
      {...props}
    >
      {children}
    </CollapsiblePrimitive.Trigger>
  );
}

export function CollapsiblePanel({
  className,
  ...props
}: CollapsiblePrimitive.Panel.Props): React.ReactElement {
  return (
    <CollapsiblePrimitive.Panel
      className={cn(
        "h-(--collapsible-panel-height) overflow-hidden transition-[height] duration-200 data-ending-style:h-0 data-starting-style:h-0",
        className,
      )}
      data-slot="collapsible-panel"
      {...props}
    />
  );
}

export { CollapsiblePrimitive, CollapsiblePanel as CollapsibleContent };
