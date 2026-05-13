"use client";

/**
 * OpenAI-style image composer: two modes (image vs. ask-anything), idea carousel,
 * and optional attachment thumbnails. State lives on `OpenAIChatImage`; presentational
 * pieces below keep the tree readable without changing public props or behavior.
 */

import {
  ArrowUp,
  ChevronLeft,
  ChevronRight,
  Globe,
  Images as LucideImages,
  Mic,
  Pencil,
  Plus,
  X,
} from "lucide-react";
import {
  AnimatePresence,
  MotionConfig,
  motion,
  useReducedMotion,
} from "motion/react";
import Image from "next/image";
import type * as React from "react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import useMeasure from "react-use-measure";
import { cn } from "@/lib/utils";

const composerSpring = { type: "spring", duration: 0.4, bounce: 0 } as const;

type AttachedItem =
  | {
      kind: "file";
      id: string;
      file: File;
      preview: string;
      alt?: string;
    }
  | {
      kind: "remote";
      id: string;
      src: string;
      alt?: string;
    };

export type OpenAIChatIdea = {
  label: string;
  image: string;
  /** Prompt text inserted into the composer when the idea is selected. */
  prompt: string;
};

export type OpenAIChatAttachment = {
  image: string;
  alt?: string;
};

const defaultIdeas: OpenAIChatIdea[] = [
  {
    label: "Studio headshot",
    image: "https://persistent.oaistatic.com/images-app/headshot-sheet.webp",
    prompt:
      "Create a single-subject blueprint poster using only the main subject from the uploaded image. Render it as a clean white technical line drawing on a deep cobalt-blue blueprint background with a subtle grid. Use flat 2D schematic linework, orthographic contours, construction lines, measurement ticks, arrows, and minimal technical labels. The composition may also include 2-3 smaller inset studies or alternate views. Keep the layout simple and balanced with no shading, no 3D, no lighting, no extra objects.",
  },
  {
    label: "Blueprint poster",
    image: "https://persistent.oaistatic.com/images-app/blueprint-sheet.webp",
    prompt:
      "Create a single-subject blueprint poster using only the main subject from the uploaded image. Render it as a clean white technical line drawing on a deep cobalt-blue blueprint background with a subtle grid. Use flat 2D schematic linework, orthographic contours, construction lines, measurement ticks, arrows, and minimal technical labels. The composition may also include 2-3 smaller inset studies or alternate views. Keep the layout simple and balanced with no shading, no 3D, no lighting, no extra objects.",
  },
  {
    label: "Nighttime flash",
    image: "https://persistent.oaistatic.com/images-app/flash-sheet.webp",
    prompt:
      "Transform the photo into nighttime chic flash photography. Use harsh direct on-camera flash with strong highlights, deep shadows, and slight overexposure on the subject. Set the scene at night with a dark, moody background while keeping realistic colors and textures. Add a candid, editorial feel, slightly imperfect framing, motion energy, and spontaneous expression. Emphasize high contrast, glossy skin highlights, and subtle film grain for a raw, fashion-nightlife aesthetic.",
  },
  {
    label: "Anime",
    image: "https://persistent.oaistatic.com/images-app/anime-sheet.webp",
    prompt:
      "Create a trending anime art style image from the uploaded subject. Use confident line-work with slight variation and minimal cel shading using flat shadow shapes. Use bright, saturated colors and clean graphic lighting. The style is defined by exaggerated, cartoonish character proportions featuring highly expressive, simplistic facial features that allow for immense emotional range, with highly varied stretched anatomy. Transform the environment into a slightly warped space with playful perspective distortion and simplified objects. Composition and tone should be energetic, lively, and comedic in a fully stylized, non-realistic world.",
  },
  {
    label: "Comic",
    image: "https://persistent.oaistatic.com/images-app/comic-sheet.webp",
    prompt:
      "Create a comic strip using the subject from the uploaded image. Style the comic strip in a bold Sunday funnies style with thick outlines, halftone textures, and bright 1980s colors. Pick one clear, exaggerated visual element from the photo and build the story around it, leading to a funny or unexpected payoff. Keep the dialogue short, natural, and easy to read, and make sure the joke lands clearly at a glance with no randomness or confusion.",
  },
  {
    label: "Icon designs",
    image: "https://persistent.oaistatic.com/images-app/icon-sheet.webp",
    prompt:
      "Transform this image into a grid of minimalist logos using the main subject as the core icon. Abstract and simplify the primary element into multiple unique vector-style logo marks. Each variation should reinterpret the same subject in different ways (geometric, line art, negative space, emblem, badge, monogram). Arrange 16-20 logos evenly on a light background. Keep designs clean, modern, with balanced spacing. Maintain consistency while exploring creative variations of the original subject as a cohesive branding logo collection.",
  },
  {
    label: "Fantasy newspaper",
    image:
      "https://persistent.oaistatic.com/images-app/fantasy-newspaper-sheet.webp",
    prompt:
      "Transform the person in the uploaded photo into a whimsical black-and-white vintage newspaper front page. Place them as the main portrait in the center, styled like an old engraved photograph. Surround them with bold, exaggerated headline text, narrow newspaper columns, and playful subheadings. Use high-contrast black ink on pure white background, subtle paper texture, and classic serif fonts. Add quirky, magical or humorous headlines to create a charming, slightly surreal tone. Keep the layout dense, editorial, and reminiscent of an old fantasy newspaper. Ensure the subject's face remains recognizable but stylized to match the printed newspaper aesthetic.",
  },
  {
    label: "Infographic poster",
    image:
      "https://persistent.oaistatic.com/images-app/infographic-poster-sheet.webp",
    prompt:
      "Create a vintage botanical illustration poster that reinterprets the main subject as if it were studied in a 19th-century scientific atlas, using only visible details. Use fine ink linework, delicate cross-hatching, and a realistic yet idealized illustration style. Style illustration with bright colors from the uploaded image on a white background. Lay out a central primary illustration supported by smaller inset studies, guide lines, and diagram callouts that analyze form and structure with annotated text. Include understated labels and markers. Annotated text should be in plain English and easy to read.",
  },
  {
    label: "Film strip",
    image: "https://persistent.oaistatic.com/images-app/film-strip-sheet.webp",
    prompt:
      "Transform the uploaded image into cinematic 3-frame sequential film stills (horizontal frames stacked vertically), full bleed edge-to-edge. Each frame should show a different moment from the same scene, with clear progression. Vary the composition, camera angle, and distances to create a sense of movement and storytelling. Use a cinematic, cooler-toned, high-contrast, deep-space blacks film with a natural color grade. Add subtle film grain, slight motion blur, and natural imperfections to emulate analog photography. Keep the composition candid and emotionally grounded, with a sense of movement and quiet storytelling. Overall aesthetic: cinematic, nostalgic, and organic, like raw film stills.",
  },
  {
    label: "Tarot card",
    image: "https://persistent.oaistatic.com/images-app/tarot-sheet.webp",
    prompt:
      "Create a tarot card based off of what you know about me in the classic Rider-Waite style. Style me in a hand-drawn figure using bold but imperfect black ink linework with wobble and variation, flat colors with no shading. Layer subtle tarot visual elements around the figure. Add paper texture and print feel.",
  },
  {
    label: "Enhance photos",
    image: "https://persistent.oaistatic.com/images-app/enhance-sheet.webp",
    prompt: "Improve the quality of my photo and make it clearer.",
  },
  {
    label: "Interior design",
    image: "https://persistent.oaistatic.com/images-app/mid-century-sheet.webp",
    prompt:
      "Transform this image into a realistic mid-century modern interior with clean lines, warm natural materials, sculptural furniture, bright natural cinematic lighting, that highlights textures of the room. Keep the space photorealistic, like a high-end editorial interior photograph.",
  },
  {
    label: "Spring flowers",
    image: "https://persistent.oaistatic.com/images-app/spring-sheet.webp",
    prompt:
      "Transform my photo into an ultra wide-angle, ground-level portrait looking up, with only me as the subject and all original background removed. Frame the scene with oversized spring flowers inches from the lens, overlapping the edges and rising toward me to create depth. Place me above the camera, lightly interacting with the foreground in bright daylight with vivid color and strong shadows. Restyle my outfit into fashionable, modern spring clothing. Preserve my likeness and create a bold, immersive editorial feel.",
  },
  {
    label: "3D avatar",
    image: "https://persistent.oaistatic.com/images-app/3d-avatar-sheet.webp",
    prompt:
      "Create a premium glossy 3D 'designer toy' render of the subject(s) using the uploaded image as the only reference. Render one floating head per person (no duplication), cropped cleanly below the jaw with a visible neck and full head comfortably framed. Style: high-quality vinyl figure with ultra-smooth, simplified forms, rounded volumes, and strong glossy reflections across key facial areas. Hair should be sculpted, glossy, and stylized, with embedded playful accessories. Include oversized retro wraparound sunglasses with vibrant, matching frame/lens colors. Use strong studio lighting with pronounced highlights. Background: blue sky with soft clouds.",
  },
  {
    label: "Fix lighting",
    image:
      "https://persistent.oaistatic.com/images-app/universal-lighting-sheet.webp",
    prompt:
      "Improve the lighting while keeping everything else exactly the same. Do not change the person, pose, expression, background, or composition. Fix issues like back lighting, harsh shadows, underexposure or uneven lighting. Transform the original lighting into soft, natural, flattering light coming from slightly above eye level and facing the subject, so the face is evenly lit with realistic skin tones. Keep the result photorealistic and consistent with the original scene.",
  },
  {
    label: "Drawing",
    image: "https://persistent.oaistatic.com/images-app/drawing-sheet.webp",
    prompt:
      "Turn this simple, childlike drawing or photo into a photo-realistic scene. Use it as an exact blueprint; keep all the proportions, shapes, and quirks as-is. Translate it into real materials, textures, and lighting. Place it in a believable environment with depth and shadows so it feels like a real photo of the drawing brought to life.",
  },
  {
    label: "Hyperreal wallpaper",
    image: "https://persistent.oaistatic.com/images-app/hyper-real-sheet.webp",
    prompt:
      "Create a macro nature image of a scene with realistic textures, shallow depth of field with creamy bokeh, in a natural outdoor setting. The image has an analog, imperfect, wabi sabi, 35mm film-like quality—grain, natural color rendering, and a soft contrast curve. Ultra-realistic detail, macro photography, 9:16 aspect ratio. Before creating the image, ask me a follow up question giving a numbered list of a few unexpected options for subject matter and then render the image.",
  },
  {
    label: "8bit game",
    image: "https://persistent.oaistatic.com/images-app/8-bit-sheet.webp",
    prompt:
      "Using the subject(s) in the uploaded image as inspiration, create a single frame image from a story-driven 2D side-scrolling pixel art game. Translate the image's themes, colors, or subjects into the game world. The scene should capture a climactic, victorious moment in a non-violent, uplifting, or humorous way. Style should be detailed retro pixel art (16-bit), with clear silhouettes and a cohesive color palette. The image should be vertical and show the full game screen. Include a classic HUD at the top with a funny, original game title inspired by the image. The frame should feel like gameplay in progress, with a character, environment, and a clear sense of action or objective. All elements must be contained within the game screen.",
  },
];

