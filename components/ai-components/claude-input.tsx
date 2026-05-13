"use client";

/**
 * Claude-style landing composer: rounded prompt surface, model menu with
 * extended thinking, attachment trigger, voice control, and category chips.
 */

import {
  Archive,
  Blocks,
  BriefcaseBusiness,
  Camera,
  Check,
  ChevronDown,
  ChevronRight,
  Feather,
  Globe2,
  Mic,
  MicOff,
  Paperclip,
  Plus,
  Search,
  Volume2,
  X,
} from "lucide-react";
import { stagger } from "motion";
import {
  AnimatePresence,
  LayoutGroup,
  MotionConfig,
  motion,
  type Transition,
  useReducedMotion,
} from "motion/react";
import Image from "next/image";
import type * as React from "react";
import {
  useCallback,
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
} from "react";
import useMeasure from "react-use-measure";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Switch } from "@/components/ui/switch";
import { cn } from "@/lib/utils";

const composerSpring = { type: "spring", duration: 0.4, bounce: 0 } as const;

const controlLayoutSpring = {
  type: "spring",
  stiffness: 620,
  damping: 46,
  mass: 0.55,
} as const;

const fadeEase = [0.23, 1, 0.32, 1] as const;

type VoiceModeState = "idle" | "loading" | "listening" | "error";

/** Label column inside expanded voice button (blur target). Rail grows via flex inside fixed total width. */
const VOICE_MODE_RAIL_WIDTH_BY_STATE_PX: Partial<
  Record<VoiceModeState, number>
> = {
  loading: 58,
  listening: 44,
  error: 58,
};

/** Total `motion.button` width: icon-only vs icon + label column (+ horizontal padding baked in). */
const VOICE_MODE_BUTTON_WIDTH_COLLAPSED_PX = 32; // px-1.5 + w-5 icon + px-1.5
const VOICE_MODE_OVERLAY_WIDTH_EXPANDED_PX = 170; // Mirrors the previous min-w-38 mask width.

/** Slight lag so the pill widens before the label sharpens from blur (exit reverses). */
const VOICE_MODE_TEXT_REVEAL_DELAY_S = 0.06;

/** Keep overlay mounted briefly so VoiceModeButton can run collapse animation. */
const VOICE_MODE_OVERLAY_UNMOUNT_AFTER_COLLAPSE_MS = 480;

/** Make the cancellable loading affordance legible when mic access resolves instantly. */
const VOICE_MODE_LOADING_MIN_DURATION_MS = 420;

/** Playful open spring for the expanding voice button. */
const voiceModeButtonOpenSpring = {
  type: "spring",
  stiffness: 520,
  damping: 31,
  mass: 0.46,
} as const;

/** Snappier collapse spring so dismissal still feels responsive. */
const voiceModeButtonCloseSpring = {
  type: "spring",
  stiffness: 1020,
  damping: 44,
  mass: 0.34,
} as const;

type DeviceLoadResult = "loaded" | "permission-denied" | "unavailable";
type VoiceStartResult =
  | { ok: true }
  | { ok: false; reason: "permission-denied" | "unavailable" };

const voiceModeLabels: Partial<Record<VoiceModeState, string>> = {
  loading: "Cancel",
  listening: "Stop",
  error: "Blocked",
};
const voiceModeListeningScale = [0.9, 1, 0.89, 0.9];

function isVoiceModeExpanded(voiceState: VoiceModeState) {
  return voiceState !== "idle";
}

function getVoiceModeButtonWidth(voiceState: VoiceModeState) {
  if (!isVoiceModeExpanded(voiceState)) {
    return VOICE_MODE_BUTTON_WIDTH_COLLAPSED_PX;
  }

  return 12 + 20 + (VOICE_MODE_RAIL_WIDTH_BY_STATE_PX[voiceState] ?? 0) + 12;
}

function getVoiceModeAriaLabel(voiceState: VoiceModeState) {
  if (voiceState === "loading") {
    return "Cancel voice mode";
  }

  if (voiceState === "listening") {
    return "Stop voice mode";
  }

  if (voiceState === "error") {
    return "Microphone permission blocked";
  }

  return "Use voice mode";
}

function getVoiceModeScale(
  shouldReduceMotion: boolean,
  voiceState: VoiceModeState
) {
  if (shouldReduceMotion || voiceState !== "listening") {
    return 0.9;
  }

  return voiceModeListeningScale;
}

function isPermissionDeniedError(error: unknown) {
  let errorName = "";
  if (error instanceof DOMException) {
    errorName = error.name;
  } else if (typeof error === "object" && error !== null && "name" in error) {
    errorName = String(error.name);
  }

  const speechError = typeof error === "string" ? error : "";
  const permissionErrors = new Set([
    "NotAllowedError",
    "PermissionDeniedError",
    "not-allowed",
    "service-not-allowed",
    "permission-denied",
  ]);

  return permissionErrors.has(errorName) || permissionErrors.has(speechError);
}

function getVoiceModeColorClasses(
  voiceState: VoiceModeState,
  expanded: boolean
) {
  if (voiceState === "error") {
    return "bg-red-100 text-red-800 dark:bg-red-950/70 dark:text-red-200";
  }

  if (expanded) {
    return "bg-blue-100 text-blue-800 dark:bg-blue-950/80 dark:text-blue-200";
  }

  return "text-foreground";
}

function getVoiceModeHoverClasses(
  voiceState: VoiceModeState,
  expanded: boolean
) {
  if (voiceState === "error") {
    return "fine-hover:hover:bg-red-200 dark:fine-hover:hover:bg-red-900";
  }

  if (expanded) {
    return "fine-hover:hover:bg-blue-200 dark:fine-hover:hover:bg-blue-900";
  }

  return "fine-hover:hover:bg-muted/80";
}

function wait(ms: number) {
  return new Promise<void>((resolve) => {
    setTimeout(resolve, ms);
  });
}

async function waitForVoiceModeLoading(startedAt: number) {
  const elapsed = performance.now() - startedAt;
  const remaining = VOICE_MODE_LOADING_MIN_DURATION_MS - elapsed;
  if (remaining > 0) {
    await wait(remaining);
  }
}

function getControlLayoutTransition(shouldReduceMotion: boolean): Transition {
  return shouldReduceMotion
    ? { duration: 0 }
    : {
        layout: controlLayoutSpring,
        opacity: { duration: 0.1, ease: fadeEase },
        scale: { duration: 0.12, ease: fadeEase },
      };
}

function getVoiceModeButtonSizeTransition(
  shouldReduceMotion: boolean,
  voiceActive: boolean
): Transition {
  if (shouldReduceMotion) {
    return { duration: 0 };
  }
  const sizeSpring = voiceActive
    ? voiceModeButtonOpenSpring
    : { ...voiceModeButtonCloseSpring, delay: VOICE_MODE_TEXT_REVEAL_DELAY_S };
  return {
    opacity: { duration: 0.1, ease: fadeEase },
    scale: { duration: 0.5, ease: fadeEase, times: [0, 0.32, 0.72, 1] },
    paddingLeft: sizeSpring,
    paddingRight: sizeSpring,
    width: sizeSpring,
  };
}

function getVoiceModeOverlayTransition(
  shouldReduceMotion: boolean,
  voiceActive: boolean
): Transition {
  if (shouldReduceMotion) {
    return { duration: 0 };
  }
  const widthSpring = voiceActive
    ? voiceModeButtonOpenSpring
    : { ...voiceModeButtonCloseSpring, delay: VOICE_MODE_TEXT_REVEAL_DELAY_S };
  return {
    filter: { duration: 0.14, ease: fadeEase },
    opacity: { duration: 0.14, ease: fadeEase },
    scale: { duration: 0.14, ease: fadeEase },
    width: widthSpring,
    x: { duration: 0.14, ease: fadeEase },
  };
}

function getVoiceModeLabelTransition(
  shouldReduceMotion: boolean,
  expanded: boolean
): Transition {
  if (shouldReduceMotion) {
    return { duration: 0 };
  }

  if (!expanded) {
    return {
      filter: { delay: 0, duration: 0.1, ease: fadeEase },
      opacity: { delay: 0, duration: 0.1, ease: fadeEase },
      x: { duration: 0.14, ease: fadeEase },
      y: { duration: 0.14, ease: fadeEase },
    };
  }

  return {
    filter: {
      delay: VOICE_MODE_TEXT_REVEAL_DELAY_S,
      duration: 0.26,
      ease: fadeEase,
    },
    opacity: {
      delay: VOICE_MODE_TEXT_REVEAL_DELAY_S,
      duration: 0.26,
      ease: fadeEase,
    },
    x: { duration: 0.32, ease: fadeEase },
    y: { duration: 0.32, ease: fadeEase },
  };
}

function getVoiceModeLabelAnimate(shouldReduceMotion: boolean) {
  if (shouldReduceMotion) {
    return { opacity: 1 };
  }

  return { filter: "blur(0px)", opacity: 1, x: 0, y: 0 };
}

function getVoiceModeLabelExit(shouldReduceMotion: boolean, expanded: boolean) {
  if (shouldReduceMotion) {
    return { opacity: 0 };
  }

  if (!expanded) {
    return { filter: "blur(6px)", opacity: 0, x: -2, y: 0 };
  }

  return { filter: "blur(6px)", opacity: 0, x: -7, y: -1 };
}

function getVoiceModeLabelInitial(
  shouldReduceMotion: boolean,
  enteringListening: boolean
) {
  if (shouldReduceMotion) {
    return { opacity: 0 };
  }

  if (!enteringListening) {
    return { filter: "blur(6px)", opacity: 0, x: 2, y: 0 };
  }

  return { filter: "blur(6px)", opacity: 0, x: 8, y: 1 };
}

type VoiceModeLabelRailProps = {
  shouldReduceMotion: boolean;
  voiceState: VoiceModeState;
};

function VoiceModeLabelRail({
  shouldReduceMotion,
  voiceState,
}: VoiceModeLabelRailProps) {
  const label = voiceModeLabels[voiceState];
  const expanded = isVoiceModeExpanded(voiceState);
  const enteringListening = voiceState === "listening";

  return (
    <div aria-hidden={!expanded} className="min-w-0 flex-1 overflow-hidden">
      <AnimatePresence initial={false} mode="popLayout">
        {label ? (
          <motion.span
            animate={getVoiceModeLabelAnimate(shouldReduceMotion)}
            className="block whitespace-nowrap pl-2"
            exit={getVoiceModeLabelExit(shouldReduceMotion, expanded)}
            initial={getVoiceModeLabelInitial(
              shouldReduceMotion,
              enteringListening
            )}
            key={label}
            transition={getVoiceModeLabelTransition(
              shouldReduceMotion,
              expanded
            )}
          >
            {label}
          </motion.span>
        ) : null}
      </AnimatePresence>
    </div>
  );
}

export type PromptCategoryIcon = "write" | "learn" | "code" | "life" | "choice";

type SpeechRecognition = EventTarget & {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  start(): void;
  stop(): void;
  onstart: ((this: SpeechRecognition, ev: Event) => void) | null;
  onend: ((this: SpeechRecognition, ev: Event) => void) | null;
  onresult:
    | ((this: SpeechRecognition, ev: SpeechRecognitionEvent) => void)
    | null;
  onerror:
    | ((this: SpeechRecognition, ev: SpeechRecognitionErrorEvent) => void)
    | null;
};

type SpeechRecognitionEvent = Event & {
  results: SpeechRecognitionResultList;
  resultIndex: number;
};

type SpeechRecognitionResultList = {
  readonly length: number;
  item(index: number): SpeechRecognitionResult;
  [index: number]: SpeechRecognitionResult;
};

type SpeechRecognitionResult = {
  readonly length: number;
  item(index: number): SpeechRecognitionAlternative;
  [index: number]: SpeechRecognitionAlternative;
  isFinal: boolean;
};

type SpeechRecognitionAlternative = {
  transcript: string;
  confidence: number;
};

type SpeechRecognitionErrorEvent = Event & {
  error: string;
};

declare global {
  // biome-ignore lint/style/useConsistentTypeDefinitions: Window augmentation relies on interface merging
  interface Window {
    SpeechRecognition: {
      new (): SpeechRecognition;
    };
    webkitSpeechRecognition: {
      new (): SpeechRecognition;
    };
  }
}

type SpeechInputMode = "speech-recognition" | "media-recorder" | "none";

export type ClaudeModelOption = {
  id: string;
  name: string;
  description: string;
};

export type PromptCategory = {
  id: string;
  label: string;
  icon: PromptCategoryIcon;
};

export type PromptSuggestion = {
  label: string;
  prompt?: string;
};

export const defaultClaudeModels: ClaudeModelOption[] = [
  {
    id: "opus-47",
    name: "Opus 4.7",
    description: "Most capable for ambitious work",
  },
  {
    id: "opus-46",
    name: "Opus 4.6",
    description: "Strong reasoning and long-form work",
  },
  {
    id: "sonnet-46",
    name: "Sonnet 4.6",
    description: "Responsive everyday work",
  },
  {
    id: "haiku-45",
    name: "Haiku 4.5",
    description: "Fastest, most efficient",
  },
];

export const defaultPromptCategories: PromptCategory[] = [
  { id: "write", label: "Write", icon: "write" },
  { id: "learn", label: "Learn", icon: "learn" },
  { id: "code", label: "Code", icon: "code" },
  { id: "life", label: "Life stuff", icon: "life" },
  { id: "choice", label: "Claude's choice", icon: "choice" },
];

