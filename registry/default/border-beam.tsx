"use client";

import * as React from "react";
import { cn } from "@/registry/default/lib/utils";

export type BorderBeamSize = "sm" | "md" | "line";
export type BorderBeamTheme = "dark" | "light" | "auto";
export type BorderBeamColorVariant = "colorful" | "mono" | "ocean" | "sunset";

export interface BorderBeamProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, "children"> {
  children: React.ReactNode;
  size?: BorderBeamSize;
  colorVariant?: BorderBeamColorVariant;
  theme?: BorderBeamTheme;
  staticColors?: boolean;
  duration?: number;
  active?: boolean;
  borderRadius?: number;
  brightness?: number;
  saturation?: number;
  hueRange?: number;
  strength?: number;
  onActivate?: () => void;
  onDeactivate?: () => void;
}

const SIZE_DEFAULTS: Record<
  BorderBeamSize,
  { borderRadius: number; borderWidth: number; duration: number; beamLength: number }
> = {
  sm: { borderRadius: 18, borderWidth: 1, duration: 1.96, beamLength: 30 },
  md: { borderRadius: 16, borderWidth: 1, duration: 1.96, beamLength: 60 },
  line: { borderRadius: 16, borderWidth: 1, duration: 2.4, beamLength: 80 },
};

const COLOR_VARIANTS: Record<BorderBeamColorVariant, string[]> = {
  colorful: [
    "rgb(255, 50, 100)",
    "rgb(40, 140, 255)",
    "rgb(50, 200, 80)",
    "rgb(100, 70, 255)",
    "rgb(255, 120, 40)",
    "rgb(240, 50, 180)",
    "rgb(180, 40, 240)",
  ],
  mono: [
    "rgb(255, 255, 255)",
    "rgb(220, 220, 220)",
    "rgb(180, 180, 180)",
  ],
  ocean: [
    "rgb(40, 140, 255)",
    "rgb(30, 185, 170)",
    "rgb(100, 70, 255)",
    "rgb(50, 80, 220)",
  ],
  sunset: [
    "rgb(255, 120, 40)",
    "rgb(255, 50, 100)",
    "rgb(240, 200, 60)",
    "rgb(255, 80, 60)",
  ],
};

function gradientFor(
  variant: BorderBeamColorVariant,
  beamLength: number,
  brightness: number,
  saturation: number
): string {
  const colors = COLOR_VARIANTS[variant];
  const stops = colors
    .map((c, i) => `${c} ${(i / (colors.length - 1)) * beamLength}%`)
    .join(", ");
  return `conic-gradient(from 0deg, transparent 0%, ${stops}, transparent ${beamLength}%) ` +
    ``; // brightness/saturation applied via filter elsewhere
}

export const BorderBeam = React.forwardRef<HTMLDivElement, BorderBeamProps>(
  (
    {
      children,
      size = "md",
      colorVariant = "colorful",
      theme = "dark",
      staticColors = false,
      duration,
      active = true,
      borderRadius,
      brightness = 1.3,
      saturation,
      hueRange = 30,
      strength = 1,
      className,
      style,
      onActivate,
      onDeactivate,
      ...props
    },
    ref
  ) => {
    const sizeCfg = SIZE_DEFAULTS[size];
    const effectiveDuration = duration ?? sizeCfg.duration;
    const effectiveRadius = borderRadius ?? sizeCfg.borderRadius;
    const themeColors = theme === "light"
      ? { strokeOpacity: 0.33, innerOpacity: 0.46, bloomOpacity: 0.54 }
      : { strokeOpacity: 0.48, innerOpacity: 0.7, bloomOpacity: 0.8 };
    const effectiveSat = saturation ?? (theme === "light" ? 0.96 : 1.2);

    const beamGradient = React.useMemo(
      () => gradientFor(colorVariant, sizeCfg.beamLength, brightness, effectiveSat),
      [colorVariant, sizeCfg.beamLength, brightness, effectiveSat]
    );

    const animationName = React.useId().replace(/:/g, "");
    const hueAnimName = `${animationName}-hue`;
    const rotateAnimName = `${animationName}-rotate`;

    React.useEffect(() => {
      if (active) onActivate?.();
      else onDeactivate?.();
    }, [active, onActivate, onDeactivate]);

    return (
      <div
        ref={ref}
        className={cn("relative isolate inline-flex", className)}
        style={{
          borderRadius: effectiveRadius,
          ...style,
        }}
        data-border-beam-active={active ? "true" : "false"}
        data-border-beam-variant={colorVariant}
        data-border-beam-size={size}
        {...props}
      >
        {/* beam layer */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 overflow-hidden"
          style={{
            borderRadius: effectiveRadius,
            opacity: active ? strength * themeColors.bloomOpacity : 0,
            transition: "opacity 0.35s ease",
          }}
        >
          {/* rotating gradient ring */}
          <div
            className="absolute"
            style={{
              inset: -Math.round(sizeCfg.beamLength),
              backgroundImage: beamGradient,
              filter: `saturate(${effectiveSat}) brightness(${brightness})`,
              animation: active && !staticColors
                ? `${rotateAnimName} ${effectiveDuration}s linear infinite, ${hueAnimName} 12s linear infinite`
                : active
                ? `${rotateAnimName} ${effectiveDuration}s linear infinite`
                : "none",
              willChange: "transform, filter",
            }}
          />
          {/* mask to leave only the border ring */}
          <div
            className="absolute inset-0"
            style={{
              borderRadius: effectiveRadius,
              padding: sizeCfg.borderWidth,
              background: "transparent",
              boxShadow: `inset 0 0 0 ${sizeCfg.borderWidth}px transparent`,
              WebkitMask:
                "linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0)",
              WebkitMaskComposite: "xor",
              maskComposite: "exclude",
              backdropFilter: "none",
              backgroundColor:
                theme === "light" ? "rgba(255,255,255,0.0)" : "rgba(0,0,0,0)",
            }}
          />
          {/* inner bloom (sized down) */}
          <div
            className="absolute"
            style={{
              inset: 0,
              borderRadius: effectiveRadius,
              boxShadow: `inset 0 0 0 ${sizeCfg.borderWidth}px rgba(255,255,255,${themeColors.strokeOpacity * strength})`,
            }}
          />
        </div>

        {/* content */}
        <div className="relative z-10 w-full" style={{ borderRadius: effectiveRadius }}>
          {children}
        </div>

        <style>{`
          @keyframes ${rotateAnimName} {
            from { transform: rotate(0deg); }
            to   { transform: rotate(360deg); }
          }
          @keyframes ${hueAnimName} {
            from { filter: saturate(${effectiveSat}) brightness(${brightness}) hue-rotate(-${hueRange}deg); }
            50%  { filter: saturate(${effectiveSat}) brightness(${brightness}) hue-rotate(${hueRange}deg); }
            to   { filter: saturate(${effectiveSat}) brightness(${brightness}) hue-rotate(-${hueRange}deg); }
          }
        `}</style>
      </div>
    );
  }
);

BorderBeam.displayName = "BorderBeam";
