/**
 * Post-build script for the shadcn registry.
 *
 * `shadcn build` outputs plain names in registryDependencies (e.g. "font-weight").
 * When consumed via a direct URL, the shadcn CLI resolves plain names against
 * the default shadcn registry (ui.shadcn.com), which fails for our custom items.
 *
 * This script rewrites plain names → full URLs so dependencies resolve correctly.
 */

import { readdir, readFile, writeFile } from "node:fs/promises";
import { join } from "node:path";

const REGISTRY_DIR = new URL("../public/r", import.meta.url).pathname;
// Served from GitHub via jsDelivr CDN — proper Content-Type + global caching,
// no separate deployment required. Override with NEXUI_REGISTRY_URL for a
// custom domain.
const BASE_URL =
  process.env.NEXUI_REGISTRY_URL ??
  "https://cdn.jsdelivr.net/gh/Eldergenix/NexUI-Agentic-UI-Components@main/public/r";

// Registry items that are custom (not available on the default shadcn registry).
// "utils" is intentionally omitted — shadcn's built-in utils provides the same cn().
const CUSTOM_ITEMS = new Set([
  "font-weight",
  "shape-context",
  "surface-context",
  "surface-classes",
  "icon-context",
  "icon-map",
  "springs",
  "use-proximity-hover",
  "button",
  "checkbox-group",
  "dialog",
  "dropdown",
  "input-group",
  "menu-item",
  "radio-group",
  "select",
  "slider",
  "tabs-subtle",
  "switch",
  "table",
  "tabs",
  "thinking-indicator",
  "thinking-steps",
  "tooltip",
  "accordion",
  "badge",
  "input-copy",
  "color-picker",
  // ─── Border Beam ───────────────────────────────────────
  "border-beam",
  // ─── Agent Elements ────────────────────────────────────
  "agent-chat",
  "agent-message-list",
  "agent-input-bar",
  "agent-user-message",
  "agent-error-message",
  "agent-markdown",
  "agent-text-shimmer",
  "agent-spiral-loader",
  "agent-bash-tool",
  "agent-edit-tool",
  "agent-search-tool",
  "agent-todo-tool",
  "agent-plan-tool",
  "agent-subagent-tool",
  "agent-mcp-tool",
  "agent-thinking-tool",
  "agent-generic-tool",
  "agent-tool-group",
  "agent-question-tool",
  // ─── AI SDK Pro Blocks ─────────────────────────────────
  "claude-input",
  "claude-email-tool",
  "claude-recommend-apps-tool",
  "claude-recipe-tool",
  "claude-map-itinerary-tool",
  "cursor-questions-panel",
  "openai-chat-image",
  // ─── Form / Calendar / Avatar (coss-derived) ────────────
  "theme-card-radio",
  "calendar",
  "calendar-pricing",
  "calendar-with-date-input",
  "calendar-with-time",
  "date-picker-presets",
  "popover",
  "avatar",
  "avatar-generators",
  "avatar-group",
  "avatar-button",
  "avatar-select",
  "member-filter",
  // ─── coss.com p-* blocks ───────────────────────────────
  "p-card-11",
  "p-table-2",
  "p-table-3",
  "p-table-4",
  "p-table-6",
  "p-table-8",
  "p-input-11",
  "p-input-group-20",
  "p-input-group-23",
  "p-autocomplete-12",
  "p-sheet-2",
  "p-command-1",
  "p-command-2",
  "p-frame-1",
  "p-frame-2",
  "p-frame-3",
  "p-frame-4",
  // ─── Layouts ───────────────────────────────────────────
  "linear-shell",
  "linear-agent-shell",
]);

async function run() {
  const files = await readdir(REGISTRY_DIR);

  for (const file of files.filter((f) => f.endsWith(".json"))) {
    const filePath = join(REGISTRY_DIR, file);
    const data = JSON.parse(await readFile(filePath, "utf-8"));

    let changed = false;

    // Rewrite registryDependencies in individual item files
    if (Array.isArray(data.registryDependencies)) {
      data.registryDependencies = data.registryDependencies.map((dep) => {
        if (CUSTOM_ITEMS.has(dep)) {
          changed = true;
          return `${BASE_URL}/${dep}.json`;
        }
        return dep;
      });
    }

    // Rewrite registryDependencies inside registry.json items array
    if (Array.isArray(data.items)) {
      for (const item of data.items) {
        if (Array.isArray(item.registryDependencies)) {
          item.registryDependencies = item.registryDependencies.map((dep) => {
            if (CUSTOM_ITEMS.has(dep)) {
              changed = true;
              return `${BASE_URL}/${dep}.json`;
            }
            return dep;
          });
        }
      }
    }

    if (changed) {
      await writeFile(filePath, JSON.stringify(data, null, 2) + "\n");
      console.log(`  ✓ ${file}`);
    }
  }
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