export const defaultPromptSuggestions: Record<string, PromptSuggestion[]> = {
  write: [
    { label: "Develop content calendars" },
    { label: "Create social media posts" },
    { label: "Edit my content" },
    { label: "Help me develop a unique voice for an audience" },
    { label: "Develop content templates" },
  ],
  learn: [
    { label: "Create annotated bibliographies" },
    { label: "Create effective flashcards" },
    { label: "Develop concept maps" },
    { label: "Design educational activities" },
    { label: "Develop learning objectives" },
  ],
  code: [
    { label: "Explain this codebase" },
    { label: "Debug a failing test" },
    { label: "Refactor a component" },
    { label: "Write TypeScript types" },
    { label: "Create an API endpoint" },
  ],
  life: [
    { label: "Plan a weekend trip" },
    { label: "Compare buying options" },
    { label: "Draft a polite response" },
    { label: "Organize a moving checklist" },
    { label: "Make a simple meal plan" },
  ],
  choice: [
    { label: "Surprise me with a useful prompt" },
    { label: "Help me think through a decision" },
    { label: "Turn a rough idea into a plan" },
    { label: "Find blind spots in my approach" },
    { label: "Make this more concise" },
  ],
};

/** Local file with optional object-URL preview for image/* types. */
export type ClaudeAttachedFile = {
  id: string;
  file: File;
  /** `blob:` URL for image previews; revoke on remove or unmount. */
  preview: string | null;
  /** Optional UI label for synthetic attachments like large pasted text. */
  displayName?: string;
  /** Optional badge text shown in the attachment tile. */
  badgeLabel?: string;
};

function CategoryGlyph({ icon }: { icon: PromptCategoryIcon }) {
  const paths: Record<PromptCategoryIcon, string> = {
    write:
      "M227.31 73.37 182.63 28.68a16 16 0 0 0-22.63 0L36.69 152A15.86 15.86 0 0 0 32 163.31V208a16 16 0 0 0 16 16h44.69A15.86 15.86 0 0 0 104 219.31L227.31 96a16 16 0 0 0 0-22.63ZM92.69 208H48v-44.69l88-88 44.69 44.69Zm99.31-99.32L147.31 64l24-24 44.69 44.68Z",
    learn:
      "M251.76 88.94l-120-64a8 8 0 0 0-7.52 0l-120 64a8 8 0 0 0 0 14.12L32 117.87v48.42a15.91 15.91 0 0 0 4.06 10.65C49.16 191.53 78.51 216 128 216a130 130 0 0 0 48-8.76V240a8 8 0 0 0 16 0v-40.49a115.63 115.63 0 0 0 27.94-22.57A15.91 15.91 0 0 0 224 166.29v-48.42l27.76-14.81a8 8 0 0 0 0-14.12ZM128 200c-43.27 0-68.72-21.14-80-33.71V126.4l76.24 40.66a8 8 0 0 0 7.52 0L176 143.47v46.34C163.4 195.69 147.52 200 128 200Zm80-33.75a97.83 97.83 0 0 1-16 14.25v-45.32l16-8.53Zm-28-48.31-.22-.13-56-29.87a8 8 0 0 0-7.52 14.12L171 128l-43 22.93L25 96l103-54.93L231 96Z",
    code: "M69.12 94.15 28.5 128l40.62 33.85a8 8 0 1 1-10.24 12.29l-48-40a8 8 0 0 1 0-12.29l48-40a8 8 0 0 1 10.24 12.3Zm176 27.7-48-40a8 8 0 1 0-10.24 12.3L227.5 128l-40.62 33.85a8 8 0 1 0 10.24 12.29l48-40a8 8 0 0 0 0-12.29ZM162.73 32.48a8 8 0 0 0-10.25 4.79l-64 176a8 8 0 0 0 4.79 10.26A8.14 8.14 0 0 0 96 224a8 8 0 0 0 7.52-5.27l64-176a8 8 0 0 0-10.26-4.79Z",
    life: "M80 56V24a8 8 0 0 1 16 0v32a8 8 0 0 1-16 0Zm40 8a8 8 0 0 0 8-8V24a8 8 0 0 0-16 0v32a8 8 0 0 0 8 8Zm32 0a8 8 0 0 0 8-8V24a8 8 0 0 0-16 0v32a8 8 0 0 0 8 8Zm96 56v8a40 40 0 0 1-37.51 39.91 96.59 96.59 0 0 1-27 40.09H208a8 8 0 0 1 0 16H32a8 8 0 0 1 0-16h24.54A96.3 96.3 0 0 1 24 136V88a8 8 0 0 1 8-8h176a40 40 0 0 1 40 40ZM200 96H40v40a80.27 80.27 0 0 0 45.12 72h69.76A80.27 80.27 0 0 0 200 136Zm32 24a24 24 0 0 0-16-22.62V136a95.78 95.78 0 0 1-1.2 15A24 24 0 0 0 232 128Z",
    choice:
      "M176 232a8 8 0 0 1-8 8H88a8 8 0 0 1 0-16h80a8 8 0 0 1 8 8Zm40-128a87.55 87.55 0 0 1-33.64 69.21A16.24 16.24 0 0 0 176 186v6a16 16 0 0 1-16 16H96a16 16 0 0 1-16-16v-6a16 16 0 0 0-6.23-12.66A87.59 87.59 0 0 1 40 104.49C39.74 56.83 78.26 17.14 125.88 16A88 88 0 0 1 216 104Zm-16 0a72 72 0 0 0-73.74-72c-39 .92-70.47 33.39-70.26 72.39a71.65 71.65 0 0 0 27.64 56.3A32 32 0 0 1 96 186v6h64v-6a32.15 32.15 0 0 1 12.47-25.35A71.65 71.65 0 0 0 200 104Zm-16.11-9.34a57.6 57.6 0 0 0-46.56-46.55 8 8 0 0 0-2.66 15.78c16.57 2.79 30.63 16.85 33.44 33.45A8 8 0 0 0 176 104a9 9 0 0 0 1.35-.11 8 8 0 0 0 6.54-9.23Z",
  };

  return (
    <svg
      aria-hidden
      className="-ml-0.5 size-5 shrink-0 text-muted-foreground"
      fill="currentColor"
      viewBox="0 0 256 256"
      xmlns="http://www.w3.org/2000/svg"
    >
      <title>{`${icon} category`}</title>
      <path d={paths[icon]} />
    </svg>
  );
}

type VoiceBar = {
  x: number;
  height: number;
  opacity: number;
  width: number;
  radius: number;
};

function VoiceBarsIcon({
  animate: wantsMotion,
  isHovered,
  shouldReduceMotion,
  variant = "idle",
}: {
  animate: boolean;
  isHovered: boolean;
  shouldReduceMotion: boolean;
  variant?: "idle" | "active";
}) {
  const uniqueId = useId().replace(/:/g, "");
  const idleBars: VoiceBar[] = [
    { x: 0, height: 6, opacity: 1, width: 1, radius: 0.5 },
    { x: 4, height: 10, opacity: 1, width: 1, radius: 0.5 },
    { x: 8, height: 16, opacity: 1, width: 1, radius: 0.5 },
    { x: 12, height: 10, opacity: 1, width: 1, radius: 0.5 },
    { x: 16, height: 16, opacity: 1, width: 1, radius: 0.5 },
    { x: 20, height: 6, opacity: 1, width: 1, radius: 0.5 },
  ];
  const activeBars: VoiceBar[] = [
    { x: -1.5, height: 0, opacity: 0, width: 4, radius: 2 },
    { x: 0.5, height: 12.75, opacity: 1, width: 4, radius: 2 },
    { x: 8.5, height: 6, opacity: 1, width: 4, radius: 2 },
    { x: 10.5, height: 0, opacity: 0, width: 4, radius: 2 },
    { x: 16.5, height: 6, opacity: 1, width: 4, radius: 2 },
    { x: 18.5, height: 0, opacity: 0, width: 4, radius: 2 },
  ];
  const bars = variant === "active" ? activeBars : idleBars;
  const active = variant === "active" && wantsMotion && isHovered;
  const idleSvgClass = `voice-bars-idle-svg-${uniqueId}`;
  const [idleAnimationRunId, setIdleAnimationRunId] = useState(0);
  const wasIdleHoveredRef = useRef(false);
  const idleAnimationName = `${uniqueId}-voice-wave-${idleAnimationRunId}`;

  useEffect(() => {
    if (variant !== "idle") {
      wasIdleHoveredRef.current = false;
      return;
    }

    if (isHovered && !wasIdleHoveredRef.current && !shouldReduceMotion) {
      setIdleAnimationRunId((runId) => runId + 1);
    }

    wasIdleHoveredRef.current = isHovered;
  }, [isHovered, shouldReduceMotion, variant]);

  if (variant === "idle") {
    return (
      <svg
        aria-hidden
        className={`${idleSvgClass} inline-block size-5 overflow-visible text-current`}
        fill="none"
        viewBox="0 0 21 21"
        xmlns="http://www.w3.org/2000/svg"
      >
        <title>Voice mode</title>
        <style>
          {`
            @keyframes ${idleAnimationName}-1 {
              0%, 100% { y: 7.5px; height: 6px; }
              50% { y: 5px; height: 11px; }
            }
            @keyframes ${idleAnimationName}-2 {
              0%, 100% { y: 5.5px; height: 10px; }
              50% { y: 3px; height: 15px; }
            }
            @keyframes ${idleAnimationName}-3 {
              0%, 100% { y: 2.5px; height: 16px; }
              50% { y: 5px; height: 11px; }
            }
            @keyframes ${idleAnimationName}-4 {
              0%, 100% { y: 5.5px; height: 10px; }
              50% { y: 2px; height: 17px; }
            }
            @keyframes ${idleAnimationName}-5 {
              0%, 100% { y: 2.5px; height: 16px; }
              50% { y: 6px; height: 9px; }
            }
            @keyframes ${idleAnimationName}-6 {
              0%, 100% { y: 7.5px; height: 6px; }
              50% { y: 4px; height: 13px; }
            }
            .${idleSvgClass} .bar1 {
              animation: ${
                idleAnimationRunId > 0
                  ? `${idleAnimationName}-1 1s ease-in-out both`
                  : "none"
              };
            }
            .${idleSvgClass} .bar2 {
              animation: ${
                idleAnimationRunId > 0
                  ? `${idleAnimationName}-2 0.9s ease-in-out 0.1s both`
                  : "none"
              };
            }
            .${idleSvgClass} .bar3 {
              animation: ${
                idleAnimationRunId > 0
                  ? `${idleAnimationName}-3 1.1s ease-in-out 0.2s both`
                  : "none"
              };
            }
            .${idleSvgClass} .bar4 {
              animation: ${
                idleAnimationRunId > 0
                  ? `${idleAnimationName}-4 0.85s ease-in-out 0.15s both`
                  : "none"
              };
            }
            .${idleSvgClass} .bar5 {
              animation: ${
                idleAnimationRunId > 0
                  ? `${idleAnimationName}-5 1.05s ease-in-out 0.25s both`
                  : "none"
              };
            }
            .${idleSvgClass} .bar6 {
              animation: ${
                idleAnimationRunId > 0
                  ? `${idleAnimationName}-6 0.95s ease-in-out 0.05s both`
                  : "none"
              };
            }
            @media (prefers-reduced-motion: reduce) {
              .${idleSvgClass} .bar1,
              .${idleSvgClass} .bar2,
              .${idleSvgClass} .bar3,
              .${idleSvgClass} .bar4,
              .${idleSvgClass} .bar5,
              .${idleSvgClass} .bar6 {
                animation: none;
              }
            }
          `}
        </style>
        <rect
          className="bar1"
          fill="currentColor"
          height="6"
          rx="0.5"
          ry="0.5"
          width="1"
          x="0"
          y="7.5"
        />
        <rect
          className="bar2"
          fill="currentColor"
          height="10"
          rx="0.5"
          ry="0.5"
          width="1"
          x="4"
          y="5.5"
        />
        <rect
          className="bar3"
          fill="currentColor"
          height="16"
          rx="0.5"
          ry="0.5"
          width="1"
          x="8"
          y="2.5"
        />
        <rect
          className="bar4"
          fill="currentColor"
          height="10"
          rx="0.5"
          ry="0.5"
          width="1"
          x="12"
          y="5.5"
        />
        <rect
          className="bar5"
          fill="currentColor"
          height="16"
          rx="0.5"
          ry="0.5"
          width="1"
          x="16"
          y="2.5"
        />
        <rect
          className="bar6"
          fill="currentColor"
          height="6"
          rx="0.5"
          ry="0.5"
          width="1"
          x="20"
          y="7.5"
        />
      </svg>
    );
  }

  return (
    <svg
      aria-hidden
      className="inline-block size-5 overflow-visible text-current"
      fill="none"
      viewBox="0 0 21 21"
      xmlns="http://www.w3.org/2000/svg"
    >
      <title>Voice mode</title>
      {bars.map((bar, index) => {
        const animatedHeight =
          bar.opacity === 0
            ? 0
            : [bar.height, Math.max(6, bar.height * 0.55), bar.height * 1.15];
        const animatedY = Array.isArray(animatedHeight)
          ? animatedHeight.map((height) => 10.5 - height / 2)
          : 10.5 - animatedHeight / 2;
        const height = active ? animatedHeight : bar.height;
        const y = active ? animatedY : 10.5 - bar.height / 2;
        return (
          <motion.rect
            animate={{
              height,
              y,
            }}
            fill="currentColor"
            fillOpacity={bar.opacity}
            initial={false}
            key={bar.x}
            rx={bar.radius}
            ry={bar.radius}
            transition={
              active
                ? {
                    duration: 0.85,
                    ease: "easeInOut",
                    repeat: Number.POSITIVE_INFINITY,
                    repeatType: "mirror",
                    delay: index * 0.08,
                  }
                : { duration: 0 }
            }
            width={bar.width}
            x={bar.x}
          />
        );
      })}
    </svg>
  );
}

