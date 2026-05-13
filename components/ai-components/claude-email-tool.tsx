"use client";

import { Check, ChevronDown, Copy, RotateCcw } from "lucide-react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { useEffect, useId, useRef, useState } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";

export type EmailMessageVariant = {
  label: string;
  subject: string;
  body: string;
};

export type ClaudeEmailToolProps = {
  kind: "email";
  /** Short label for the draft (e.g. card or list title). */
  summary_title: string;
  /** One or more writing versions; multiple entries show a style switcher. */
  variants: EmailMessageVariant[];
  /** Called when the user edits the body (in addition to internal state). */
  onBodyChange?: (body: string) => void;
};

const motionEase = { type: "spring" as const, duration: 0.3, bounce: 0 };

function GmailIcon({ className }: { className?: string }) {
  return (
    <svg
      aria-hidden
      className={className}
      fill="none"
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
    >
      <title>Gmail</title>
      <path
        d="M22 6V18C22 19.1046 21.1046 20 20 20H18V9.23607L12 13.2361L6 9.23607V20H4C2.89543 20 2 19.1046 2 18V6C2 4.89543 2.89543 4 4 4H5.13889L12 9.23607L18.8611 4H20C21.1046 4 22 4.89543 22 6Z"
        fill="#EA4335"
      />
      <path
        d="M6 9.23607V20H4C2.89543 20 2 19.1046 2 18V6C2 4.89543 2.89543 4 4 4H5.13889L12 9.23607L6 13.2361V9.23607Z"
        fill="#FBBC05"
      />
      <path d="M6 9.23607L12 13.2361L18 9.23607V20H6V9.23607Z" fill="#F1F1F1" />
      <path
        d="M6 9.23607L12 13.2361V9.23607L5.13889 4H4C2.89543 4 2 4.89543 2 6V7L6 9.23607Z"
        fill="#C5221F"
      />
      <path
        d="M18 9.23607L12 13.2361V9.23607L18.8611 4H20C21.1046 4 22 4.89543 22 6V7L18 9.23607Z"
        fill="#1A73E8"
      />
      <path
        d="M22 6V7L18 9.23607V20H20C21.1046 20 22 19.1046 22 18V6Z"
        fill="#34A853"
      />
    </svg>
  );
}

function MailIcon({ className }: { className?: string }) {
  return (
    <svg
      aria-hidden
      className={cn("text-primary", className)}
      fill="none"
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
    >
      <title>Mail</title>
      <path
        d="M3 8L10.89 13.26C11.2187 13.4793 11.6049 13.5963 12 13.5963C12.3951 13.5963 12.7813 13.4793 13.11 13.26L21 8M5 19H19C19.5304 19 20.0391 18.7893 20.4142 18.4142C20.7893 18.0391 21 17.5304 21 17V7C21 6.46957 20.7893 5.96086 20.4142 5.58579C20.0391 5.21071 19.5304 5 19 5H5C4.46957 5 3.96086 5.21071 3.58579 5.58579C3.21071 5.96086 3 6.46957 3 7V17C3 17.5304 3.21071 18.0391 3.58579 18.4142C3.96086 18.7893 4.46957 19 5 19Z"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
      />
    </svg>
  );
}

function variantBadgeLetter(index: number) {
  if (index < 0 || index > 25) {
    return String(index + 1);
  }
  return String.fromCodePoint(65 + index);
}

