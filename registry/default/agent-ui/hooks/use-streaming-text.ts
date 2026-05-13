import { useState, useEffect, useCallback, useRef, useMemo } from "react";

export function useStreamingText(
  fullText: string,
  options: {
    delayBefore?: number;
    wordInterval?: number;
    autoStart?: boolean;
    onComplete?: () => void;
    onUpdate?: () => void;
  } = {},
) {
  const {
    delayBefore = 300,
    wordInterval = 25,
    autoStart = true,
    onComplete,
    onUpdate,
  } = options;
  const [state, setState] = useState<"idle" | "streaming" | "complete">("idle");
  const [visibleCount, setVisibleCount] = useState(0);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const onCompleteRef = useRef(onComplete);
  const onUpdateRef = useRef(onUpdate);
  onCompleteRef.current = onComplete;
  onUpdateRef.current = onUpdate;

  const tokens = useMemo(() => fullText.split(/(\s+)/), [fullText]);

  const cleanup = useCallback(() => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
  }, []);

  const startStreaming = useCallback(() => {
    cleanup();
    setVisibleCount(0);
    setState("idle");
    timeoutRef.current = setTimeout(() => {
      setState("streaming");
      let count = 0;
      let updateThrottle = 0;
      intervalRef.current = setInterval(() => {
        count++;
        setVisibleCount(count);
        updateThrottle++;
        if (updateThrottle % 3 === 0) onUpdateRef.current?.();
        if (count >= tokens.length) {
          if (intervalRef.current) clearInterval(intervalRef.current);
          setState("complete");
          onCompleteRef.current?.();
        }
      }, wordInterval);
    }, delayBefore);
  }, [tokens, delayBefore, wordInterval, cleanup]);

  useEffect(() => {
    if (autoStart) startStreaming();
    return cleanup;
  }, [autoStart, startStreaming, cleanup]);

  return {
    displayedText: tokens.slice(0, visibleCount).join(""),
    tokens,
    visibleCount,
    state,
    isStreaming: state === "streaming",
  };
}
