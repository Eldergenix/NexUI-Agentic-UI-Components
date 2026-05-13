// WCAG relative luminance from sRGB hex
export function luminance(hex: string): number {
  const c = hex.replace("#", "");
  const r = parseInt(c.slice(0, 2), 16) / 255;
  const g = parseInt(c.slice(2, 4), 16) / 255;
  const b = parseInt(c.slice(4, 6), 16) / 255;
  const toLinear = (v: number) =>
    v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4;
  return 0.2126 * toLinear(r) + 0.7152 * toLinear(g) + 0.0722 * toLinear(b);
}

/** Try to normalize a CSS color string to a 6-digit hex. Returns null on failure. */
function toHex6(color: string): string | null {
  const trimmed = color.trim();

  // #RRGGBB
  if (/^#[0-9a-fA-F]{6}$/.test(trimmed)) return trimmed;

  // #RGB → #RRGGBB
  const short = trimmed.match(/^#([0-9a-fA-F])([0-9a-fA-F])([0-9a-fA-F])$/);
  if (short)
    return `#${short[1]}${short[1]}${short[2]}${short[2]}${short[3]}${short[3]}`;

  // #RRGGBBAA → strip alpha
  if (/^#[0-9a-fA-F]{8}$/.test(trimmed)) return trimmed.slice(0, 7);

  // rgb(r, g, b) or rgba(r, g, b, a)
  const rgb = trimmed.match(/^rgba?\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)/);
  if (rgb) {
    const hex = (n: string) => parseInt(n).toString(16).padStart(2, "0");
    return `#${hex(rgb[1])}${hex(rgb[2])}${hex(rgb[3])}`;
  }

  return null;
}

// Returns contrasting text color for a given background color
export function contrastText(bg: string): string {
  if (!bg) return "inherit";
  const hex = toHex6(bg);
  if (!hex) return "inherit";
  return luminance(hex) > 0.179 ? "#1a1a1a" : "#ffffff";
}