function GitHubIcon() {
  return (
    <svg
      aria-hidden
      className="size-5"
      fill="currentColor"
      viewBox="0 0 16 16"
      xmlns="http://www.w3.org/2000/svg"
    >
      <title>GitHub</title>
      <path
        clipRule="evenodd"
        d="M8.005 1.4C4.353 1.4 1.4 4.425 1.4 8.167c0 2.991 1.892 5.524 4.517 6.42.328.068.448-.145.448-.325 0-.157-.011-.694-.011-1.255-1.837.404-2.22-.806-2.22-.806-.295-.785-.733-.986-.733-.986-.601-.415.044-.415.044-.415.667.045 1.017.695 1.017.695.591 1.03 1.542.74 1.925.56.054-.437.23-.74.415-.907-1.465-.157-3.007-.74-3.007-3.339 0-.74.262-1.345.678-1.815-.066-.168-.295-.863.066-1.793 0 0 .557-.18 1.815.695a6.2 6.2 0 0 1 1.651-.224c.558 0 1.126.078 1.651.224 1.258-.875 1.816-.695 1.816-.695.36.93.131 1.625.065 1.793.427.47.678 1.075.678 1.815 0 2.599-1.542 3.17-3.018 3.339.24.213.448.616.448 1.254 0 .908-.011 1.636-.011 1.86 0 .18.12.393.448.325 2.625-.896 4.517-3.428 4.517-6.42C14.611 4.425 11.647 1.4 8.005 1.4Z"
        fillRule="evenodd"
      />
    </svg>
  );
}

const composerMenuItemClass = cn(
  "group relative flex min-h-8 cursor-pointer items-center justify-between gap-4 rounded-lg px-2 py-1.5 text-sm outline-none",
  "duration-150 ease-out [transition-property:background-color,color]",
  "focus:bg-muted/80 focus:text-foreground data-open:bg-muted/80 data-popup-open:bg-muted/80"
);

const composerSubContentClass = cn(
  "min-w-52 rounded-xl border border-border/70 bg-card p-1.5 shadow-[0px_2px_8px_0px_oklch(0_0_0/0.08)] ring-0 dark:shadow-[0px_2px_8px_0px_oklch(0_0_0/0.24)]"
);

const voiceControlButtonClass = cn(
  "inline-flex size-9 shrink-0 items-center justify-center rounded-lg outline-none",
  "text-muted-foreground duration-200 ease-out",
  "[transition-property:background-color,transform,color]",
  "fine-hover:hover:bg-muted focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-card",
  "active:scale-[0.96] motion-reduce:active:scale-100"
);

/** Icon-only controls in the audio cluster (reference: h-8 w-8, transition-colors, muted + hover fill). */
const audioClusterIconButtonClass = cn(
  "inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-lg outline-none",
  "text-muted-foreground transition-colors duration-200",
  "fine-hover:hover:bg-muted focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-card"
);

type ComposerMenuRowProps = {
  icon: React.ReactNode;
  label: string;
  shortcut?: string;
  checked?: boolean;
};

function ComposerMenuRow({
  icon,
  label,
  shortcut,
  checked,
}: ComposerMenuRowProps) {
  let trailing: React.ReactNode = null;
  if (checked) {
    trailing = <Check aria-hidden className="size-4 shrink-0 text-sky-600" />;
  } else if (shortcut) {
    trailing = (
      <span className="min-w-0 shrink truncate text-right text-muted-foreground text-xs opacity-0 transition-opacity duration-150 group-hover:opacity-100 group-focus:opacity-100">
        {shortcut}
      </span>
    );
  }

  return (
    <>
      <div className="flex min-w-0 items-center gap-2">
        <span className="flex size-5 shrink-0 items-center justify-center text-foreground">
          {icon}
        </span>
        <span className="min-w-0 flex-1 truncate">{label}</span>
      </div>
      {trailing}
    </>
  );
}

function AudioMenuHeader({
  children,
  icon,
}: {
  children: React.ReactNode;
  icon: React.ReactNode;
}) {
  return (
    <div className="flex items-center gap-2 px-2 pt-1 pb-2 text-muted-foreground text-sm">
      <span className="flex size-5 shrink-0 items-center justify-center">
        {icon}
      </span>
      {children}
    </div>
  );
}

function getDeviceLabel(device: MediaDeviceInfo, fallback: string) {
  return device.label || fallback;
}

function getDeviceValue(device: MediaDeviceInfo) {
  return device.deviceId || device.groupId;
}

function getSelectedDeviceValue(devices: MediaDeviceInfo[], value: string) {
  if (devices.some((device) => getDeviceValue(device) === value)) {
    return value;
  }

  const firstDevice = devices[0];

  return firstDevice ? getDeviceValue(firstDevice) : "";
}

function AudioDeviceItem({
  device,
  fallback,
}: {
  device: MediaDeviceInfo;
  fallback: string;
}) {
  return (
    <DropdownMenuRadioItem
      className={cn(
        "grid min-h-9 cursor-pointer grid-cols-[minmax(0,1fr)_auto] items-center gap-2 rounded-lg px-2 py-1.5 pr-2 text-base outline-none",
        "focus:bg-muted focus:text-foreground data-checked:text-foreground"
      )}
      value={getDeviceValue(device)}
    >
      <span className="min-w-0 truncate">
        {getDeviceLabel(device, fallback)}
      </span>
    </DropdownMenuRadioItem>
  );
}

function detectSpeechInputMode(): SpeechInputMode {
  if (typeof window === "undefined") {
    return "none";
  }

  if ("SpeechRecognition" in window || "webkitSpeechRecognition" in window) {
    return "speech-recognition";
  }

  if ("MediaRecorder" in window && "mediaDevices" in navigator) {
    return "media-recorder";
  }

  return "none";
}

function stopStream(stream: MediaStream | null) {
  for (const track of stream?.getTracks() ?? []) {
    track.stop();
  }
}

function useClaudeAudioDevices() {
  const [devices, setDevices] = useState<MediaDeviceInfo[]>([]);
  const [hasPermission, setHasPermission] = useState(false);

  const loadDevices = useCallback(
    async (requestPermission = false): Promise<DeviceLoadResult> => {
      if (!("mediaDevices" in navigator)) {
        return "unavailable";
      }

      try {
        if (requestPermission && !hasPermission) {
          const stream = await navigator.mediaDevices.getUserMedia({
            audio: true,
          });
          stopStream(stream);
          setHasPermission(true);
        }

        const deviceList = await navigator.mediaDevices.enumerateDevices();
        setDevices(
          deviceList.filter(
            (device) =>
              device.kind === "audioinput" || device.kind === "audiooutput"
          )
        );
        return "loaded";
      } catch (error) {
        try {
          const deviceList = await navigator.mediaDevices.enumerateDevices();
          setDevices(
            deviceList.filter((device) => device.kind === "audioinput")
          );
        } catch {
          setDevices([]);
        }

        return isPermissionDeniedError(error)
          ? "permission-denied"
          : "unavailable";
      }
    },
    [hasPermission]
  );

  useEffect(() => {
    if (!("mediaDevices" in navigator)) {
      return;
    }

    loadDevices(false);

    const handleDeviceChange = () => {
      loadDevices(hasPermission);
    };

    navigator.mediaDevices.addEventListener("devicechange", handleDeviceChange);

    return () => {
      navigator.mediaDevices.removeEventListener(
        "devicechange",
        handleDeviceChange
      );
    };
  }, [hasPermission, loadDevices]);

  return {
    loadDevices,
    microphones: devices.filter((device) => device.kind === "audioinput"),
    speakers: devices.filter((device) => device.kind === "audiooutput"),
  };
}

type ClaudeVoiceControlsProps = {
  lang?: string;
  onAudioRecorded?: (audioBlob: Blob) => Promise<string>;
  onTranscriptionChange?: (text: string) => void;
  onVoiceActiveChange?: (active: boolean) => void;
  onVoiceClick?: () => void;
  shouldReduceMotion: boolean;
};

type AudioSettingsControlsProps = {
  controlLayoutTransition: Transition;
  audioSettingsOpen: boolean;
  isListening: boolean;
  microphoneEnabled: boolean;
  microphones: MediaDeviceInfo[];
  onAudioSettingsOpenChange: (open: boolean) => void;
  onMicrophoneToggle: () => void;
  onMicrophoneValueChange: (value: string) => void;
  onSpeakerValueChange: (value: string) => void;
  selectedMicrophoneValue: string;
  selectedSpeakerValue: string;
  shouldReduceMotion: boolean;
  speakers: MediaDeviceInfo[];
};

function AudioSettingsControls({
  controlLayoutTransition,
  audioSettingsOpen,
  isListening,
  microphoneEnabled,
  microphones,
  onAudioSettingsOpenChange,
  onMicrophoneToggle,
  onMicrophoneValueChange,
  onSpeakerValueChange,
  selectedMicrophoneValue,
  selectedSpeakerValue,
  shouldReduceMotion,
  speakers,
}: AudioSettingsControlsProps) {
  return (
    <motion.div
      animate={{ opacity: 1, filter: "blur(0px)", x: 0 }}
      className={cn(
        "group/audio-settings flex items-center rounded-lg transition-colors duration-200",
        "fine-hover:hover:bg-muted/70 has-[[data-popup-open]]:bg-muted/70",
        audioSettingsOpen && "bg-muted/70"
      )}
      exit={
        shouldReduceMotion
          ? { opacity: 0 }
          : { opacity: 0, filter: "blur(2px)", x: -3 }
      }
      initial={
        shouldReduceMotion ? false : { opacity: 0, filter: "blur(2px)", x: 4 }
      }
      layout="position"
      transition={controlLayoutTransition}
    >
      <DropdownMenu
        onOpenChange={onAudioSettingsOpenChange}
        open={audioSettingsOpen}
      >
        <DropdownMenuTrigger asChild>
          <button
            aria-expanded={audioSettingsOpen}
            aria-haspopup="menu"
            aria-label="Audio settings"
            className={cn(
              audioClusterIconButtonClass,
              "w-0 overflow-hidden p-0 opacity-0 transition-all duration-200",
              "[transition-property:width,opacity,background-color,color]",
              "group-focus-within/audio-settings:w-8 group-focus-within/audio-settings:opacity-100",
              "fine-hover:group-hover/audio-settings:w-8 fine-hover:group-hover/audio-settings:opacity-100",
              audioSettingsOpen && "w-8 opacity-100",
              "data-popup-open:bg-muted"
            )}
            type="button"
          >
            <span className="flex size-full items-center justify-center">
              <ChevronDown aria-hidden className="size-5" strokeWidth={2} />
            </span>
          </button>
        </DropdownMenuTrigger>

        <DropdownMenuContent
          align="end"
          className={cn(
            "w-[min(34rem,calc(100vw-2rem))] rounded-2xl border border-border/70 bg-card p-3 text-foreground shadow-xl ring-0",
            "max-h-[min(var(--available-height),28rem)] overflow-y-auto"
          )}
          side="top"
          sideOffset={12}
        >
          <AudioMenuHeader
            icon={<Volume2 aria-hidden className="size-5" strokeWidth={1.75} />}
          >
            <span>Speakers</span>
          </AudioMenuHeader>

          <DropdownMenuRadioGroup
            onValueChange={onSpeakerValueChange}
            value={selectedSpeakerValue}
          >
            {speakers.map((device, index) => (
              <AudioDeviceItem
                device={device}
                fallback={`Speaker ${index + 1}`}
                key={getDeviceValue(device)}
              />
            ))}
          </DropdownMenuRadioGroup>

          <DropdownMenuSeparator className="mx-2 my-2 h-px bg-border/80" />

          <AudioMenuHeader
            icon={<Mic aria-hidden className="size-5" strokeWidth={1.75} />}
          >
            <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-muted">
              <motion.div
                animate={{
                  width:
                    microphoneEnabled && isListening
                      ? ["18%", "34%", "22%"]
                      : "0%",
                }}
                className="h-full rounded-full bg-blue-600"
                transition={
                  shouldReduceMotion || !(microphoneEnabled && isListening)
                    ? { duration: 0 }
                    : {
                        duration: 1.2,
                        ease: "easeInOut",
                        repeat: Number.POSITIVE_INFINITY,
                      }
                }
              />
            </div>
          </AudioMenuHeader>

          <DropdownMenuRadioGroup
            onValueChange={onMicrophoneValueChange}
            value={selectedMicrophoneValue}
          >
            {microphones.map((device, index) => (
              <AudioDeviceItem
                device={device}
                fallback={`Microphone ${index + 1}`}
                key={getDeviceValue(device)}
              />
            ))}
          </DropdownMenuRadioGroup>
        </DropdownMenuContent>
      </DropdownMenu>

      <motion.button
        animate={{ opacity: 1 }}
        aria-label={
          microphoneEnabled ? "Turn off microphone" : "Turn on microphone"
        }
        aria-pressed={microphoneEnabled}
        className={audioClusterIconButtonClass}
        onClick={onMicrophoneToggle}
        type="button"
      >
        <span className="relative flex size-full items-center justify-center">
          <AnimatePresence initial={false} mode="popLayout">
            <motion.span
              animate={
                shouldReduceMotion
                  ? { opacity: 1 }
                  : { filter: "blur(0px)", opacity: 1, scale: 1 }
              }
              className="absolute inset-0 flex items-center justify-center"
              exit={
                shouldReduceMotion
                  ? { opacity: 0 }
                  : { filter: "blur(3px)", opacity: 0, scale: 0.88 }
              }
              initial={
                shouldReduceMotion
                  ? { opacity: 0 }
                  : { filter: "blur(3px)", opacity: 0, scale: 0.82 }
              }
              key={microphoneEnabled ? "mic-on" : "mic-off"}
              transition={
                shouldReduceMotion
                  ? { duration: 0 }
                  : { duration: 0.18, ease: fadeEase }
              }
            >
              {microphoneEnabled ? (
                <Mic aria-hidden className="size-5" strokeWidth={2} />
              ) : (
                <MicOff aria-hidden className="size-5" strokeWidth={2} />
              )}
            </motion.span>
          </AnimatePresence>
        </span>
      </motion.button>
    </motion.div>
  );
}

