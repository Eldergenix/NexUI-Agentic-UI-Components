import type { TimelineStep, StepState } from "../../types/timeline";
import React from "react";
import { ThinkingCollapsed } from "./thinking-tool";
import { EditToolDiffCard } from "./edit-tool";
import { BashToolTerminalCard } from "./bash-tool";
import { ActionRow } from "./action-row";
import { GenericToolRow } from "./generic-tool";

export { routeToolCall };

// Note: routeToolCall is used by message-list to render tool calls from TimelineStep objects.
// It dynamically imports the tool components to avoid circular deps.
// This function returns a React.ReactNode.
function routeToolCall(
  step: Extract<TimelineStep, { type: "tool-call" }>,
  state: StepState,
  onComplete: () => void,
  actionIndex: number,
): React.ReactNode {
  // Thinking
  if (step.toolVariant === "thinking") {
    return React.createElement(ThinkingCollapsed, {
      key: step.id,
      step,
      state,
      onComplete,
    });
  }

  // Code actions (diff-card | minimal | hidden)
  if (
    step.diffLines ||
    step.filePath ||
    step.toolName === "Write" ||
    step.toolName === "Edit"
  ) {
    return React.createElement(EditToolDiffCard, {
      key: step.id,
      step,
      state,
      onComplete,
    });
  }

  // Bash (terminal-card | minimal | hidden)
  if (step.bashCommand || step.toolName === "Bash") {
    return React.createElement(BashToolTerminalCard, {
      key: step.id,
      step,
      state,
      onComplete,
    });
  }

  // Action variant or generic fallback
  if (step.toolVariant === "action" || !step.toolVariant) {
    return React.createElement(ActionRow, {
      key: step.id,
      step,
      state,
      onComplete,
      index: actionIndex,
    });
  }

  return React.createElement(GenericToolRow, {
    key: step.id,
    step,
    state,
    onComplete,
  });
}