const defaultAttachments: OpenAIChatAttachment[] = [
  { image: "/images/gibli/gibli-1.jpg", alt: "Illustrated cat by a window" },
  { image: "/images/gibli/gibli-4.jpg", alt: "Outdoor scene" },
  { image: "/images/gibli/gibli-6.jpg", alt: "Outdoor grill scene" },
  { image: "/images/gibli/gibli-8.jpg", alt: "Receipt list" },
];

function ImageIcon() {
  return (
    <svg
      aria-hidden="true"
      fill="none"
      focusable="false"
      height="20"
      viewBox="0 0 24 24"
      width="20"
      xmlns="http://www.w3.org/2000/svg"
    >
      <rect
        height="18"
        rx="3"
        stroke="#1a73e8"
        strokeWidth="2"
        width="18"
        x="3"
        y="3"
      />
      <circle cx="8.5" cy="8.5" r="2" stroke="#1a73e8" strokeWidth="2" />
      <path
        d="M3 16l4.5-4.5a2 2 0 012.83 0L15 16"
        stroke="#1a73e8"
        strokeLinecap="round"
        strokeWidth="2"
      />
      <path
        d="M14 15l1.5-1.5a2 2 0 012.83 0L21 16"
        stroke="#1a73e8"
        strokeLinecap="round"
        strokeWidth="2"
      />
    </svg>
  );
}