type VoiceModeButtonProps = {
  controlLayoutTransition: Transition;
  hiddenFromInteraction?: boolean;
  isListening: boolean;
  microphoneEnabled: boolean;
  onStart: () => void;
  onStop: () => void;
  onVoiceHoverChange: (hovered: boolean) => void;
  shouldReduceMotion: boolean;
  voiceHover: boolean;
  voiceState: VoiceModeState;
};

function VoiceModeButton({
  controlLayoutTransition: _ctl,
  hiddenFromInteraction = false,
  isListening,
  microphoneEnabled,
  onStart,
  onStop,
  onVoiceHoverChange,
  shouldReduceMotion,
  voiceHover,
  voiceState,
}: VoiceModeButtonProps) {
  const expanded = isVoiceModeExpanded(voiceState);
  const width = getVoiceModeButtonWidth(voiceState);
  const paddingX = expanded ? 12 : 6;

  return (
    <motion.button
      animate={{
        opacity: 1,
        paddingLeft: paddingX,
        paddingRight: paddingX,
        scale: getVoiceModeScale(shouldReduceMotion, voiceState),
        width,
      }}
      aria-hidden={hiddenFromInteraction || undefined}
      aria-label={getVoiceModeAriaLabel(voiceState)}
      className={cn(
        "relative inline-flex h-9 shrink-0 items-center overflow-hidden rounded-lg font-semibold text-sm outline-none",
        "duration-200 ease-out [transition-property:background-color,color]",
        "box-border",
        getVoiceModeColorClasses(voiceState, expanded),
        getVoiceModeHoverClasses(voiceState, expanded),
        "focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-card",
        "active:scale-[0.98] disabled:pointer-events-none disabled:opacity-0 motion-reduce:active:scale-100"
      )}
      disabled={hiddenFromInteraction}
      initial={false}
      onClick={expanded ? onStop : onStart}
      onPointerEnter={() => onVoiceHoverChange(true)}
      onPointerLeave={() => onVoiceHoverChange(false)}
      tabIndex={hiddenFromInteraction ? -1 : undefined}
      transition={getVoiceModeButtonSizeTransition(
        shouldReduceMotion,
        expanded
      )}
      type="button"
    >
      <span className="relative flex h-5 w-5 shrink-0 items-center justify-center">
        <VoiceBarsIcon
          animate={
            !(
              shouldReduceMotion ||
              !microphoneEnabled ||
              (voiceState !== "loading" && !isListening)
            )
          }
          isHovered={expanded ? voiceHover || isListening : voiceHover}
          shouldReduceMotion={shouldReduceMotion}
          variant={expanded ? "active" : "idle"}
        />
      </span>
      <VoiceModeLabelRail
        shouldReduceMotion={shouldReduceMotion}
        voiceState={voiceState}
      />
    </motion.button>
  );
}

function ClaudeVoiceControls({
  lang = "en-US",
  onAudioRecorded,
  onTranscriptionChange,
  onVoiceActiveChange,
  onVoiceClick,
  shouldReduceMotion,
}: ClaudeVoiceControlsProps) {
  const controlLayoutTransition =
    getControlLayoutTransition(shouldReduceMotion);
  const [voiceHover, setVoiceHover] = useState(false);
  const [voiceOverlayMounted, setVoiceOverlayMounted] = useState(false);
  const [voiceState, setVoiceState] = useState<VoiceModeState>("idle");
  const [microphoneEnabled, setMicrophoneEnabled] = useState(true);
  const [isListening, setIsListening] = useState(false);
  const [mode, setMode] = useState<SpeechInputMode>("none");
  const [audioSettingsOpen, setAudioSettingsOpen] = useState(false);
  const [selectedSpeakerId, setSelectedSpeakerId] = useState("");
  const [selectedMicrophoneId, setSelectedMicrophoneId] = useState("");
  const recognitionRef = useRef<SpeechRecognition | null>(null);
  const recognitionRunningRef = useRef(false);
  const recognitionStoppingRef = useRef(false);
  const restartRecognitionOnEndRef = useRef(false);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const mediaStreamRef = useRef<MediaStream | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const voiceOverlayUnmountTimerRef = useRef<ReturnType<
    typeof setTimeout
  > | null>(null);
  const voiceStartRequestIdRef = useRef(0);
  const { loadDevices, microphones, speakers } = useClaudeAudioDevices();
  const voiceExpanded = isVoiceModeExpanded(voiceState);

  const selectedSpeakerValue = getSelectedDeviceValue(
    speakers,
    selectedSpeakerId
  );
  const selectedMicrophoneValue = getSelectedDeviceValue(
    microphones,
    selectedMicrophoneId
  );

  useEffect(() => {
    setMode(detectSpeechInputMode());
  }, []);

  useEffect(() => {
    if (mode !== "speech-recognition") {
      return;
    }

    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = lang;
    recognition.onstart = () => {
      recognitionRunningRef.current = true;
      recognitionStoppingRef.current = false;
      setIsListening(true);
      setVoiceState("listening");
    };
    recognition.onend = () => {
      recognitionRunningRef.current = false;
      recognitionStoppingRef.current = false;
      setIsListening(false);

      if (restartRecognitionOnEndRef.current) {
        restartRecognitionOnEndRef.current = false;
        recognition.start();
      }
    };
    recognition.onerror = (event) => {
      recognitionRunningRef.current = false;
      recognitionStoppingRef.current = false;
      restartRecognitionOnEndRef.current = false;
      setIsListening(false);
      if (isPermissionDeniedError(event.error)) {
        setMicrophoneEnabled(false);
        setVoiceState("error");
      }
    };
    recognition.onresult = (event) => {
      let finalTranscript = "";
      for (
        let index = event.resultIndex;
        index < event.results.length;
        index++
      ) {
        const result = event.results[index];
        if (result.isFinal) {
          finalTranscript += result[0]?.transcript ?? "";
        }
      }
      if (finalTranscript) {
        onTranscriptionChange?.(finalTranscript);
      }
    };

    recognitionRef.current = recognition;

    return () => {
      restartRecognitionOnEndRef.current = false;
      recognition.stop();
    };
  }, [lang, mode, onTranscriptionChange]);

  useEffect(() => {
    if (audioSettingsOpen) {
      loadDevices(true);
    }
  }, [audioSettingsOpen, loadDevices]);

  useEffect(
    () => () => {
      restartRecognitionOnEndRef.current = false;
      recognitionRef.current?.stop();
      mediaRecorderRef.current?.stop();
      stopStream(mediaStreamRef.current);
      if (voiceOverlayUnmountTimerRef.current) {
        clearTimeout(voiceOverlayUnmountTimerRef.current);
      }
    },
    []
  );

  const startMediaRecorder = useCallback(async () => {
    if (!onAudioRecorded) {
      return { ok: false, reason: "unavailable" } satisfies VoiceStartResult;
    }

    try {
      const audio: boolean | MediaTrackConstraints = selectedMicrophoneValue
        ? { deviceId: { exact: selectedMicrophoneValue } }
        : true;
      const stream = await navigator.mediaDevices.getUserMedia({ audio });
      const mediaRecorder = new MediaRecorder(stream);
      audioChunksRef.current = [];
      mediaStreamRef.current = stream;
      mediaRecorderRef.current = mediaRecorder;

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };
      mediaRecorder.onstop = async () => {
        stopStream(stream);
        mediaStreamRef.current = null;
        const audioBlob = new Blob(audioChunksRef.current, {
          type: "audio/webm",
        });
        if (audioBlob.size > 0) {
          const transcript = await onAudioRecorded(audioBlob);
          if (transcript) {
            onTranscriptionChange?.(transcript);
          }
        }
        setIsListening(false);
      };

      mediaRecorder.start();
      setIsListening(true);
      setVoiceState("listening");
      return { ok: true } satisfies VoiceStartResult;
    } catch (error) {
      return {
        ok: false,
        reason: isPermissionDeniedError(error)
          ? "permission-denied"
          : "unavailable",
      } satisfies VoiceStartResult;
    }
  }, [onAudioRecorded, onTranscriptionChange, selectedMicrophoneValue]);

  const startSpeechRecognition = useCallback((): VoiceStartResult => {
    const recognition = recognitionRef.current;
    if (!recognition) {
      return { ok: false, reason: "unavailable" };
    }

    if (recognitionRunningRef.current) {
      if (recognitionStoppingRef.current) {
        restartRecognitionOnEndRef.current = true;
      }

      return { ok: true };
    }

    try {
      recognitionRunningRef.current = true;
      recognition.start();
      return { ok: true };
    } catch (error) {
      recognitionRunningRef.current = false;
      return {
        ok: false,
        reason: isPermissionDeniedError(error)
          ? "permission-denied"
          : "unavailable",
      };
    }
  }, []);

  const startListening = useCallback(async () => {
    if (mode === "speech-recognition") {
      return startSpeechRecognition();
    }

    if (mode === "media-recorder" && onAudioRecorded) {
      return await startMediaRecorder();
    }

    return { ok: false, reason: "unavailable" } satisfies VoiceStartResult;
  }, [mode, onAudioRecorded, startMediaRecorder, startSpeechRecognition]);

  const stopListening = useCallback(() => {
    restartRecognitionOnEndRef.current = false;
    if (recognitionRunningRef.current) {
      recognitionStoppingRef.current = true;
      recognitionRef.current?.stop();
    }
    if (mediaRecorderRef.current?.state === "recording") {
      mediaRecorderRef.current.stop();
    }
    setIsListening(false);
  }, []);

  const startVoiceMode = async () => {
    const requestId = voiceStartRequestIdRef.current + 1;
    voiceStartRequestIdRef.current = requestId;
    const loadingStartedAt = performance.now();

    if (voiceOverlayUnmountTimerRef.current) {
      clearTimeout(voiceOverlayUnmountTimerRef.current);
      voiceOverlayUnmountTimerRef.current = null;
    }

    setVoiceOverlayMounted(true);
    setVoiceState("loading");
    setMicrophoneEnabled(true);
    onVoiceActiveChange?.(true);
    onVoiceClick?.();

    const deviceLoadResult = await loadDevices(true);
    if (voiceStartRequestIdRef.current !== requestId) {
      return;
    }
    if (deviceLoadResult === "permission-denied") {
      setMicrophoneEnabled(false);
      setVoiceState("error");
      return;
    }

    await waitForVoiceModeLoading(loadingStartedAt);
    if (voiceStartRequestIdRef.current !== requestId) {
      return;
    }

    const startResult = await startListening();
    if (voiceStartRequestIdRef.current !== requestId) {
      return;
    }
    if (!startResult.ok) {
      setMicrophoneEnabled(false);
      setVoiceState("error");
    }
  };

  const stopVoiceMode = () => {
    voiceStartRequestIdRef.current += 1;
    stopListening();
    setVoiceState("idle");
    onVoiceActiveChange?.(false);

    if (voiceOverlayUnmountTimerRef.current) {
      clearTimeout(voiceOverlayUnmountTimerRef.current);
      voiceOverlayUnmountTimerRef.current = null;
    }

    if (shouldReduceMotion) {
      setVoiceOverlayMounted(false);
    } else {
      voiceOverlayUnmountTimerRef.current = setTimeout(() => {
        setVoiceOverlayMounted(false);
        voiceOverlayUnmountTimerRef.current = null;
      }, VOICE_MODE_OVERLAY_UNMOUNT_AFTER_COLLAPSE_MS);
    }

    setAudioSettingsOpen(false);
    setVoiceHover(false);
  };

  const toggleMicrophone = async () => {
    if (microphoneEnabled) {
      stopListening();
      setMicrophoneEnabled(false);
      return;
    }

    const didStart = await startListening();
    if (didStart.ok) {
      setMicrophoneEnabled(true);
    } else {
      setMicrophoneEnabled(false);
      setVoiceState("error");
    }
  };

  return (
    <div className="relative flex shrink-0 items-center justify-end">
      <VoiceModeButton
        controlLayoutTransition={controlLayoutTransition}
        hiddenFromInteraction={voiceOverlayMounted}
        isListening={isListening}
        microphoneEnabled={microphoneEnabled}
        onStart={startVoiceMode}
        onStop={stopVoiceMode}
        onVoiceHoverChange={setVoiceHover}
        shouldReduceMotion={shouldReduceMotion}
        voiceHover={voiceExpanded ? false : voiceHover}
        voiceState="idle"
      />

      <AnimatePresence initial={false} mode="popLayout">
        {voiceOverlayMounted ? (
          <motion.div
            animate={{
              opacity: 1,
              filter: "blur(0px)",
              scale: 1,
              width: voiceExpanded
                ? VOICE_MODE_OVERLAY_WIDTH_EXPANDED_PX
                : VOICE_MODE_BUTTON_WIDTH_COLLAPSED_PX,
              x: 0,
            }}
            className="-translate-y-1/2 absolute top-1/2 right-0 z-20 flex items-center justify-end gap-1 overflow-hidden rounded-lg bg-card dark:bg-[#2C2C2B]"
            exit={
              shouldReduceMotion
                ? { opacity: 0 }
                : { opacity: 0, filter: "blur(2px)", scale: 0.98, x: 4 }
            }
            initial={
              shouldReduceMotion
                ? false
                : {
                    opacity: 0,
                    filter: "blur(2px)",
                    scale: 0.98,
                    width: VOICE_MODE_OVERLAY_WIDTH_EXPANDED_PX,
                    x: 6,
                  }
            }
            key="claude-voice-overlay"
            transition={getVoiceModeOverlayTransition(
              shouldReduceMotion,
              voiceExpanded
            )}
          >
            <AnimatePresence initial={false} mode="popLayout">
              {voiceExpanded ? (
                <AudioSettingsControls
                  audioSettingsOpen={audioSettingsOpen}
                  controlLayoutTransition={controlLayoutTransition}
                  isListening={isListening}
                  key="claude-audio-settings-controls"
                  microphoneEnabled={microphoneEnabled}
                  microphones={microphones}
                  onAudioSettingsOpenChange={setAudioSettingsOpen}
                  onMicrophoneToggle={toggleMicrophone}
                  onMicrophoneValueChange={setSelectedMicrophoneId}
                  onSpeakerValueChange={setSelectedSpeakerId}
                  selectedMicrophoneValue={selectedMicrophoneValue}
                  selectedSpeakerValue={selectedSpeakerValue}
                  shouldReduceMotion={shouldReduceMotion}
                  speakers={speakers}
                />
              ) : null}
            </AnimatePresence>

            <VoiceModeButton
              controlLayoutTransition={controlLayoutTransition}
              isListening={isListening}
              microphoneEnabled={microphoneEnabled}
              onStart={startVoiceMode}
              onStop={stopVoiceMode}
              onVoiceHoverChange={setVoiceHover}
              shouldReduceMotion={shouldReduceMotion}
              voiceHover={voiceHover || isListening}
              voiceState={voiceState}
            />
          </motion.div>
        ) : null}
      </AnimatePresence>
    </div>
  );
}

