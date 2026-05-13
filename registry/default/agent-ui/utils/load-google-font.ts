const SYSTEM_FONTS = new Set([
  "ui-sans-serif",
  "system-ui",
  "-apple-system",
  "BlinkMacSystemFont",
  "Segoe UI",
  "Roboto",
  "Helvetica Neue",
  "Arial",
  "Noto Sans",
  "ui-serif",
  "Georgia",
  "Cambria",
  "Times New Roman",
  "Times",
  "ui-monospace",
  "SFMono-Regular",
  "Menlo",
  "Monaco",
  "Consolas",
  "Liberation Mono",
  "Courier New",
  "serif",
  "sans-serif",
  "monospace",
]);

export function loadGoogleFont(fontFamily: string) {
  if (!fontFamily) return;
  const name = fontFamily.split(",")[0]!.trim().replace(/['"]/g, "");
  if (!name || SYSTEM_FONTS.has(name)) return;

  const encoded = encodeURIComponent(name);
  if (document.querySelector(`link[href*="${encoded}"]`)) return;

  const link = document.createElement("link");
  link.href = `https://fonts.googleapis.com/css2?family=${encoded}:wght@400;500;600;700&display=swap`;
  link.rel = "stylesheet";
  link.type = "text/css";
  document.head.appendChild(link);
}
