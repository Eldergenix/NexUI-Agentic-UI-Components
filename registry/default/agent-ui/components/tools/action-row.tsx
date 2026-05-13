import type { TimelineStep, StepState } from "../../types/timeline";
import { useToolComplete } from "../../hooks/use-tool-complete";
import { ToolRowBase } from "./tool-row-base";

const ACTION_LABELS = [
  "Brewing...",
  "Crafting...",
  "Processing...",
  "Preparing...",
];

export type ActionRowProps = {
  step: Extract<TimelineStep, { type: "tool-call" }>;
  state: StepState;
  onComplete: () => void;
  index: number;
};

export function ActionRow({
  step,
  state,
  onComplete,
  index,
}: ActionRowProps) {
  useToolComplete(state === "animating", step.duration, onComplete);
  const isAnimating = state === "animating";
  const label = ACTION_LABELS[index % ACTION_LABELS.length]!;

  return (
    <ToolRowBase
      shimmerLabel={label}
      completeLabel={step.toolName}
      isAnimating={isAnimating}
    />
  );
}