export function ClaudeEmailTool({
  summary_title: summaryTitle,
  variants,
  onBodyChange,
}: ClaudeEmailToolProps) {
  const [variantIndex, setVariantIndex] = useState(0);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const bodyFieldId = useId();
  const reduceMotion = useReducedMotion();

  const maxIndex = Math.max(0, variants.length - 1);
  const safeIndex = Math.min(variantIndex, maxIndex);
  const current = variants[safeIndex];
  const subject = current?.subject ?? "";
  const body = current?.body ?? "";

  const [bodyText, setBodyText] = useState(body);

  useEffect(() => {
    if (variantIndex > maxIndex) {
      setVariantIndex(maxIndex);
    }
  }, [variantIndex, maxIndex]);

  useEffect(() => {
    setBodyText(body);
  }, [body]);

  const transition = reduceMotion ? { duration: 0 } : motionEase;

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsDropdownOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleBodyChange = (value: string) => {
    setBodyText(value);
    onBodyChange?.(value);
  };

  const isDirty = bodyText !== body;

  const contentAnimateKey = `${safeIndex}__${subject}__${body}`;

  const handleReset = () => {
    setBodyText(body);
    onBodyChange?.(body);
  };

  const handleCopy = async () => {
    const textToCopy = `Subject: ${subject}\n\n${bodyText}`;
    await navigator.clipboard.writeText(textToCopy);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSendViaGmail = () => {
    const gmailUrl = `https://mail.google.com/mail/?view=cm&fs=1&su=${encodeURIComponent(subject)}&body=${encodeURIComponent(bodyText)}`;
    window.open(gmailUrl, "_blank");
    setIsDropdownOpen(false);
  };

  const handleOpenInMail = () => {
    const mailtoUrl = `mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(bodyText)}`;
    window.location.href = mailtoUrl;
    setIsDropdownOpen(false);
  };

  const iconMotionProps = {
    initial: {
      opacity: 0,
      scale: 0.25,
      filter: "blur(4px)",
    },
    animate: {
      opacity: 1,
      scale: 1,
      filter: "blur(0px)",
    },
    exit: {
      opacity: 0,
      scale: 0.25,
      filter: "blur(4px)",
    },
    transition,
  };

  const contentExit = reduceMotion
    ? { opacity: 0 }
    : { opacity: 0, y: -6, filter: "blur(4px)" };
  const contentInitial = reduceMotion
    ? { opacity: 0 }
    : { opacity: 0, y: 8, filter: "blur(4px)" };
  const contentAnimate = reduceMotion
    ? { opacity: 1 }
    : { opacity: 1, y: 0, filter: "blur(0px)" };

  const showVariantPicker = variants.length > 1;

  return (
    <div className="w-full max-w-3xl rounded-2xl bg-card shadow-sm ring-1 ring-border">
      <div className="px-5 pt-4 pb-3 sm:px-8 sm:pt-5">
        <p className="font-medium text-muted-foreground text-sm">
          {summaryTitle}
        </p>
        {showVariantPicker ? (
          <fieldset className="mt-3">
            <legend className="sr-only">Writing style</legend>
            <div className="flex flex-wrap gap-2">
              {variants.map((variant, index) => {
                const selected = safeIndex === index;
                return (
                  <button
                    aria-pressed={selected}
                    className={
                      selected
                        ? "inline-flex items-center gap-2 rounded-full bg-primary/10 py-1.5 pr-3 pl-2 text-left font-medium text-primary text-sm ring-1 ring-primary/20 transition-[color,background-color,box-shadow] duration-200 ease-out hover:bg-primary/15 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50"
                        : "inline-flex items-center gap-2 rounded-full py-1.5 pr-3 pl-2 text-left font-medium text-foreground text-sm transition-[color,background-color] duration-200 ease-out hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/40"
                    }
                    key={`${variant.label}-${index}`}
                    onClick={() => setVariantIndex(index)}
                    type="button"
                  >
                    <span
                      className={
                        selected
                          ? "flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary font-semibold text-[0.7rem] text-primary-foreground"
                          : "flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-muted font-semibold text-[0.7rem] text-muted-foreground"
                      }
                    >
                      {variantBadgeLetter(index)}
                    </span>
                    {variant.label}
                  </button>
                );
              })}
            </div>
          </fieldset>
        ) : null}
      </div>
      <div aria-hidden className="mx-5 h-px bg-border sm:mx-8" />

      <AnimatePresence initial={false} mode="wait">
        <motion.div
          animate={contentAnimate}
          className="min-w-0"
          exit={contentExit}
          initial={contentInitial}
          key={contentAnimateKey}
          transition={transition}
        >
          {/* Subject Line */}
          <div className="px-8 py-5">
            <div className="flex items-baseline gap-3">
              <span className="shrink-0 text-muted-foreground text-sm">
                Subject:
              </span>
              <span className="min-w-0 text-balance font-medium text-base text-foreground">
                {subject}
              </span>
            </div>
          </div>

          {/* Divider — soft edge via shadow instead of flat rule */}
          <div aria-hidden className="mx-8 h-px bg-border" />

          {/* Body */}
          <div className="px-8 py-6">
            <ScrollArea className="max-h-72">
              <label className="sr-only" htmlFor={bodyFieldId}>
                Email body
              </label>
              <textarea
                className="field-sizing-content max-h-72 min-h-48 w-full resize-none appearance-none whitespace-pre-wrap text-pretty border-0 bg-transparent p-0 pr-3 text-base text-foreground leading-relaxed shadow-none outline-none ring-0 placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/40 focus-visible:ring-offset-2 focus-visible:ring-offset-background"
                id={bodyFieldId}
                onChange={(e) => handleBodyChange(e.target.value)}
                spellCheck
                value={bodyText}
              />
            </ScrollArea>
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Actions */}
      <div className="flex items-center justify-end gap-2 px-8 pb-6">
        <div className="flex h-10 min-h-10 items-stretch overflow-hidden rounded-xl bg-card shadow-sm ring-1 ring-border transition-[box-shadow] duration-200 ease-out hover:shadow-md">
          <button
            aria-label="Copy email"
            className="flex min-h-10 min-w-10 shrink-0 items-center justify-center px-3 text-muted-foreground transition-[color,background-color,transform] duration-200 ease-out hover:bg-muted hover:text-foreground focus-visible:z-10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/40 focus-visible:ring-inset active:scale-[0.96]"
            onClick={handleCopy}
            type="button"
          >
            <span className="relative flex h-4 w-4 items-center justify-center">
              <AnimatePresence initial={false} mode="popLayout">
                {copied ? (
                  <motion.span
                    className="absolute inset-0 flex items-center justify-center"
                    key="check"
                    {...iconMotionProps}
                  >
                    <Check className="h-4 w-4" />
                  </motion.span>
                ) : (
                  <motion.span
                    className="absolute inset-0 flex items-center justify-center"
                    key="copy"
                    {...iconMotionProps}
                  >
                    <Copy className="h-4 w-4" />
                  </motion.span>
                )}
              </AnimatePresence>
            </span>
          </button>

          <AnimatePresence initial={false}>
            {isDirty && (
              <motion.div
                animate={reduceMotion ? { opacity: 1 } : { opacity: 1, x: 0 }}
                className="flex items-stretch"
                exit={reduceMotion ? { opacity: 0 } : { opacity: 0, x: 8 }}
                initial={reduceMotion ? { opacity: 0 } : { opacity: 0, x: 8 }}
                key="reset-toolbar"
                transition={transition}
              >
                <div aria-hidden className="my-2 w-px shrink-0 bg-border" />
                <Tooltip>
                  <TooltipTrigger
                    aria-label="Reset changes"
                    className="flex min-h-10 min-w-10 shrink-0 cursor-pointer items-center justify-center px-3 text-muted-foreground transition-[color,background-color,transform] duration-200 ease-out hover:bg-muted hover:text-foreground focus-visible:z-10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/40 focus-visible:ring-inset active:scale-[0.96]"
                    onClick={handleReset}
                    type="button"
                  >
                    <RotateCcw aria-hidden className="h-4 w-4" />
                  </TooltipTrigger>
                  <TooltipContent align="center" side="bottom" sideOffset={8}>
                    Reset changes
                  </TooltipContent>
                </Tooltip>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <div className="relative" ref={dropdownRef}>
          <button
            aria-expanded={isDropdownOpen}
            aria-haspopup="menu"
            className="flex h-10 min-h-10 items-center gap-2 rounded-xl bg-card pr-2 pl-3 font-medium text-foreground text-sm shadow-sm ring-1 ring-border transition-[color,transform,box-shadow] duration-200 ease-out hover:bg-muted hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/40 active:scale-[0.96]"
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            type="button"
          >
            <GmailIcon className="h-5 w-5 shrink-0" />
            <span>Send via Gmail</span>
            <ChevronDown
              className={`h-4 w-4 shrink-0 text-muted-foreground transition-transform duration-200 ease-[cubic-bezier(0.2,0,0,1)] ${isDropdownOpen ? "rotate-180" : ""}`}
            />
          </button>

          <AnimatePresence>
            {isDropdownOpen && (
              <motion.div
                animate={reduceMotion ? { opacity: 1 } : { opacity: 1, y: 0 }}
                className="absolute top-full right-0 z-10 mt-2 w-48 overflow-hidden rounded-xl bg-popover text-popover-foreground shadow-md ring-1 ring-border"
                exit={reduceMotion ? { opacity: 0 } : { opacity: 0, y: -4 }}
                initial={reduceMotion ? { opacity: 0 } : { opacity: 0, y: 6 }}
                transition={transition}
              >
                <button
                  className="flex min-h-11 w-full items-center gap-3 px-4 py-3 text-left text-popover-foreground text-sm transition-[background-color,transform] duration-200 ease-out hover:bg-muted focus-visible:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/30 focus-visible:ring-inset active:scale-[0.96]"
                  onClick={handleSendViaGmail}
                  role="menuitem"
                  type="button"
                >
                  <GmailIcon className="h-5 w-5 shrink-0" />
                  <span>Send via Gmail</span>
                </button>
                <button
                  className="flex min-h-11 w-full items-center gap-3 px-4 py-3 text-left text-popover-foreground text-sm transition-[background-color,transform] duration-200 ease-out hover:bg-muted focus-visible:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/30 focus-visible:ring-inset active:scale-[0.96]"
                  onClick={handleOpenInMail}
                  role="menuitem"
                  type="button"
                >
                  <MailIcon className="h-5 w-5 shrink-0" />
                  <span>Open in Mail</span>
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