// --- Composer: thumbnails row (image mode, when there are attachments) ---

type AttachedThumbnailCardProps = {
  item: AttachedItem;
  index: number;
  layoutDependency: string;
  onRemove: (id: string) => void;
};

function AttachedThumbnailCard({
  item,
  index,
  layoutDependency,
  onRemove,
}: AttachedThumbnailCardProps) {
  const src = item.kind === "file" ? item.preview : item.src;
  const alt =
    item.alt ?? (item.kind === "file" ? item.file.name : "Attached image");

  return (
    <motion.div
      animate={{ opacity: 1, scale: 1 }}
      className="relative h-[120px] w-[120px] shrink-0"
      exit={{ opacity: 0, scale: 0.9 }}
      initial={{ opacity: 0, scale: 0.9 }}
      layout
      layoutDependency={layoutDependency}
    >
      <div className="relative h-full w-full overflow-hidden rounded-2xl bg-muted">
        <Image
          alt={alt}
          className="object-cover"
          fill
          sizes="120px"
          src={src}
        />
      </div>
      <div className="-outline-offset-1 pointer-events-none absolute inset-0 rounded-2xl outline-1 outline-foreground/10" />
      <button
        aria-label={`Remove file ${index + 1}: ${alt}`}
        className="absolute top-1.5 right-1.5 flex h-6 w-6 items-center justify-center rounded-full bg-foreground text-background duration-150 ease-out [transition-property:background-color,scale] hover:bg-foreground/85 focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-card active:scale-[0.92]"
        onClick={() => onRemove(item.id)}
        type="button"
      >
        <X className="h-3.5 w-3.5" strokeWidth={2.25} />
      </button>
    </motion.div>
  );
}

type ComposerAttachmentStripProps = {
  /** When false, the strip unmounts (AnimatePresence still runs exit when leaving). */
  show: boolean;
  items: AttachedItem[];
  layoutDependency: string;
  onRemove: (id: string) => void;
};