type ClaudeModelSelectorProps = {
  extendedThinking: boolean;
  menuId: string;
  menuOpen: boolean;
  modelId: string;
  models: ClaudeModelOption[];
  onMoreModelsClick?: () => void;
  onOpenChange: (open: boolean) => void;
  onSelectModel: (model: ClaudeModelOption) => void;
  onSetExtendedThinking: (value: boolean) => void;
  selectedModel: ClaudeModelOption;
  shouldReduceMotion: boolean | null;
  voiceControlsActive: boolean;
};

function ClaudeModelSelector({
  extendedThinking,
  menuId,
  menuOpen,
  modelId,
  models,
  onMoreModelsClick,
  onOpenChange,
  onSelectModel,
  onSetExtendedThinking,
  selectedModel,
  shouldReduceMotion,
  voiceControlsActive,
}: ClaudeModelSelectorProps) {
  return (
    <motion.div
      aria-hidden={voiceControlsActive}
      className={cn(
        "overflow-hidden",
        voiceControlsActive && "pointer-events-none"
      )}
      layout="position"
      layoutDependency={voiceControlsActive}
      transition={getControlLayoutTransition(Boolean(shouldReduceMotion))}
    >
      <Popover
        onOpenChange={onOpenChange}
        open={voiceControlsActive ? false : menuOpen}
      >
        <PopoverTrigger asChild>
          <button
            aria-controls={menuOpen ? menuId : undefined}
            aria-expanded={menuOpen}
            aria-haspopup="dialog"
            aria-label={`Model: ${selectedModel.name}${extendedThinking ? " Extended" : ""}`}
            className={cn(
              "relative inline-flex h-9 shrink-0 items-center gap-1 rounded-md px-3",
              "min-w-16 whitespace-nowrap text-xs outline-none",
              "text-foreground duration-200 ease-[cubic-bezier(0.165,0.85,0.45,1)]",
              "[transition-property:background-color,transform,color]",
              "fine-hover:hover:bg-muted/80 focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-card",
              "active:scale-[0.96] motion-reduce:active:scale-100"
            )}
            disabled={voiceControlsActive}
            type="button"
          >
            <span className="inline-flex h-3.5 items-baseline gap-1.5 text-[14px] leading-none">
              <span className="select-none whitespace-nowrap">
                {selectedModel.name}
              </span>
            </span>
            <ChevronDown
              aria-hidden
              className="size-3.5 shrink-0 opacity-75"
              strokeWidth={2}
            />
          </button>
        </PopoverTrigger>

        <PopoverContent
          align="end"
          className="w-[min(22rem,calc(100vw-2rem))] gap-0 overflow-hidden p-0 text-sm shadow-md ring-1 ring-foreground/10"
          id={menuId}
          side="bottom"
          sideOffset={8}
        >
          <div className="max-h-[min(24rem,var(--available-height))] overflow-y-auto py-1">
            <div className="flex flex-col">
              {models.map((model) => (
                <button
                  className={cn(
                    "flex w-full flex-col gap-0.5 px-3 py-2.5 text-left outline-none",
                    "[transition-property:background-color,color]",
                    "duration-150 ease-out fine-hover:hover:bg-muted/70",
                    "focus-visible:bg-muted/70",
                    model.id === modelId && "bg-muted/50"
                  )}
                  key={model.id}
                  onClick={() => onSelectModel(model)}
                  type="button"
                >
                  <span className="font-semibold text-foreground">
                    {model.name}
                  </span>
                  <span className="text-muted-foreground text-xs leading-snug">
                    {model.description}
                  </span>
                </button>
              ))}

              <div className="mx-1 my-1 flex items-center gap-3 rounded-md bg-muted/60 px-3 py-2">
                <div className="min-w-0 flex-1">
                  <div className="font-semibold text-foreground text-sm">
                    Extended thinking
                  </div>
                  <p className="text-muted-foreground text-xs leading-snug">
                    Think longer for complex tasks.
                  </p>
                </div>
                <Switch
                  aria-label="Extended thinking"
                  checked={extendedThinking}
                  className="data-checked:bg-blue-600 dark:data-checked:bg-blue-500"
                  onCheckedChange={onSetExtendedThinking}
                />
              </div>

              <button
                className={cn(
                  "flex w-full items-center gap-2 px-3 py-2.5 text-left outline-none",
                  "[transition-property:background-color,color]",
                  "duration-150 ease-out fine-hover:hover:bg-muted/70",
                  "focus-visible:bg-muted/70"
                )}
                onClick={() => {
                  onOpenChange(false);
                  onMoreModelsClick?.();
                }}
                type="button"
              >
                <span className="flex-1 font-medium text-foreground text-sm">
                  More models
                </span>
                <ChevronRight
                  aria-hidden
                  className="size-4 text-muted-foreground"
                />
              </button>
            </div>
          </div>
        </PopoverContent>
      </Popover>
    </motion.div>
  );
}

type ClaudePlusMenuProps = {
  fileInputRef: React.RefObject<HTMLInputElement | null>;
  onOpenChange: (open: boolean) => void;
  onResearchEnabledChange: (checked: boolean) => void;
  onWebSearchEnabledChange: (checked: boolean) => void;
  open: boolean;
  researchEnabled: boolean;
  webSearchEnabled: boolean;
};

