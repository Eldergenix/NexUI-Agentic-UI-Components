"use client";

import {
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  MessageCircleQuestion,
} from "lucide-react";
import { useReducedMotion } from "motion/react";
import {
  type KeyboardEvent,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { cn } from "@/lib/utils";

type Option = {
  id: string;
  label: string;
  isOther?: boolean;
};

type Question = {
  id: string;
  question: string;
  options: Option[];
  multiSelect?: boolean;
};

type QuestionsDialogProps = {
  questions: Question[];
  onSubmit?: (answers: Record<string, string | string[]>) => void;
  onSkip?: () => void;
  /** Initial open state when uncontrolled. Default `true`. */
  defaultOpen?: boolean;
  /** Controlled open state. */
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
};

export function QuestionsDialog({
  questions,
  onSubmit,
  onSkip,
  defaultOpen = true,
  open: openProp,
  onOpenChange,
}: QuestionsDialogProps) {
  const isControlled = openProp !== undefined;
  const [internalOpen, setInternalOpen] = useState(defaultOpen);
  const open = isControlled ? openProp : internalOpen;

  const setOpen = useCallback(
    (next: boolean) => {
      if (!isControlled) {
        setInternalOpen(next);
      }
      onOpenChange?.(next);
    },
    [isControlled, onOpenChange]
  );

  const [focusedQuestionIndex, setFocusedQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string | string[]>>({});
  const [otherText, setOtherText] = useState<Record<string, string>>({});

  const questionRefs = useRef<(HTMLDivElement | null)[]>([]);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const prevFocusedQuestionIndexRef = useRef<number | null>(null);
  const reduceMotion = useReducedMotion();

  const goToQuestion = useCallback(
    (index: number) => {
      const clamped = Math.max(0, Math.min(questions.length - 1, index));
      setFocusedQuestionIndex(clamped);
    },
    [questions.length]
  );

  useEffect(() => {
    setFocusedQuestionIndex((prev) =>
      questions.length === 0 ? 0 : Math.min(prev, questions.length - 1)
    );
  }, [questions.length]);

  useEffect(() => {
    const prev = prevFocusedQuestionIndexRef.current;
    prevFocusedQuestionIndexRef.current = focusedQuestionIndex;
    if (prev === null) {
      return;
    }
    if (prev === focusedQuestionIndex) {
      return;
    }
    const container = scrollContainerRef.current;
    const el = questionRefs.current[focusedQuestionIndex];
    if (!(container && el)) {
      return;
    }
    const childRect = el.getBoundingClientRect();
    const containerRect = container.getBoundingClientRect();
    const scrollMargin = 16;
    const nextTop =
      container.scrollTop + (childRect.top - containerRect.top) - scrollMargin;
    container.scrollTo({
      top: Math.max(0, nextTop),
      behavior: reduceMotion ? "auto" : "smooth",
    });
  }, [focusedQuestionIndex, reduceMotion]);

  const handleSelect = (
    questionId: string,
    optionId: string,
    isMulti?: boolean
  ) => {
    const qIndex = questions.findIndex((q) => q.id === questionId);
    const question = qIndex === -1 ? undefined : questions[qIndex];
    const optionMeta = question?.options.find((o) => o.id === optionId);
    const isOtherOption = optionMeta?.isOther === true;

    if (isMulti) {
      const current = (answers[questionId] as string[]) || [];
      const isAdd = !current.includes(optionId);

      setAnswers((prev) => {
        const next = (prev[questionId] as string[]) || [];
        if (next.includes(optionId)) {
          return {
            ...prev,
            [questionId]: next.filter((id) => id !== optionId),
          };
        }
        return { ...prev, [questionId]: [...next, optionId] };
      });

      if (
        isAdd &&
        !isOtherOption &&
        qIndex !== -1 &&
        qIndex < questions.length - 1
      ) {
        setFocusedQuestionIndex(qIndex + 1);
      }
      return;
    }

    setAnswers((prev) => ({ ...prev, [questionId]: optionId }));

    if (isOtherOption || qIndex === -1 || qIndex >= questions.length - 1) {
      return;
    }

    setFocusedQuestionIndex(qIndex + 1);
  };

  const handleOtherTextChange = (questionId: string, text: string) => {
    setOtherText((prev) => ({ ...prev, [questionId]: text }));

    const q = questions.find((item) => item.id === questionId);
    if (!q) {
      return;
    }
    const otherOption = q.options.find((o) => o.isOther);
    if (!otherOption) {
      return;
    }

    const hasText = text.trim().length > 0;

    if (q.multiSelect) {
      setAnswers((prev) => {
        const current = (prev[questionId] as string[]) || [];
        if (hasText) {
          if (current.includes(otherOption.id)) {
            return prev;
          }
          return { ...prev, [questionId]: [...current, otherOption.id] };
        }
        if (!current.includes(otherOption.id)) {
          return prev;
        }
        return {
          ...prev,
          [questionId]: current.filter((id) => id !== otherOption.id),
        };
      });
      return;
    }

    setAnswers((prev) => {
      if (hasText) {
        return { ...prev, [questionId]: otherOption.id };
      }
      if (prev[questionId] !== otherOption.id) {
        return prev;
      }
      const next = { ...prev };
      delete next[questionId];
      return next;
    });
  };

  const handleContinue = () => {
    onSubmit?.(answers);
  };

  const handleKeyDown = (e: KeyboardEvent) => {
    if (!open) {
      return;
    }
    if (e.key === "Enter") {
      e.preventDefault();
      handleContinue();
    } else if (e.key === "Escape") {
      e.preventDefault();
      onSkip?.();
    }
  };

  const getOptionLetter = (index: number) => String.fromCharCode(65 + index);

  const isSelected = (
    questionId: string,
    optionId: string,
    isMulti?: boolean
  ) => {
    if (isMulti) {
      return ((answers[questionId] as string[]) || []).includes(optionId);
    }
    return answers[questionId] === optionId;
  };

  return (
    <Collapsible
      className={cn(
        "group w-full max-w-[560px] rounded-xl bg-card shadow-sm ring-1 ring-border"
      )}
      onOpenChange={setOpen}
      open={open}
    >
      <fieldset
        className="m-0 min-w-0 rounded-xl border-0 p-0 outline-none"
        onKeyDown={handleKeyDown}
        tabIndex={open ? 0 : -1}
      >
        <legend className="sr-only">
          Questions — use Enter to continue, Escape to skip
        </legend>
        {/* Header */}
        <div className="flex items-center justify-between border-border border-b px-5 py-3.5">
          <div className="flex min-w-0 flex-1 items-center gap-1">
            <CollapsibleTrigger
              aria-label={open ? "Collapse questions" : "Expand questions"}
              className={cn(
                "inline-flex size-10 shrink-0 items-center justify-center rounded-md text-muted-foreground",
                "transition-[transform,colors] duration-150 ease-[cubic-bezier(0.2,0,0,1)] hover:bg-muted",
                "active:scale-[0.96] motion-reduce:active:scale-100"
              )}
              title={open ? "Collapse questions" : "Expand questions"}
            >
              <ChevronDown
                aria-hidden
                className="h-4 w-4 transition-transform duration-200 ease-[cubic-bezier(0.2,0,0,1)] group-data-[state=open]:rotate-180"
              />
            </CollapsibleTrigger>
            <div className="flex min-w-0 items-center gap-2.5">
              <MessageCircleQuestion
                className="h-5 w-5 shrink-0 text-muted-foreground"
                strokeWidth={1.5}
              />
              <span className="font-medium text-[15px] text-foreground tracking-[-0.01em]">
                Questions
              </span>
            </div>
          </div>
          <div className="flex shrink-0 items-center gap-1">
            <button
              aria-label="Previous question"
              className={cn(
                "inline-flex size-10 items-center justify-center rounded-md text-muted-foreground",
                "transition-colors hover:bg-muted disabled:cursor-not-allowed disabled:opacity-30"
              )}
              disabled={focusedQuestionIndex === 0 || questions.length === 0}
              onClick={() => goToQuestion(focusedQuestionIndex - 1)}
              type="button"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <span className="min-w-[48px] text-center text-[13px] text-muted-foreground tabular-nums">
              {focusedQuestionIndex + 1} of {questions.length}
            </span>
            <button
              aria-label="Next question"
              className={cn(
                "inline-flex size-10 items-center justify-center rounded-md text-muted-foreground",
                "transition-colors hover:bg-muted disabled:cursor-not-allowed disabled:opacity-30"
              )}
              disabled={
                questions.length === 0 ||
                focusedQuestionIndex >= questions.length - 1
              }
              onClick={() => goToQuestion(focusedQuestionIndex + 1)}
              type="button"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>

        <CollapsibleContent
          className={cn(
            "data-[state=closed]:fade-out-0 data-[state=closed]:slide-out-to-top-2 data-[state=open]:slide-in-from-top-2 outline-none data-[state=closed]:animate-out data-[state=open]:animate-in",
            "motion-reduce:data-[state=closed]:animate-none motion-reduce:data-[state=open]:animate-none"
          )}
        >
          {/* Questions Content */}
          <div
            className="max-h-[260px] space-y-5 overflow-y-auto overscroll-y-contain px-5 py-4"
            ref={scrollContainerRef}
          >
            {questions.map((question, globalIndex) => (
              <div
                className="scroll-mt-4 space-y-2.5"
                key={question.id}
                ref={(el) => {
                  questionRefs.current[globalIndex] = el;
                }}
              >
                <h3 className="text-balance font-semibold text-[15px] text-foreground leading-snug">
                  <span className="mr-1.5 text-muted-foreground">
                    {globalIndex + 1}.
                  </span>
                  {question.question}
                </h3>
                <div className="space-y-1.5">
                  {question.options.map((option, oIndex) => {
                    const selected = isSelected(
                      question.id,
                      option.id,
                      question.multiSelect
                    );
                    const letter = getOptionLetter(oIndex);

                    const rowClass = cn(
                      "flex w-full cursor-pointer items-start gap-2.5 rounded-lg px-3 py-2.5 text-left transition-colors duration-150",
                      selected
                        ? "bg-amber-500/15 dark:bg-amber-400/20"
                        : "hover:bg-muted"
                    );

                    const letterBadge = (
                      <span
                        className={cn(
                          "flex h-[22px] w-[22px] shrink-0 items-center justify-center rounded font-medium text-[12px] transition-colors",
                          selected
                            ? "bg-amber-500 text-white"
                            : "bg-muted text-muted-foreground"
                        )}
                      >
                        {letter}
                      </span>
                    );

                    if (option.isOther) {
                      return (
                        <div
                          className={rowClass}
                          key={option.id}
                          onClick={() =>
                            handleSelect(
                              question.id,
                              option.id,
                              question.multiSelect
                            )
                          }
                        >
                          {letterBadge}
                          <input
                            className={cn(
                              "flex-1 bg-transparent text-[14px] leading-relaxed placeholder:text-muted-foreground focus:outline-none",
                              selected
                                ? "text-amber-950 dark:text-amber-50"
                                : "text-foreground"
                            )}
                            onChange={(e) =>
                              handleOtherTextChange(question.id, e.target.value)
                            }
                            onClick={(e) => {
                              e.stopPropagation();
                              handleSelect(
                                question.id,
                                option.id,
                                question.multiSelect
                              );
                            }}
                            placeholder="Other..."
                            type="text"
                            value={otherText[question.id] || ""}
                          />
                        </div>
                      );
                    }

                    return (
                      <button
                        className={rowClass}
                        key={option.id}
                        onClick={() =>
                          handleSelect(
                            question.id,
                            option.id,
                            question.multiSelect
                          )
                        }
                        type="button"
                      >
                        {letterBadge}
                        <span
                          className={cn(
                            "text-[14px] leading-relaxed",
                            selected
                              ? "text-amber-950 dark:text-amber-50"
                              : "text-foreground"
                          )}
                        >
                          {option.label}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>

          {/* Footer */}
          <div className="flex items-center justify-end gap-3 border-border border-t px-5 py-3">
            <button
              className="flex items-center gap-1.5 text-[13px] text-muted-foreground transition-colors hover:text-foreground"
              onClick={onSkip}
              type="button"
            >
              Skip
              <kbd className="rounded bg-muted px-1.5 py-0.5 font-medium text-[11px] text-muted-foreground">
                Esc
              </kbd>
            </button>
            <button
              className={cn(
                "flex items-center gap-1.5 rounded-lg bg-primary px-4 py-2 font-medium text-[13px] text-primary-foreground",
                "transition-[transform,opacity] duration-150 ease-[cubic-bezier(0.2,0,0,1)] hover:opacity-90",
                "active:scale-[0.96] motion-reduce:active:scale-100"
              )}
              onClick={handleContinue}
              type="button"
            >
              Continue
              <span className="text-[13px] opacity-70">⏎</span>
            </button>
          </div>
        </CollapsibleContent>
      </fieldset>
    </Collapsible>
  );
}

export { QuestionsDialog as CursorQuestionsPanel };