function ComposerAttachmentStrip({
  show,
  items,
  layoutDependency,
  onRemove,
}: ComposerAttachmentStripProps) {
  return (
    <AnimatePresence initial={false} mode="popLayout">
      {show ? (
        <motion.div
          animate={{ opacity: 1, height: "auto" }}
          className="scrollbar-hide -mx-1 order-1 flex w-full gap-2 overflow-x-auto px-1 pt-1 pb-1.5"
          exit={{ opacity: 0, height: 0 }}
          initial={{ opacity: 0, height: 0 }}
          key="attachments"
          layout="position"
          layoutDependency={layoutDependency}
        >
          {items.map((item, index) => (
            <AttachedThumbnailCard
              index={index}
              item={item}
              key={item.id}
              layoutDependency={layoutDependency}
              onRemove={onRemove}
            />
          ))}
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}

// --- Composer: leading controls (add files + optional Image pill) ---

type ComposerLeadingControlsProps = {
  isImageMode: boolean;
  isPromptExpanded: boolean;
  layoutDependency: string;
  onOpenFilePicker: () => void;
  onExitImageMode: () => void;
};

function ComposerLeadingControls({
  isImageMode,
  isPromptExpanded,
  layoutDependency,
  onOpenFilePicker,
  onExitImageMode,
}: ComposerLeadingControlsProps) {
  return (
    <motion.div
      className={cn(
        "flex items-center gap-1",
        isImageMode && "order-3",
        !isImageMode && isPromptExpanded && "order-2"
      )}
      layout="position"
      layoutDependency={layoutDependency}
    >
      <motion.button
        aria-label="Add files and more"
        className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-muted-foreground duration-150 ease-out [transition-property:background-color,scale] hover:bg-muted focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-card active:scale-[0.96]"
        layout="position"
        layoutDependency={layoutDependency}
        onClick={onOpenFilePicker}
        type="button"
      >
        <Plus className="h-5 w-5" strokeWidth={1.5} />
      </motion.button>
      <AnimatePresence initial={false} mode="popLayout">
        {isImageMode ? (
          <motion.button
            animate={{
              opacity: 1,
              scale: 1,
              filter: "blur(0px)",
            }}
            aria-label="Image, click to remove"
            className="group inline-flex h-10 max-w-40 shrink-0 items-center rounded-full py-0 pr-3 pl-2 text-primary ring-primary/0 transition-[border-color,background-color,ring-color,transform] duration-200 ease-out hover:bg-primary/12 hover:ring-1 focus:outline-none focus-visible:border-primary/40 focus-visible:bg-primary/12 focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-card active:scale-[0.96] motion-reduce:transition-none"
            exit={{ opacity: 0, scale: 0.9, filter: "blur(4px)" }}
            initial={{ opacity: 0, scale: 0.9, filter: "blur(4px)" }}
            key="image-pill"
            layout="position"
            layoutDependency={layoutDependency}
            onClick={onExitImageMode}
            type="button"
          >
            <span className="-translate-x-0.5 inline-flex items-center gap-1.5">
              <div
                aria-hidden
                className="pointer-events-none relative grid size-7 shrink-0 place-items-center rounded-full transition-[background-color] duration-200 ease-out group-hover:bg-primary/22 group-focus-visible:bg-primary/22 motion-reduce:transition-none"
              >
                <span className="col-start-1 row-start-1 flex size-full items-center justify-center">
                  <LucideImages
                    aria-hidden
                    className="size-[18px] shrink-0 transition-[opacity,transform] duration-200 ease-out group-hover:scale-90 group-hover:opacity-0 group-focus-visible:scale-90 group-focus-visible:opacity-0 motion-reduce:transition-none"
                    strokeWidth={1.75}
                  />
                </span>
                <span className="col-start-1 row-start-1 flex size-full items-center justify-center">
                  <X
                    aria-hidden
                    className="size-4 shrink-0 scale-90 opacity-0 transition-[opacity,transform] duration-200 ease-out group-hover:scale-100 group-hover:opacity-100 group-focus-visible:scale-100 group-focus-visible:opacity-100 motion-reduce:transition-none"
                    strokeWidth={2}
                  />
                </span>
              </div>
              <span className="in-data-collapse-labels:sr-only whitespace-nowrap text-left font-medium text-[15px] leading-5">
                Image
              </span>
            </span>
          </motion.button>
        ) : null}
      </AnimatePresence>
    </motion.div>
  );
}

// --- Composer: prompt + trailing actions ---

type ComposerPromptTextareaProps = {
  isImageMode: boolean;
  isPromptExpanded: boolean;
  prompt: string;
  onPromptChange: (value: string) => void;
  onKeyDown: (e: React.KeyboardEvent<HTMLTextAreaElement>) => void;
  textareaRef: React.RefObject<HTMLTextAreaElement | null>;
};

function ComposerPromptTextarea({
  isImageMode,
  isPromptExpanded,
  prompt,
  onPromptChange,
  onKeyDown,
  textareaRef,
}: ComposerPromptTextareaProps) {
  // Drive the scroll-linked mask fades from the textarea's scroll position.
  // When content isn't scrollable, both fades collapse to 0 and the mask is
  // a no-op. The `vertical-scroll-fade-mask` class is only applied when
  // scrollable to avoid an always-on bottom fade with nothing behind it.
  const [isScrollable, setIsScrollable] = useState(false);

  const syncScrollFade = useCallback((el: HTMLTextAreaElement | null) => {
    if (!el) {
      return;
    }
    const { scrollTop, scrollHeight, clientHeight } = el;
    const maxScroll = scrollHeight - clientHeight;
    const scrollable = maxScroll > 1;
    setIsScrollable(scrollable);
    if (!scrollable) {
      el.style.setProperty("--top-fade", "0px");
      el.style.setProperty("--bottom-fade", "0px");
      return;
    }
    const edgeFadePx = 16;
    const topFade = Math.min(edgeFadePx, Math.max(0, scrollTop));
    const bottomFade = Math.min(edgeFadePx, Math.max(0, maxScroll - scrollTop));
    el.style.setProperty("--top-fade", `${topFade}px`);
    el.style.setProperty("--bottom-fade", `${bottomFade}px`);
  }, []);

  useEffect(() => {
    syncScrollFade(textareaRef.current);
  }, [prompt, isImageMode, isPromptExpanded, syncScrollFade, textareaRef]);

  return (
    <textarea
      aria-label={isImageMode ? "Describe or edit an image" : "Ask anything"}
      className={cn(
        "resize-none bg-transparent px-2 py-2 text-base text-foreground leading-6 placeholder:text-muted-foreground focus:outline-none",
        isImageMode && "order-2 block w-full overflow-y-auto",
        !(isImageMode || isPromptExpanded) && "min-w-0 flex-1 overflow-y-auto",
        !isImageMode &&
          isPromptExpanded &&
          "order-1 block w-full overflow-y-auto",
        isScrollable && "vertical-scroll-fade-mask"
      )}
      onChange={(e) => onPromptChange(e.target.value)}
      onKeyDown={onKeyDown}
      onScroll={(e) => syncScrollFade(e.currentTarget)}
      placeholder={isImageMode ? "Describe or edit an image" : "Ask anything"}
      ref={textareaRef}
      rows={1}
      value={prompt}
    />
  );
}

type ComposerTrailingActionsProps = {
  isImageMode: boolean;
  isPromptExpanded: boolean;
  layoutDependency: string;
  onSend: () => void;
};

function ComposerTrailingActions({
  isImageMode,
  isPromptExpanded,
  layoutDependency,
  onSend,
}: ComposerTrailingActionsProps) {
  return (
    <motion.div
      className={cn(
        "flex items-center gap-2",
        isImageMode && "order-4 ml-auto",
        !isImageMode && isPromptExpanded && "order-3 ml-auto"
      )}
      layout="position"
      layoutDependency={layoutDependency}
    >
      <motion.button
        aria-label="Start dictation"
        className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-muted-foreground duration-150 ease-out [transition-property:background-color,scale] hover:bg-muted focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-card active:scale-[0.96]"
        layout="position"
        layoutDependency={layoutDependency}
        type="button"
      >
        <Mic className="h-5 w-5" strokeWidth={1.5} />
      </motion.button>
      <motion.button
        animate={{
          width: isImageMode ? 40 : 36,
          height: isImageMode ? 40 : 36,
        }}
        aria-label="Send"
        className="flex shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground duration-150 ease-out [transition-property:background-color,scale] hover:opacity-90 focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-card active:scale-[0.96]"
        layout="position"
        layoutDependency={layoutDependency}
        onClick={onSend}
        type="button"
      >
        <ArrowUp className="h-5 w-5" strokeWidth={2} />
      </motion.button>
    </motion.div>
  );
}

// --- Below composer: quick actions when not in image mode ---

type NonImageQuickActionsContentProps = {
  onEnterImageMode: () => void;
};

/** Chip row only; parent `motion.div` owns layout + enter/exit for `AnimatePresence`. */
function NonImageQuickActionsContent({
  onEnterImageMode,
}: NonImageQuickActionsContentProps) {
  return (
    <>
      <button
        className="inline-flex h-10 items-center gap-2 rounded-full border border-border bg-card px-4 text-foreground text-sm duration-150 ease-out [transition-property:background-color,scale] hover:bg-muted focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background active:scale-[0.96]"
        onClick={onEnterImageMode}
        type="button"
      >
        <ImageIcon />
        Create an image
      </button>
      <button
        className="inline-flex h-10 items-center gap-2 rounded-full border border-border bg-card px-4 text-foreground text-sm duration-150 ease-out [transition-property:background-color,scale] hover:bg-muted focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background active:scale-[0.96]"
        type="button"
      >
        <Pencil aria-hidden className="h-4 w-4" strokeWidth={1.75} />
        Write or edit
      </button>
      <button
        className="inline-flex h-10 items-center gap-2 rounded-full border border-border bg-card px-4 text-foreground text-sm duration-150 ease-out [transition-property:background-color,scale] hover:bg-muted focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background active:scale-[0.96]"
        type="button"
      >
        <Globe aria-hidden className="h-4 w-4" strokeWidth={1.75} />
        Look something up
      </button>
    </>
  );
}

// --- Ideas panel: header (stage title, back, carousel scroll) ---

type IdeasPanelHeaderProps = {
  stage: "explore" | "attach";
  onBackToExplore: () => void;
  onScrollCarousel: (direction: "left" | "right") => void;
};

function IdeasPanelHeader({
  stage,
  onBackToExplore,
  onScrollCarousel,
}: IdeasPanelHeaderProps) {
  return (
    <div className="mb-5 flex items-center justify-between">
      <div className="flex min-w-0 items-center gap-2">
        {stage === "attach" ? (
          <button
            aria-label="Back to explore ideas"
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-foreground duration-150 ease-out [transition-property:background-color,scale] hover:bg-muted focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background active:scale-[0.96]"
            onClick={onBackToExplore}
            type="button"
          >
            <ChevronLeft className="h-5 w-5" strokeWidth={1.75} />
          </button>
        ) : null}
        <h2 className="min-w-0 font-semibold text-foreground text-lg">
          {stage === "attach" ? "Attach a photo" : "Explore ideas"}
        </h2>
      </div>
      <div className="flex items-center gap-3">
        <span className="cursor-pointer text-muted-foreground text-sm underline decoration-dotted underline-offset-4 hover:text-foreground">
          {"What's new"}
        </span>
        <div className="flex items-center gap-1">
          <button
            aria-label="Scroll left"
            className="flex h-9 w-9 items-center justify-center rounded-full border border-border bg-card text-muted-foreground duration-150 ease-out [transition-property:background-color,scale] hover:bg-muted focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background active:scale-[0.96]"
            onClick={() => onScrollCarousel("left")}
            type="button"
          >
            <ChevronLeft className="h-5 w-5" strokeWidth={1.5} />
          </button>
          <button
            aria-label="Scroll right"
            className="flex h-9 w-9 items-center justify-center rounded-full border border-border bg-card text-muted-foreground duration-150 ease-out [transition-property:background-color,scale] hover:bg-muted focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background active:scale-[0.96]"
            onClick={() => onScrollCarousel("right")}
            type="button"
          >
            <ChevronRight className="h-5 w-5" strokeWidth={1.5} />
          </button>
        </div>
      </div>
    </div>
  );
}

// --- Ideas panel: horizontal carousel (upload + ideas or attachment picks) ---

type IdeasCarouselProps = {
  carouselRef: React.RefObject<HTMLDivElement | null>;
  stage: "explore" | "attach";
  ideas: OpenAIChatIdea[];
  attachments: OpenAIChatAttachment[];
  attachedItems: AttachedItem[];
  onOpenFilePicker: () => void;
  onIdeaSelect: (idea: OpenAIChatIdea) => void;
  onAttachmentSelect: (attachment: OpenAIChatAttachment) => void;
};

function IdeasCarousel({
  carouselRef,
  stage,
  ideas,
  attachments,
  attachedItems,
  onOpenFilePicker,
  onIdeaSelect,
  onAttachmentSelect,
}: IdeasCarouselProps) {
  return (
    <div
      className="scrollbar-hide flex gap-4 overflow-x-auto pb-2"
      ref={carouselRef}
      style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
    >
      <button
        aria-label="Upload a photo"
        className="group relative flex h-[180px] w-[144px] shrink-0 flex-col items-center justify-center overflow-hidden rounded-2xl border-2 border-border/10 bg-muted text-muted-foreground duration-150 ease-out [transition-property:background-color,border-color,scale] hover:border-border hover:bg-muted/80 focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background active:scale-[0.98]"
        onClick={onOpenFilePicker}
        type="button"
      >
        <Plus className="h-8 w-8" strokeWidth={1.5} />
        <span className="mt-3 text-center font-medium text-sm">
          Upload a photo
        </span>
      </button>

      {stage === "explore"
        ? ideas.map((idea) => (
            <button
              className="group relative shrink-0 cursor-pointer overflow-hidden rounded-2xl duration-150 ease-out hover:brightness-110 focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
              key={`${idea.image}-${idea.label}`}
              onClick={() => onIdeaSelect(idea)}
              type="button"
            >
              <div className="relative h-[180px] w-[144px] overflow-hidden rounded-2xl">
                <Image
                  alt={idea.label}
                  className="rounded-2xl object-cover"
                  fill
                  sizes="144px"
                  src={idea.image}
                />
                <div className="pointer-events-none absolute inset-0 rounded-2xl bg-linear-to-t from-black/50 via-transparent to-transparent" />
                <span className="absolute right-3 bottom-3 left-3 font-medium text-sm text-white drop-shadow-sm">
                  {idea.label}
                </span>
              </div>
            </button>
          ))
        : attachments.map((attachment, index) => {
            const alreadyAttached = attachedItems.some(
              (item) => item.kind === "remote" && item.src === attachment.image
            );
            return (
              <button
                aria-label={
                  alreadyAttached
                    ? `Attached: ${attachment.alt ?? "Source photo"}`
                    : `Attach ${attachment.alt ?? "Source photo"}`
                }
                aria-pressed={alreadyAttached}
                className="group relative shrink-0 cursor-pointer overflow-hidden rounded-2xl bg-muted duration-150 ease-out hover:brightness-110 focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background active:scale-[0.98]"
                key={`${attachment.image}-${index}`}
                onClick={() => onAttachmentSelect(attachment)}
                type="button"
              >
                <div className="relative h-[180px] w-[144px] overflow-hidden rounded-2xl">
                  <Image
                    alt={attachment.alt ?? "Source photo"}
                    className="rounded-2xl object-cover"
                    fill
                    sizes="144px"
                    src={attachment.image}
                  />
                  <div className="-outline-offset-1 pointer-events-none absolute inset-0 rounded-2xl outline-1 outline-foreground/10" />
                  {alreadyAttached ? (
                    <div className="pointer-events-none absolute inset-0 rounded-2xl bg-black/30 ring-2 ring-primary ring-inset" />
                  ) : null}
                </div>
              </button>
            );
          })}
    </div>
  );
}

type IdeasSectionContentProps = {
  stage: "explore" | "attach";
  ideas: OpenAIChatIdea[];
  attachments: OpenAIChatAttachment[];
  attachedItems: AttachedItem[];
  carouselRef: React.RefObject<HTMLDivElement | null>;
  onBackToExplore: () => void;
  onScrollCarousel: (direction: "left" | "right") => void;
  onOpenFilePicker: () => void;
  onIdeaSelect: (idea: OpenAIChatIdea) => void;
  onAttachmentSelect: (attachment: OpenAIChatAttachment) => void;
};

/** Header + carousel; parent `motion.div` owns spacing + enter/exit for `AnimatePresence`. */
function IdeasSectionContent({
  stage,
  ideas,
  attachments,
  attachedItems,
  carouselRef,
  onBackToExplore,
  onScrollCarousel,
  onOpenFilePicker,
  onIdeaSelect,
  onAttachmentSelect,
}: IdeasSectionContentProps) {
  return (
    <>
      <IdeasPanelHeader
        onBackToExplore={onBackToExplore}
        onScrollCarousel={onScrollCarousel}
        stage={stage}
      />
      <IdeasCarousel
        attachedItems={attachedItems}
        attachments={attachments}
        carouselRef={carouselRef}
        ideas={ideas}
        onAttachmentSelect={onAttachmentSelect}
        onIdeaSelect={onIdeaSelect}
        onOpenFilePicker={onOpenFilePicker}
        stage={stage}
      />
    </>
  );
}

// --- Public API ---

export type OpenAIChatImageProps = {
  initialPrompt?: string;
  /** When true, start in image mode (Image pill + gallery). Default true. */
  defaultImageMode?: boolean;
  ideas?: OpenAIChatIdea[];
  /** Photos shown in the "Attach a photo" row after an idea is selected. */
  attachments?: OpenAIChatAttachment[];
  onSubmit?: (prompt: string, files: File[]) => void;
  onIdeaClick?: (idea: OpenAIChatIdea) => void;
  onAttachmentClick?: (attachment: OpenAIChatAttachment) => void;
};

export function OpenAIChatImage({
  initialPrompt = "",
  defaultImageMode = true,
  ideas = defaultIdeas,
  attachments = defaultAttachments,
  onSubmit,
  onIdeaClick,
  onAttachmentClick,
}: OpenAIChatImageProps) {
  const [prompt, setPrompt] = useState(initialPrompt);
  const [attachedItems, setAttachedItems] = useState<AttachedItem[]>([]);
  const [isImageMode, setIsImageMode] = useState(defaultImageMode);
  const [stage, setStage] = useState<"explore" | "attach">("explore");
  const carouselRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const promptInputRef = useRef<HTMLTextAreaElement>(null);

  const scrollCarousel = (direction: "left" | "right") => {
    if (carouselRef.current) {
      const scrollAmount = 240;
      carouselRef.current.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth",
      });
    }
  };

  const openFilePicker = useCallback(() => {
    fileInputRef.current?.click();
  }, []);

  const addFiles = useCallback((newFileList: FileList | File[]) => {
    const fileArray = Array.from(newFileList);
    const imageFiles = fileArray.filter((file) =>
      file.type.startsWith("image/")
    );

    const newItems: AttachedItem[] = imageFiles.map((file) => ({
      kind: "file",
      id: crypto.randomUUID(),
      file,
      preview: URL.createObjectURL(file),
      alt: file.name,
    }));

    setAttachedItems((prev) => [...prev, ...newItems]);
  }, []);

  const handleFileSelect = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const selectedFiles = e.target.files;
      if (!selectedFiles) {
        return;
      }

      addFiles(selectedFiles);

      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    },
    [addFiles]
  );

  const removeAttachment = useCallback((id: string) => {
    setAttachedItems((prev) => {
      const toRemove = prev.find((item) => item.id === id);
      if (toRemove?.kind === "file") {
        URL.revokeObjectURL(toRemove.preview);
      }
      return prev.filter((item) => item.id !== id);
    });
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      const droppedFiles = e.dataTransfer.files;
      if (!droppedFiles) {
        return;
      }
      addFiles(droppedFiles);
    },
    [addFiles]
  );

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
  }, []);

  const handleSubmit = () => {
    const files: File[] = attachedItems.flatMap((item) =>
      item.kind === "file" ? [item.file] : []
    );
    onSubmit?.(prompt, files);
  };

  const attachRemoteImage = useCallback(
    (attachment: OpenAIChatAttachment) => {
      const exists = attachedItems.some(
        (item) => item.kind === "remote" && item.src === attachment.image
      );
      if (!exists) {
        setAttachedItems((prev) => [
          ...prev,
          {
            kind: "remote",
            id: crypto.randomUUID(),
            src: attachment.image,
            alt: attachment.alt,
          },
        ]);
      }
      onAttachmentClick?.(attachment);
    },
    [attachedItems, onAttachmentClick]
  );

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  const exitImageMode = useCallback(() => {
    setIsImageMode(false);
    setStage("explore");
  }, []);

  const handleIdeaClick = useCallback(
    (idea: OpenAIChatIdea) => {
      setPrompt(idea.prompt);
      setStage("attach");
      onIdeaClick?.(idea);
      requestAnimationFrame(() => {
        const el = promptInputRef.current;
        if (!el) {
          return;
        }
        el.focus();
        const len = el.value.length;
        el.setSelectionRange(len, len);
      });
    },
    [onIdeaClick]
  );

  const backToExplore = useCallback(() => {
    setStage("explore");
    setPrompt("");
  }, []);

  // When the non-image composer should switch to a stacked layout (textarea on
  // its own full-width row, leading/trailing controls below). Derived purely
  // from the prompt text so there is no layout-feedback flicker when the
  // available width of the textarea changes across the two layouts.
  const isPromptExpanded =
    !isImageMode && (prompt.includes("\n") || prompt.length > 45);

  // biome-ignore lint/correctness/useExhaustiveDependencies: include `prompt` so height tracks typed content (`scrollHeight`); static analysis flags it as unused.
  useEffect(() => {
    const el = promptInputRef.current;
    if (!el) {
      return;
    }
    el.style.height = "auto";
    let maxHeight: number;
    if (isImageMode) {
      maxHeight = stage === "attach" ? 240 : 160;
    } else {
      maxHeight = 160;
    }
    el.style.height = `${Math.min(el.scrollHeight, maxHeight)}px`;
  }, [prompt, isImageMode, stage, isPromptExpanded]);

  const shouldReduceMotion = useReducedMotion();
  const transition = shouldReduceMotion ? { duration: 0 } : composerSpring;
  const fadeTransition = shouldReduceMotion
    ? { duration: 0 }
    : ({ duration: 0.2, ease: [0.23, 1, 0.32, 1] } as const);

  const [composerContentRef, { height: composerContentHeight }] = useMeasure({
    offsetSize: true,
  });

  const showAttachmentStrip = isImageMode && attachedItems.length > 0;

  const composerLayoutDependency = useMemo(
    () =>
      [
        isImageMode,
        isPromptExpanded,
        showAttachmentStrip,
        attachedItems.length,
        stage,
      ].join("|"),
    [
      isImageMode,
      isPromptExpanded,
      showAttachmentStrip,
      attachedItems.length,
      stage,
    ]
  );

  return (
    <MotionConfig transition={transition}>
      <div className="w-full">
        <input
          accept="image/*"
          className="hidden"
          multiple
          onChange={handleFileSelect}
          ref={fileInputRef}
          type="file"
        />

        <motion.div
          animate={{
            borderRadius: isImageMode ? 28 : 32,
            height: composerContentHeight || "auto",
          }}
          className="overflow-hidden bg-card shadow-sm ring-1 ring-border dark:bg-[#303030]"
          initial={false}
          onDragOver={handleDragOver}
          onDrop={handleDrop}
          style={{ borderRadius: isImageMode ? 28 : 48 }}
        >
          <div
            className={cn(
              "flex flex-row",
              isImageMode && "flex-wrap items-center gap-y-2 p-2.5",
              !(isImageMode || isPromptExpanded) &&
                "items-end gap-1 px-2 py-1.5",
              !isImageMode &&
                isPromptExpanded &&
                "flex-wrap items-end gap-x-1 gap-y-2 px-2 pt-2 pb-1.5"
            )}
            ref={composerContentRef}
          >
            <ComposerAttachmentStrip
              items={attachedItems}
              layoutDependency={composerLayoutDependency}
              onRemove={removeAttachment}
              show={showAttachmentStrip}
            />

            <ComposerLeadingControls
              isImageMode={isImageMode}
              isPromptExpanded={isPromptExpanded}
              layoutDependency={composerLayoutDependency}
              onExitImageMode={exitImageMode}
              onOpenFilePicker={openFilePicker}
            />

            <ComposerPromptTextarea
              isImageMode={isImageMode}
              isPromptExpanded={isPromptExpanded}
              onKeyDown={handleKeyDown}
              onPromptChange={setPrompt}
              prompt={prompt}
              textareaRef={promptInputRef}
            />

            <ComposerTrailingActions
              isImageMode={isImageMode}
              isPromptExpanded={isPromptExpanded}
              layoutDependency={composerLayoutDependency}
              onSend={handleSubmit}
            />
          </div>
        </motion.div>

        <AnimatePresence initial={false} mode="popLayout">
          {isImageMode ? null : (
            <motion.div
              animate={{ opacity: 1, y: 0 }}
              className="mt-4 flex flex-wrap items-center justify-center gap-2"
              exit={{ opacity: 0, y: -4 }}
              initial={{ opacity: 0, y: -4 }}
              key="quick-actions"
              transition={fadeTransition}
            >
              <NonImageQuickActionsContent
                onEnterImageMode={() => {
                  setIsImageMode(true);
                  setStage("explore");
                }}
              />
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence initial={false} mode="popLayout">
          {isImageMode ? (
            <motion.div
              animate={{ opacity: 1, y: 0 }}
              className="mt-10"
              exit={{ opacity: 0, y: 8 }}
              initial={{ opacity: 0, y: 8 }}
              key="ideas"
              transition={fadeTransition}
            >
              <IdeasSectionContent
                attachedItems={attachedItems}
                attachments={attachments}
                carouselRef={carouselRef}
                ideas={ideas}
                onAttachmentSelect={attachRemoteImage}
                onBackToExplore={backToExplore}
                onIdeaSelect={handleIdeaClick}
                onOpenFilePicker={openFilePicker}
                onScrollCarousel={scrollCarousel}
                stage={stage}
              />
            </motion.div>
          ) : null}
        </AnimatePresence>
      </div>
    </MotionConfig>
  );
}