function ClaudePlusMenu({
  fileInputRef,
  onOpenChange,
  onResearchEnabledChange,
  onWebSearchEnabledChange,
  open,
  researchEnabled,
  webSearchEnabled,
}: ClaudePlusMenuProps) {
  return (
    <DropdownMenu onOpenChange={onOpenChange} open={open}>
      <DropdownMenuTrigger asChild>
        <button
          aria-expanded={open}
          aria-haspopup="menu"
          aria-label="Add files, connectors, and more"
          className={cn(
            "relative isolate inline-flex size-10 shrink-0 items-center justify-center rounded-lg",
            "text-muted-foreground outline-none",
            "duration-200 ease-[cubic-bezier(0.165,0.85,0.45,1)]",
            "[transition-property:background-color,transform,color]",
            "fine-hover:hover:bg-muted/80 focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-card data-popup-open:bg-muted/80",
            "active:scale-[0.96] motion-reduce:active:scale-100"
          )}
          type="button"
        >
          <Plus aria-hidden className="size-5 shrink-0" strokeWidth={1.5} />
        </button>
      </DropdownMenuTrigger>

      <DropdownMenuContent
        align="start"
        className={cn(
          "min-w-48 max-w-80 rounded-xl border border-border/70 bg-card p-1.5 text-foreground shadow-[0px_2px_8px_0px_oklch(0_0_0/0.08)] ring-0 dark:shadow-[0px_2px_8px_0px_oklch(0_0_0/0.24)]",
          "max-h-[min(var(--available-height),24rem)] overflow-y-auto"
        )}
        side="bottom"
        sideOffset={8}
      >
        <DropdownMenuItem
          className={composerMenuItemClass}
          onClick={() => fileInputRef.current?.click()}
        >
          <ComposerMenuRow
            icon={
              <Paperclip aria-hidden className="size-5" strokeWidth={1.75} />
            }
            label="Add files or photos"
            shortcut="⌘U"
          />
        </DropdownMenuItem>
        <DropdownMenuItem className={composerMenuItemClass}>
          <ComposerMenuRow
            icon={<Camera aria-hidden className="size-5" strokeWidth={1.75} />}
            label="Take a screenshot"
          />
        </DropdownMenuItem>
        <DropdownMenuSub>
          <DropdownMenuSubTrigger className={composerMenuItemClass}>
            <ComposerMenuRow
              icon={
                <Archive aria-hidden className="size-5" strokeWidth={1.75} />
              }
              label="Add to project"
            />
          </DropdownMenuSubTrigger>
          <DropdownMenuSubContent className={composerSubContentClass}>
            <DropdownMenuItem className={composerMenuItemClass}>
              <ComposerMenuRow
                icon={
                  <BriefcaseBusiness
                    aria-hidden
                    className="size-5"
                    strokeWidth={1.75}
                  />
                }
                label="Current project"
              />
            </DropdownMenuItem>
            <DropdownMenuItem className={composerMenuItemClass}>
              <ComposerMenuRow
                icon={
                  <Plus aria-hidden className="size-5" strokeWidth={1.75} />
                }
                label="Create project"
              />
            </DropdownMenuItem>
          </DropdownMenuSubContent>
        </DropdownMenuSub>
        <DropdownMenuItem className={composerMenuItemClass}>
          <ComposerMenuRow icon={<GitHubIcon />} label="Add from GitHub" />
        </DropdownMenuItem>

        <DropdownMenuSeparator className="mx-2 my-1.5 h-px bg-border/70" />

        <DropdownMenuSub>
          <DropdownMenuSubTrigger className={composerMenuItemClass}>
            <ComposerMenuRow
              icon={
                <Archive aria-hidden className="size-5" strokeWidth={1.75} />
              }
              label="Skills"
            />
          </DropdownMenuSubTrigger>
          <DropdownMenuSubContent className={composerSubContentClass}>
            <DropdownMenuItem className={composerMenuItemClass}>
              <ComposerMenuRow
                icon={
                  <Feather aria-hidden className="size-5" strokeWidth={1.75} />
                }
                label="skill-creator"
              />
            </DropdownMenuItem>
            <DropdownMenuSeparator className="mx-2 my-1.5 h-px bg-border/70" />
            <DropdownMenuItem className={composerMenuItemClass}>
              <ComposerMenuRow
                icon={
                  <BriefcaseBusiness
                    aria-hidden
                    className="size-5"
                    strokeWidth={1.75}
                  />
                }
                label="Manage skills"
              />
            </DropdownMenuItem>
            <DropdownMenuItem className={composerMenuItemClass}>
              <ComposerMenuRow
                icon={
                  <Plus aria-hidden className="size-5" strokeWidth={1.75} />
                }
                label="Add skill"
              />
            </DropdownMenuItem>
          </DropdownMenuSubContent>
        </DropdownMenuSub>
        <DropdownMenuItem className={composerMenuItemClass}>
          <ComposerMenuRow
            icon={<Blocks aria-hidden className="size-5" strokeWidth={1.75} />}
            label="Add connectors"
          />
        </DropdownMenuItem>

        <DropdownMenuSeparator className="mx-2 my-1.5 h-px bg-border/70" />

        <DropdownMenuCheckboxItem
          checked={researchEnabled}
          className={composerMenuItemClass}
          onCheckedChange={onResearchEnabledChange}
        >
          <ComposerMenuRow
            icon={<Search aria-hidden className="size-5" strokeWidth={1.75} />}
            label="Research"
          />
        </DropdownMenuCheckboxItem>
        <DropdownMenuCheckboxItem
          checked={webSearchEnabled}
          className={composerMenuItemClass}
          onCheckedChange={onWebSearchEnabledChange}
        >
          <ComposerMenuRow
            checked={webSearchEnabled}
            icon={<Globe2 aria-hidden className="size-5" strokeWidth={1.75} />}
            label="Web search"
          />
        </DropdownMenuCheckboxItem>
        <DropdownMenuSub>
          <DropdownMenuSubTrigger className={composerMenuItemClass}>
            <ComposerMenuRow
              icon={
                <Feather aria-hidden className="size-5" strokeWidth={1.75} />
              }
              label="Use style"
            />
          </DropdownMenuSubTrigger>
          <DropdownMenuSubContent className={composerSubContentClass}>
            <DropdownMenuItem className={composerMenuItemClass}>
              <ComposerMenuRow
                icon={
                  <Feather aria-hidden className="size-5" strokeWidth={1.75} />
                }
                label="Concise"
              />
            </DropdownMenuItem>
            <DropdownMenuItem className={composerMenuItemClass}>
              <ComposerMenuRow
                icon={
                  <Feather aria-hidden className="size-5" strokeWidth={1.75} />
                }
                label="Explanatory"
              />
            </DropdownMenuItem>
          </DropdownMenuSubContent>
        </DropdownMenuSub>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

function buildSuggestionPrompt(label: string) {
  const first = label.charAt(0).toLowerCase() + label.slice(1);
  return `Hi Claude! Could you ${first}? If you need more information from me, ask me 1-2 key questions right away. If you think I should give you more context, let me know.`;
}

function newAttachmentId() {
  return globalThis.crypto?.randomUUID?.() ?? `${Date.now()}-${Math.random()}`;
}

/** Split on newlines for line counts (top-level for perf). */
const LINE_BREAK_REGEX = /\r\n|\r|\n/;

/** Max bytes read for inline preview in the attachment dialog (matches tile line-count cap). */
const MAX_PREVIEW_BYTES = 512 * 1024;

/** Large text pastes become attachments instead of filling the textarea. */
const PASTE_ATTACHMENT_MIN_CHARS = 2000;
const PASTE_ATTACHMENT_MIN_LINES = 40;

const TEXT_LIKE_EXTENSIONS = new Set([
  "md",
  "txt",
  "markdown",
  "json",
  "csv",
  "xml",
  "html",
  "htm",
  "css",
  "js",
  "mjs",
  "cjs",
  "ts",
  "tsx",
  "jsx",
  "vue",
  "svelte",
  "log",
  "env",
  "yml",
  "yaml",
  "toml",
  "ini",
  "cfg",
  "gitignore",
  "editorconfig",
]);

function fileExtensionLabel(file: File): string {
  const dot = file.name.lastIndexOf(".");
  const ext = dot >= 0 ? file.name.slice(dot + 1) : "";
  if (ext) {
    return ext.slice(0, 8).toLowerCase();
  }
  const subtype = file.type.split("/")[1];
  if (subtype) {
    return subtype.replaceAll("+", " ").slice(0, 8).toLowerCase();
  }
  return "file";
}

function pastedTextShouldBecomeAttachment(text: string): boolean {
  if (text.trim().length === 0) {
    return false;
  }
  const lineCount = text.split(LINE_BREAK_REGEX).length;
  return (
    text.length >= PASTE_ATTACHMENT_MIN_CHARS ||
    lineCount >= PASTE_ATTACHMENT_MIN_LINES
  );
}

function attachmentDisplayName(attachment: ClaudeAttachedFile): string {
  return attachment.displayName ?? attachment.file.name;
}

function isLikelyTextFile(file: File): boolean {
  if (file.type.startsWith("text/")) {
    return true;
  }
  const ext = fileExtensionLabel(file);
  return TEXT_LIKE_EXTENSIONS.has(ext);
}

function formatFileSize(bytes: number): string {
  if (bytes === 0) {
    return "0 B";
  }
  const k = 1024;
  const sizes = ["B", "KB", "MB", "GB"] as const;
  const i = Math.min(
    sizes.length - 1,
    Math.floor(Math.log(bytes) / Math.log(k))
  );
  const n = bytes / k ** i;
  const rounded = i === 0 || n >= 10 ? Math.round(n) : Math.round(n * 10) / 10;
  return `${rounded} ${sizes[i]}`;
}

/** Line count for small files; size label for binaries or large text. */
async function getFileDetailLine(file: File): Promise<string> {
  if (file.size === 0) {
    return "0 lines";
  }
  if (!isLikelyTextFile(file)) {
    return formatFileSize(file.size);
  }
  const maxBytes = MAX_PREVIEW_BYTES;
  if (file.size > maxBytes) {
    return formatFileSize(file.size);
  }
  try {
    const text = await file.text();
    const lines = text.split(LINE_BREAK_REGEX).length;
    return `${lines} line${lines === 1 ? "" : "s"}`;
  } catch {
    return formatFileSize(file.size);
  }
}

type AttachmentTextPreviewState =
  | { kind: "idle" }
  | { kind: "loading" }
  | { kind: "text"; content: string; lines: number }
  | { kind: "unavailable" };

function ComposerImagePreviewDialog({
  attachment,
  layoutId,
  open,
  onOpenChange,
}: {
  attachment: ClaudeAttachedFile;
  layoutId: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const { preview } = attachment;
  const displayName = attachmentDisplayName(attachment);
  const dialogRef = useRef<HTMLDivElement>(null);
  const shouldReduceMotion = useReducedMotion();
  const [naturalSize, setNaturalSize] = useState<{
    width: number;
    height: number;
  } | null>(null);

  useEffect(() => {
    if (!(open && preview)) {
      return;
    }

    const img = new window.Image();
    img.onload = () => {
      setNaturalSize({
        width: img.naturalWidth,
        height: img.naturalHeight,
      });
    };
    img.src = preview;
  }, [open, preview]);

  useEffect(() => {
    if (!open) {
      return;
    }

    dialogRef.current?.focus();
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onOpenChange(false);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onOpenChange, open]);

  if (!preview) {
    return null;
  }

  const imageWidth = naturalSize?.width ?? 640;
  const imageHeight = naturalSize?.height ?? 480;
  const imageAspectRatio = `${imageWidth} / ${imageHeight}`;
  const motionTransition: Transition = shouldReduceMotion
    ? { duration: 0 }
    : { type: "spring", duration: 0.38, bounce: 0 };
  const fadeTransition: Transition = shouldReduceMotion
    ? { duration: 0 }
    : { duration: 0.18, ease: fadeEase };

  return (
    <AnimatePresence>
      {open ? (
        <motion.div
          className="pointer-events-none fixed inset-0 z-50 grid place-items-center p-4 md:p-10"
          exit={{ opacity: 1 }}
          initial={false}
          transition={motionTransition}
        >
          <motion.button
            animate={{ opacity: 1 }}
            aria-label="Close image preview"
            className="pointer-events-auto absolute inset-0 bg-black/50 backdrop-blur-[2px]"
            exit={{ opacity: 0 }}
            initial={{ opacity: 0 }}
            onClick={() => onOpenChange(false)}
            transition={fadeTransition}
            type="button"
          />
          <motion.div
            aria-labelledby={`${attachment.id}-image-preview-title`}
            aria-modal="true"
            className="pointer-events-none w-full max-w-160 outline-none"
            onClick={(event) => event.stopPropagation()}
            ref={dialogRef}
            role="dialog"
            tabIndex={-1}
          >
            <h2 className="sr-only" id={`${attachment.id}-image-preview-title`}>
              Preview of {displayName}
            </h2>

            <div className="pointer-events-auto relative mx-auto w-fit">
              <button
                aria-label="Close image preview"
                className={cn(
                  "absolute top-0 left-full z-10 ml-1.5 inline-flex size-8 shrink-0 items-center justify-center rounded-full",
                  "text-white outline-none transition-colors duration-200",
                  "fine-hover:hover:bg-white/10 fine-hover:hover:text-white",
                  "focus-visible:ring-2 focus-visible:ring-white/70 focus-visible:ring-offset-2 focus-visible:ring-offset-transparent"
                )}
                data-testid="close-file-preview"
                onClick={() => onOpenChange(false)}
                type="button"
              >
                <X aria-hidden className="size-4" strokeWidth={2} />
              </button>

              <motion.div
                className="relative w-[min(var(--preview-width),calc(100vw-2rem))] max-w-full overflow-hidden"
                layoutId={layoutId}
                style={
                  {
                    "--preview-width": `${Math.min(imageWidth, 640)}px`,
                    aspectRatio: imageAspectRatio,
                    borderRadius: 6,
                    boxShadow:
                      "0 4px 32px oklch(0 0 0 / 0.3), 0 0 0 0.5px oklch(0 0 0 / 0.25)",
                    maxHeight: "calc(100vh - 7rem)",
                  } as React.CSSProperties
                }
                transition={motionTransition}
              >
                <Image
                  alt={`Preview of ${displayName}`}
                  className="object-contain"
                  fill
                  priority
                  sizes="(max-width: 768px) calc(100vw - 2rem), 40rem"
                  src={preview}
                  unoptimized
                />
              </motion.div>
            </div>

            <motion.div
              animate={{ opacity: 1, y: 0 }}
              className="wrap-anywhere pointer-events-none relative z-10 pt-1.5 text-center text-sm text-white [text-shadow:0_0_8px_oklch(0_0_0/0.25)]"
              exit={{ opacity: 0, y: -2 }}
              initial={{ opacity: 0, y: 2 }}
              transition={fadeTransition}
            >
              {displayName}
            </motion.div>
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}

function ComposerAttachmentPreviewDialog({
  attachment,
  open,
  onOpenChange,
}: {
  attachment: ClaudeAttachedFile;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const { file, preview } = attachment;
  const displayName = attachmentDisplayName(attachment);
  const [textPreview, setTextPreview] = useState<AttachmentTextPreviewState>({
    kind: "idle",
  });

  useEffect(() => {
    if (!open) {
      setTextPreview({ kind: "idle" });
      return;
    }
    if (preview) {
      setTextPreview({ kind: "idle" });
      return;
    }
    if (!isLikelyTextFile(file) || file.size > MAX_PREVIEW_BYTES) {
      setTextPreview({ kind: "unavailable" });
      return;
    }
    setTextPreview({ kind: "loading" });
    let cancelled = false;
    file
      .text()
      .then((content) => {
        if (!cancelled) {
          const lines = content.split(LINE_BREAK_REGEX).length;
          setTextPreview({ kind: "text", content, lines });
        }
      })
      .catch(() => {
        if (!cancelled) {
          setTextPreview({ kind: "unavailable" });
        }
      });
    return () => {
      cancelled = true;
    };
  }, [open, file, preview]);

  const sizeLabel = formatFileSize(file.size);
  const isImage = Boolean(preview);

  const showFormattingDisclaimer =
    !isImage && (textPreview.kind === "text" || textPreview.kind === "loading");

  const metaPrimary = (() => {
    if (isImage) {
      return <span>{sizeLabel}</span>;
    }
    if (textPreview.kind === "text") {
      return (
        <span>
          {sizeLabel}
          <span aria-hidden className="mx-1 opacity-50">
            •
          </span>
          {textPreview.lines} line{textPreview.lines === 1 ? "" : "s"}
        </span>
      );
    }
    if (textPreview.kind === "loading") {
      return (
        <span>
          {sizeLabel}
          <span aria-hidden className="mx-1 opacity-50">
            •
          </span>
          <span className="animate-pulse">…</span>
        </span>
      );
    }
    return <span>{sizeLabel}</span>;
  })();

  return (
    <Dialog onOpenChange={onOpenChange} open={open}>
      <DialogContent
        className={cn(
          "flex max-h-[min(90vh,calc(100%-2rem))] w-full max-w-[calc(100%-2rem)] flex-col gap-0 overflow-hidden rounded-2xl p-4 text-left shadow-xl sm:max-w-3xl md:p-6",
          "text-foreground text-sm ring-1 ring-foreground/10"
        )}
        overlayClassName="bg-black/50 supports-backdrop-filter:backdrop-blur-[2px]"
        showCloseButton={false}
      >
        <div className="flex min-h-0 min-w-0 flex-1 flex-col">
          <div className="flex shrink-0 items-start justify-between gap-4">
            <DialogTitle className="wrap-anywhere w-full min-w-0 pr-2 font-semibold text-base text-foreground leading-6">
              {displayName}
            </DialogTitle>
            <DialogClose asChild>
              <button
                aria-label="Close"
                className={cn(
                  "-mx-2 inline-flex size-8 shrink-0 items-center justify-center rounded-md",
                  "text-muted-foreground outline-none transition-colors",
                  "fine-hover:hover:bg-muted fine-hover:hover:text-foreground",
                  "focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
                )}
                type="button"
              >
                <X aria-hidden className="size-4" strokeWidth={2} />
              </button>
            </DialogClose>
          </div>

          <DialogDescription className="mt-0.5 mb-2 shrink-0 text-muted-foreground text-xs">
            <span className="flex flex-wrap items-center gap-y-2 text-xs">
              <span className="text-muted-foreground">{metaPrimary}</span>
              {showFormattingDisclaimer ? (
                <>
                  <span
                    aria-hidden
                    className="mx-1.5 hidden opacity-50 lg:inline"
                  >
                    •
                  </span>
                  <span className="text-muted-foreground">
                    Formatting may be inconsistent from source
                  </span>
                </>
              ) : null}
            </span>
          </DialogDescription>

          <div className="min-h-0 flex-1 overflow-hidden">
            {isImage && preview ? (
              <div className="relative h-[min(80vh,720px)] min-h-[200px] w-full overflow-y-auto rounded-lg border border-border/40 bg-muted/20">
                <Image
                  alt={displayName}
                  className="object-contain p-2"
                  fill
                  sizes="(max-width: 768px) 100vw, 768px"
                  src={preview}
                  unoptimized
                />
              </div>
            ) : null}

            {!isImage && textPreview.kind === "loading" ? (
              <div className="max-h-[min(60vh,480px)] overflow-y-auto whitespace-pre-wrap rounded-lg border border-border/40 bg-muted/30 p-4 font-mono text-muted-foreground text-xs">
                Loading preview…
              </div>
            ) : null}

            {!isImage && textPreview.kind === "text" ? (
              <div className="max-h-[min(60vh,480px)] min-h-[120px] overflow-y-auto whitespace-pre-wrap break-all rounded-lg border border-border/40 bg-card p-4 font-mono text-foreground text-xs shadow-sm">
                {textPreview.content}
              </div>
            ) : null}

            {!isImage && textPreview.kind === "unavailable" ? (
              <div className="rounded-lg border border-border/40 bg-muted/30 p-4 font-mono text-muted-foreground text-xs">
                Preview not available for this file type or size.
              </div>
            ) : null}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

type ComposerAttachmentTileProps = {
  attachment: ClaudeAttachedFile;
  onRemove: (id: string) => void;
};

function ComposerAttachmentTile({
  attachment,
  onRemove,
}: ComposerAttachmentTileProps) {
  const { file, preview, id } = attachment;
  const displayName = attachmentDisplayName(attachment);
  const titleId = useId();
  const imageLayoutId = `claude-attachment-image-${id}`;
  const shouldReduceMotion = useReducedMotion();
  const imageTransition: Transition = shouldReduceMotion
    ? { duration: 0 }
    : { type: "spring", duration: 0.38, bounce: 0 };
  const [previewOpen, setPreviewOpen] = useState(false);
  const [detailLine, setDetailLine] = useState<string | null>(null);

  useEffect(() => {
    if (preview) {
      return;
    }
    let cancelled = false;
    getFileDetailLine(file).then((line) => {
      if (!cancelled) {
        setDetailLine(line);
      }
    });
    return () => {
      cancelled = true;
    };
  }, [file, preview]);

  const extLabel = fileExtensionLabel(file);
  const extBadge = (attachment.badgeLabel ?? extLabel)
    .slice(0, 6)
    .toUpperCase();
  const summaryBits = [extLabel, detailLine].filter(Boolean).join(", ");
  const cardAriaLabel = detailLine
    ? `${displayName}, ${summaryBits}`
    : `${displayName}, ${extLabel}`;

  const tileSize = {
    width: 120,
    height: 120,
    minWidth: 120,
    minHeight: 120,
  } as const;

  return (
    <LayoutGroup id={`claude-attachment-${id}`}>
      <div
        className="group/thumbnail relative shrink-0"
        data-composer-attachment
        data-testid="file-thumbnail"
      >
        {preview ? (
          <ComposerImagePreviewDialog
            attachment={attachment}
            layoutId={imageLayoutId}
            onOpenChange={setPreviewOpen}
            open={previewOpen}
          />
        ) : (
          <ComposerAttachmentPreviewDialog
            attachment={attachment}
            onOpenChange={setPreviewOpen}
            open={previewOpen}
          />
        )}
        {preview ? (
          <button
            aria-label={`Preview ${displayName}`}
            className={cn(
              "block cursor-pointer overflow-hidden rounded-lg border border-border/25 p-0 shadow-black/5 shadow-sm transition-[border-color,box-shadow] duration-200",
              "fine-hover:hover:border-border/50 fine-hover:hover:shadow-black/10"
            )}
            onClick={() => setPreviewOpen(true)}
            style={tileSize}
            type="button"
          >
            {previewOpen ? (
              <div
                aria-hidden
                className="size-full bg-muted/20"
                style={{ borderRadius: 8 }}
              />
            ) : (
              <motion.div
                className="relative size-full overflow-hidden"
                layoutId={imageLayoutId}
                style={{
                  borderRadius: 8,
                  boxShadow: "0 1px 2px oklch(0 0 0 / 0.05)",
                }}
                transition={imageTransition}
              >
                <Image
                  alt={displayName}
                  className="object-cover"
                  fill
                  sizes="120px"
                  src={preview}
                  unoptimized
                />
              </motion.div>
            )}
          </button>
        ) : (
          <button
            aria-label={cardAriaLabel}
            className={cn(
              "flex cursor-pointer flex-col justify-between gap-2.5 overflow-hidden rounded-lg border border-border/25 bg-card px-2.5 py-2 text-left font-sans shadow-black/5 shadow-sm transition-all duration-200",
              "fine-hover:hover:border-border/50 fine-hover:hover:shadow-black/10"
            )}
            onClick={() => setPreviewOpen(true)}
            style={tileSize}
            type="button"
          >
            <div className="flex min-h-0 flex-col gap-1">
              <h3
                className="wrap-anywhere line-clamp-3 text-[12px] text-foreground leading-snug"
                id={titleId}
              >
                {displayName}
              </h3>
              <p
                className={cn(
                  "wrap-break-word line-clamp-1 text-[10px] text-muted-foreground leading-normal",
                  detailLine === null && "animate-pulse opacity-70"
                )}
              >
                {detailLine === null ? "…" : detailLine}
              </p>
            </div>
            <div className="relative flex min-h-0 flex-row items-center justify-between gap-1">
              <div className="flex min-w-0 shrink flex-row gap-1">
                <div
                  className={cn(
                    "flex h-[18px] min-w-0 shrink flex-row items-center justify-center gap-0.5 rounded border border-border/25 bg-background/70 px-1 font-medium shadow-sm backdrop-blur-sm"
                  )}
                >
                  <p className="truncate font-sans text-[11px] text-muted-foreground uppercase leading-[13px]">
                    {extBadge}
                  </p>
                </div>
              </div>
            </div>
          </button>
        )}
        <button
          aria-describedby={preview ? undefined : titleId}
          aria-label="Remove"
          className={cn(
            "-top-2 -left-2 absolute flex size-5 items-center justify-center rounded-full",
            "border border-border/25 bg-background/90 text-muted-foreground backdrop-blur-sm",
            "transition-all duration-200",
            "opacity-0 group-focus-within/thumbnail:opacity-100 group-hover/thumbnail:opacity-100",
            "fine-hover:hover:bg-background/50 fine-hover:hover:text-foreground",
            "focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-card"
          )}
          data-composer-attachment
          onClick={(e) => {
            e.stopPropagation();
            onRemove(id);
          }}
          type="button"
        >
          <X aria-hidden className="size-3" strokeWidth={2} />
        </button>
      </div>
    </LayoutGroup>
  );
}

type PromptSuggestionsPanelProps = {
  category: PromptCategory;
  suggestions: PromptSuggestion[];
  reduceMotion: boolean;
  fadeTransition: Transition;
  onClose: () => void;
  onSuggestionSelect: (suggestion: PromptSuggestion) => void;
};

function PromptSuggestionsPanel({
  category,
  suggestions,
  reduceMotion,
  fadeTransition,
  onClose,
  onSuggestionSelect,
}: PromptSuggestionsPanelProps) {
  return (
    <motion.div
      animate={{ opacity: 1, y: 0 }}
      className="mx-2 pt-4 md:mx-4"
      exit={{ opacity: 0, y: -6 }}
      initial={{ opacity: 0, y: -6 }}
      key={`suggestions-${category.id}`}
      role="tabpanel"
      transition={fadeTransition}
    >
      <div className="overflow-hidden rounded-2xl bg-card p-2 text-foreground shadow-sm ring-1 ring-border/80">
        <h2 className="flex min-h-9 cursor-default items-center gap-x-2">
          <span className="ml-2 text-muted-foreground">
            <CategoryGlyph icon={category.icon} />
          </span>
          <span className="flex-1 text-muted-foreground text-xs">
            {category.label}
          </span>
          <button
            aria-label="Close suggestions"
            className={cn(
              "inline-flex size-9 shrink-0 items-center justify-center rounded-md text-muted-foreground outline-none",
              "duration-200 ease-[cubic-bezier(0.165,0.85,0.45,1)]",
              "[transition-property:background-color,transform,color]",
              "fine-hover:hover:bg-muted fine-hover:hover:text-foreground",
              "focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-card",
              "active:scale-[0.96] motion-reduce:active:scale-100"
            )}
            onClick={onClose}
            type="button"
          >
            <X aria-hidden className="size-4" strokeWidth={1.75} />
          </button>
        </h2>

        <motion.ul
          animate="show"
          aria-label={`${category.label} suggestions`}
          aria-orientation="vertical"
          className="overflow-visible text-sm [&>li:has(+li:focus-within)]:border-transparent [&>li:has(+li:hover)]:border-transparent"
          initial="hidden"
          role="listbox"
          variants={{
            hidden: {
              transition: {
                staggerChildren: reduceMotion ? 0 : 0.02,
                staggerDirection: -1,
              },
            },
            show: {
              transition: {
                staggerChildren: reduceMotion ? 0 : 0.055,
              },
            },
          }}
        >
          {suggestions.map((suggestion, index) => (
            <motion.li
              className="border-border/70 border-b transition-[border-color] duration-150 ease-out last:border-b-0 focus-within:border-transparent fine-hover:hover:border-transparent"
              id={`prompt-option-${category.id}-${index}`}
              key={`${category.id}-${suggestion.label}`}
              role="option"
              variants={{
                hidden: { opacity: 0, y: 6 },
                show: { opacity: 1, y: 0, transition: fadeTransition },
              }}
            >
              <button
                aria-describedby={`prompt-description-${category.id}-${index}`}
                aria-labelledby={`prompt-option-${category.id}-${index}`}
                className={cn(
                  "group w-full cursor-pointer rounded-lg px-2 py-2.5 text-left outline-none",
                  "duration-150 ease-out [transition-property:background-color,transform]",
                  "fine-hover:hover:bg-muted/70 focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-card",
                  "active:scale-[0.99] motion-reduce:active:scale-100"
                )}
                onClick={() => onSuggestionSelect(suggestion)}
                type="button"
              >
                <span className="flex w-full items-center rounded">
                  <span
                    className="min-w-0 flex-1 truncate text-foreground"
                    id={`prompt-description-${category.id}-${index}`}
                  >
                    {suggestion.label}
                  </span>
                  <ChevronRight
                    aria-hidden
                    className={cn(
                      "size-4 shrink-0 text-muted-foreground",
                      "scale-[0.25] opacity-0 blur-xs",
                      "duration-200 ease-[cubic-bezier(0.2,0,0,1)]",
                      "[transition-property:opacity,filter,scale]",
                      "group-hover:scale-100 group-hover:opacity-100 group-hover:blur-none",
                      "group-focus-visible:scale-100 group-focus-visible:opacity-100 group-focus-visible:blur-none"
                    )}
                    strokeWidth={1.75}
                  />
                </span>
              </button>
            </motion.li>
          ))}
        </motion.ul>
      </div>
    </motion.div>
  );
}

type PromptCategoryChipsProps = {
  categories: PromptCategory[];
  fadeTransition: Transition;
  shouldAnimateCategoryWave: boolean;
  onCategorySelect: (category: PromptCategory) => void;
};

function PromptCategoryChips({
  categories,
  fadeTransition,
  shouldAnimateCategoryWave,
  onCategorySelect,
}: PromptCategoryChipsProps) {
  const waveTransition: Transition = shouldAnimateCategoryWave
    ? { duration: 0.5, ease: [0.16, 1, 0.3, 1] }
    : { duration: 0 };
  const tabListVariants = shouldAnimateCategoryWave
    ? {
        hidden: { opacity: 1 },
        show: {
          opacity: 1,
          transition: {
            delayChildren: stagger(0.045, {
              ease: [0.32, 0.23, 0.4, 0.9],
              startDelay: 0.08,
            }),
          },
        },
      }
    : {
        hidden: { opacity: 1 },
        show: { opacity: 1, transition: { staggerChildren: 0 } },
      };
  const chipVariants = shouldAnimateCategoryWave
    ? {
        hidden: { opacity: 0, y: 18 },
        show: {
          opacity: 1,
          y: 0,
          transition: waveTransition,
        },
      }
    : {
        hidden: { opacity: 1, y: 0 },
        show: { opacity: 1, y: 0, transition: waveTransition },
      };

  return (
    <motion.div
      animate="show"
      aria-label="Prompt categories"
      aria-orientation="horizontal"
      className="flex w-full flex-wrap justify-center gap-2 pt-4"
      exit={{ opacity: 0, y: -6, transition: fadeTransition }}
      initial={shouldAnimateCategoryWave ? "hidden" : false}
      key="category-chips"
      role="tablist"
      variants={tabListVariants}
    >
      {categories.map((cat) => (
        <motion.div
          className="inline-block"
          key={cat.id}
          role="presentation"
          variants={chipVariants}
        >
          <button
            aria-selected={false}
            className={cn(
              "inline-flex h-8 max-w-full cursor-pointer items-center overflow-hidden rounded-md border border-border/90 bg-card/30 px-2.5",
              "text-foreground/90 text-sm outline-none",
              "duration-200 ease-in-out will-change-transform",
              "[transition-property:background-color,border-color,color,transform]",
              "fine-hover:hover:border-border fine-hover:hover:bg-muted fine-hover:hover:text-foreground",
              "focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background",
              "active:scale-[0.995] motion-reduce:active:scale-100"
            )}
            onClick={() => onCategorySelect(cat)}
            role="tab"
            type="button"
          >
            <div className="flex min-w-0 items-center gap-1.5">
              <CategoryGlyph icon={cat.icon} />
              <span className="min-w-0 flex-1 overflow-hidden text-ellipsis whitespace-nowrap">
                {cat.label}
              </span>
            </div>
          </button>
        </motion.div>
      ))}
    </motion.div>
  );
}

export type ClaudeInputSubmitPayload = {
  prompt: string;
  modelId: string;
  modelName: string;
  extendedThinking: boolean;
  files: File[];
};

export type ClaudeInputProps = {
  className?: string;
  /** Initial textarea value (uncontrolled). */
  defaultValue?: string;
  placeholder?: string;
  models?: ClaudeModelOption[];
  /** Uncontrolled default. */
  defaultModelId?: string;
  categories?: PromptCategory[];
  suggestions?: Record<string, PromptSuggestion[]>;
  /** Uncontrolled default for extended thinking label + toggle. */
  defaultExtendedThinking?: boolean;
  extendedThinking?: boolean;
  onExtendedThinkingChange?: (value: boolean) => void;
  onModelChange?: (modelId: string, model: ClaudeModelOption) => void;
  onSubmit?: (payload: ClaudeInputSubmitPayload) => void;
  onCategorySelect?: (category: PromptCategory) => void;
  onSuggestionSelect?: (
    suggestion: PromptSuggestion,
    category: PromptCategory
  ) => void;
  onVoiceClick?: () => void;
  onMoreModelsClick?: () => void;
  onTranscriptionChange?: (text: string) => void;
  /**
   * Fallback for browsers without Web Speech API support. Return the
   * transcribed text for the recorded audio blob.
   */
  onAudioRecorded?: (audioBlob: Blob) => Promise<string>;
  lang?: string;
  /** Called after user picks files via the + control. */
  onFilesSelected?: (files: File[]) => void;
  /** Forwarded to the hidden file input. */
  accept?: string;
};

export function ClaudeInput({
  className,
  defaultValue = "",
  placeholder = "How can I help you today?",
  models = defaultClaudeModels,
  defaultModelId = "opus-46",
  categories = defaultPromptCategories,
  suggestions = defaultPromptSuggestions,
  defaultExtendedThinking = true,
  extendedThinking: extendedThinkingControlled,
  onExtendedThinkingChange,
  onModelChange,
  onSubmit,
  onCategorySelect,
  onSuggestionSelect,
  onVoiceClick,
  onMoreModelsClick,
  onTranscriptionChange,
  onAudioRecorded,
  lang,
  onFilesSelected,
  accept,
}: ClaudeInputProps) {
  const menuId = useId();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const attachedFilesRef = useRef<ClaudeAttachedFile[]>([]);
  const hasAnimatedCategoryWaveRef = useRef(false);

  const [modelId, setModelId] = useState(defaultModelId);
  const [plusMenuOpen, setPlusMenuOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [researchEnabled, setResearchEnabled] = useState(false);
  const [webSearchEnabled, setWebSearchEnabled] = useState(true);
  const [voiceControlsActive, setVoiceControlsActive] = useState(false);
  const [activeCategoryId, setActiveCategoryId] = useState<string | null>(null);
  const [attachedFiles, setAttachedFiles] = useState<ClaudeAttachedFile[]>([]);

  const [extendedUncontrolled, setExtendedUncontrolled] = useState(
    defaultExtendedThinking
  );
  const extendedThinking = extendedThinkingControlled ?? extendedUncontrolled;

  const setExtendedThinking = useCallback(
    (next: boolean) => {
      if (extendedThinkingControlled === undefined) {
        setExtendedUncontrolled(next);
      }
      onExtendedThinkingChange?.(next);
    },
    [extendedThinkingControlled, onExtendedThinkingChange]
  );

  const shouldReduceMotion = useReducedMotion();
  const transition = shouldReduceMotion ? { duration: 0 } : composerSpring;
  const fadeTransition: Transition = shouldReduceMotion
    ? { duration: 0 }
    : { duration: 0.2, ease: fadeEase };
  const shouldAnimateCategoryWave = !(
    shouldReduceMotion || hasAnimatedCategoryWaveRef.current
  );
  const [composerContentRef, { height: composerContentHeight }] = useMeasure({
    offsetSize: true,
  });

  useEffect(() => {
    if (voiceControlsActive) {
      setMenuOpen(false);
      setActiveCategoryId(null);
      hasAnimatedCategoryWaveRef.current = false;
      return;
    }

    hasAnimatedCategoryWaveRef.current = true;
  }, [voiceControlsActive]);

  const selectedModel = useMemo(
    () => models.find((m) => m.id === modelId) ?? models[0],
    [models, modelId]
  );

  const activeCategory = useMemo(
    () => categories.find((cat) => cat.id === activeCategoryId) ?? null,
    [activeCategoryId, categories]
  );

  const activeSuggestions = activeCategory
    ? (suggestions[activeCategory.id] ?? [])
    : [];

  const syncTextareaHeight = useCallback(() => {
    const el = textareaRef.current;
    if (!el) {
      return;
    }
    el.style.height = "auto";
    const maxPx = 384; // ~max-h-96
    el.style.height = `${Math.min(el.scrollHeight, maxPx)}px`;
  }, []);

  useEffect(() => {
    syncTextareaHeight();
  }, [syncTextareaHeight]);

  useEffect(() => {
    attachedFilesRef.current = attachedFiles;
  }, [attachedFiles]);

  useEffect(
    () => () => {
      for (const a of attachedFilesRef.current) {
        if (a.preview) {
          URL.revokeObjectURL(a.preview);
        }
      }
    },
    []
  );

  const removeAttachment = useCallback((id: string) => {
    setAttachedFiles((prev) => {
      const found = prev.find((a) => a.id === id);
      if (found?.preview) {
        URL.revokeObjectURL(found.preview);
      }
      return prev.filter((a) => a.id !== id);
    });
  }, []);

  const handleFileInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const list = e.target.files;
      if (!list?.length) {
        return;
      }
      const picked = Array.from(list);
      onFilesSelected?.(picked);
      setAttachedFiles((prev) => [
        ...prev,
        ...picked.map((file) => ({
          id: newAttachmentId(),
          file,
          preview: file.type.startsWith("image/")
            ? URL.createObjectURL(file)
            : null,
        })),
      ]);
      e.target.value = "";
    },
    [onFilesSelected]
  );

  const handlePaste = useCallback(
    (e: React.ClipboardEvent<HTMLTextAreaElement>) => {
      if (e.clipboardData.files.length > 0) {
        return;
      }

      const pastedText = e.clipboardData.getData("text/plain");
      if (!pastedTextShouldBecomeAttachment(pastedText)) {
        return;
      }

      e.preventDefault();
      const file = new File([pastedText], `pasted-content-${Date.now()}.txt`, {
        type: "text/plain",
      });
      const attachment: ClaudeAttachedFile = {
        id: newAttachmentId(),
        file,
        preview: null,
        displayName: "Pasted content",
        badgeLabel: "Pasted",
      };

      onFilesSelected?.([file]);
      setAttachedFiles((prev) => [...prev, attachment]);
    },
    [onFilesSelected]
  );

  const getPromptValue = useCallback(
    () => textareaRef.current?.value ?? "",
    []
  );

  const handleSubmit = useCallback(() => {
    const files = attachedFiles.map((a) => a.file);
    onSubmit?.({
      prompt: getPromptValue().trim(),
      modelId: selectedModel.id,
      modelName: selectedModel.name,
      extendedThinking,
      files,
    });
  }, [
    attachedFiles,
    extendedThinking,
    getPromptValue,
    onSubmit,
    selectedModel,
  ]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  const handleShellPointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    const el = e.target as HTMLElement;
    if (
      el.closest(
        "button, a, textarea, input, [data-slot='popover-trigger'], [data-slot='switch'], [data-composer-attachment]"
      )
    ) {
      return;
    }
    textareaRef.current?.focus();
  };

  const selectModel = (next: ClaudeModelOption) => {
    setModelId(next.id);
    onModelChange?.(next.id, next);
    setMenuOpen(false);
  };

  const handleCategorySelect = (category: PromptCategory) => {
    setActiveCategoryId(category.id);
    onCategorySelect?.(category);
  };

  const handleTranscriptionChange = useCallback(
    (text: string) => {
      const transcript = text.trim();
      if (!transcript) {
        return;
      }

      const el = textareaRef.current;
      if (el) {
        const current = el.value.trimEnd();
        el.value = current ? `${current} ${transcript}` : transcript;
        syncTextareaHeight();
        el.focus();
        const len = el.value.length;
        el.setSelectionRange(len, len);
      }

      onTranscriptionChange?.(transcript);
    },
    [onTranscriptionChange, syncTextareaHeight]
  );

  const handleSuggestionSelect = (suggestion: PromptSuggestion) => {
    if (!activeCategory) {
      return;
    }
    const nextPrompt =
      suggestion.prompt ?? buildSuggestionPrompt(suggestion.label);
    const immediateEl = textareaRef.current;
    if (immediateEl) {
      immediateEl.value = nextPrompt;
      syncTextareaHeight();
    }
    onSuggestionSelect?.(suggestion, activeCategory);
    requestAnimationFrame(() => {
      const el = textareaRef.current;
      if (!el) {
        return;
      }
      el.value = nextPrompt;
      syncTextareaHeight();
      el.focus();
      const len = nextPrompt.length;
      el.setSelectionRange(len, len);
    });
  };

  const composerShadowClass = cn(
    "shadow-[0_0.25rem_1.25rem_oklch(0_0_0/0.035),0_0_0_0.5px_oklch(0_0_0/0.08)]",
    "fine-hover:hover:shadow-[0_0.25rem_1.25rem_oklch(0_0_0/0.035),0_0_0_0.5px_oklch(0_0_0/0.12)]",
    "focus-within:shadow-[0_0.25rem_1.25rem_oklch(0_0_0/0.075),0_0_0_0.5px_oklch(0_0_0/0.12)]",
    "fine-hover:focus-within:shadow-[0_0.25rem_1.25rem_oklch(0_0_0/0.075),0_0_0_0.5px_oklch(0_0_0/0.12)]",
    "dark:shadow-[0_0.25rem_1.25rem_oklch(0_0_0/0.035),0_0_0_0.5px_oklch(1_0_0/0.15)]",
    "dark:fine-hover:hover:shadow-[0_0.25rem_1.25rem_oklch(0_0_0/0.035),0_0_0_0.5px_oklch(1_0_0/0.22)]",
    "dark:focus-within:shadow-[0_0.25rem_1.25rem_oklch(0_0_0/0.06),0_0_0_0.5px_oklch(1_0_0/0.24)]",
    "dark:fine-hover:focus-within:shadow-[0_0.25rem_1.25rem_oklch(0_0_0/0.06),0_0_0_0.5px_oklch(1_0_0/0.24)]"
  );

  return (
    <MotionConfig transition={transition}>
      <div className={cn("top-5 z-10 mx-auto w-full max-w-2xl", className)}>
        <input
          aria-label="Upload files"
          className="hidden"
          multiple
          onChange={handleFileInputChange}
          ref={fileInputRef}
          tabIndex={-1}
          type="file"
          {...(accept ? { accept } : {})}
        />

        <div className="relative">
          <motion.div
            animate={{ height: composerContentHeight || "auto" }}
            className={cn(
              "relative z-1 mx-2 flex cursor-text flex-col overflow-hidden rounded-[20px] border border-transparent bg-card transition-shadow duration-200 md:mx-0 md:w-full dark:bg-[#2C2C2B]",
              composerShadowClass
            )}
            initial={false}
            onPointerDown={handleShellPointerDown}
          >
            <div className="flex flex-col" ref={composerContentRef}>
              {attachedFiles.length > 0 ? (
                <div className="overflow-hidden">
                  <div className="p-3.5 pb-2.5">
                    <div className="flex flex-col gap-2">
                      <div
                        className="-mt-2 -ml-2 flex max-w-full flex-row gap-3 overflow-x-auto pt-2 pl-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
                        data-composer-attachment
                      >
                        {attachedFiles.map((attachment) => (
                          <ComposerAttachmentTile
                            attachment={attachment}
                            key={attachment.id}
                            onRemove={removeAttachment}
                          />
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              ) : null}
              <div className="flex flex-col gap-3 p-3.5">
                <div className="relative">
                  <textarea
                    aria-label="Write your prompt to Claude"
                    className={cn(
                      "wrap-break-word max-h-96 min-h-12 w-full resize-none overflow-y-auto bg-transparent pt-[6px] pl-[6px] text-base text-foreground leading-6 outline-none",
                      "placeholder:text-muted-foreground"
                    )}
                    defaultValue={defaultValue}
                    onInput={syncTextareaHeight}
                    onKeyDown={handleKeyDown}
                    onPaste={handlePaste}
                    placeholder={placeholder}
                    ref={textareaRef}
                    rows={1}
                    spellCheck={false}
                  />
                </div>

                <LayoutGroup id="claude-input-controls">
                  <motion.div
                    className="relative flex w-full items-center gap-2"
                    layout="position"
                    transition={getControlLayoutTransition(
                      Boolean(shouldReduceMotion)
                    )}
                  >
                    <motion.div
                      className="relative flex min-w-0 flex-1 shrink items-center gap-1"
                      layout="position"
                      transition={getControlLayoutTransition(
                        Boolean(shouldReduceMotion)
                      )}
                    >
                      <ClaudePlusMenu
                        fileInputRef={fileInputRef}
                        onOpenChange={setPlusMenuOpen}
                        onResearchEnabledChange={setResearchEnabled}
                        onWebSearchEnabledChange={setWebSearchEnabled}
                        open={plusMenuOpen}
                        researchEnabled={researchEnabled}
                        webSearchEnabled={webSearchEnabled}
                      />
                    </motion.div>

                    <ClaudeModelSelector
                      extendedThinking={extendedThinking}
                      menuId={menuId}
                      menuOpen={menuOpen}
                      modelId={modelId}
                      models={models}
                      onMoreModelsClick={onMoreModelsClick}
                      onOpenChange={setMenuOpen}
                      onSelectModel={selectModel}
                      onSetExtendedThinking={setExtendedThinking}
                      selectedModel={selectedModel}
                      shouldReduceMotion={shouldReduceMotion}
                      voiceControlsActive={voiceControlsActive}
                    />

                    <motion.div
                      className="relative z-10 flex shrink-0 items-center justify-end overflow-visible"
                      layout="position"
                      transition={getControlLayoutTransition(
                        Boolean(shouldReduceMotion)
                      )}
                    >
                      <ClaudeVoiceControls
                        lang={lang}
                        onAudioRecorded={onAudioRecorded}
                        onTranscriptionChange={handleTranscriptionChange}
                        onVoiceActiveChange={setVoiceControlsActive}
                        onVoiceClick={onVoiceClick}
                        shouldReduceMotion={Boolean(shouldReduceMotion)}
                      />
                    </motion.div>
                  </motion.div>
                </LayoutGroup>
              </div>
            </div>
          </motion.div>

          <div className="absolute inset-x-0 top-full z-0 mx-auto w-full">
            <AnimatePresence mode="wait">
              {voiceControlsActive ? null : activeCategory ? (
                <PromptSuggestionsPanel
                  category={activeCategory}
                  fadeTransition={fadeTransition}
                  onClose={() => setActiveCategoryId(null)}
                  onSuggestionSelect={handleSuggestionSelect}
                  reduceMotion={Boolean(shouldReduceMotion)}
                  suggestions={activeSuggestions}
                />
              ) : (
                <PromptCategoryChips
                  categories={categories}
                  fadeTransition={fadeTransition}
                  onCategorySelect={handleCategorySelect}
                  shouldAnimateCategoryWave={shouldAnimateCategoryWave}
                />
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </MotionConfig>
  );
}
