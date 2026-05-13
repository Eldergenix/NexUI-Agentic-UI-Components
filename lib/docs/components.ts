export interface ComponentEntry {
  slug: string;
  name: string;
  description: string;
  isNew?: boolean;
  gridSize?: "large" | "medium" | "small";
  group?:
    | "fluid"
    | "agent"
    | "effect"
    | "ai-block"
    | "form"
    | "calendar"
    | "avatar"
    | "table"
    | "input-block"
    | "frame"
    | "surface-block"
    | "layout";
}

export interface SystemEntry {
  slug: string;
  name: string;
  description: string;
  isNew?: boolean;
}

export const systemList: SystemEntry[] = [
  { slug: "surfaces", name: "Surfaces", description: "Eight-level surface and shadow ladder for elevation in light and dark mode.", isNew: true },
];

export const componentList: ComponentEntry[] = [
  // ─── Fluid Functionalism ───────────────────────────────────────────────────
  { slug: "accordion", name: "Accordion", description: "Collapsible sections with animated expand/collapse and proximity hover in grouped mode.", gridSize: "large", group: "fluid" },
  { slug: "badge", name: "Badge", description: "Compact label with solid and dot variants, Tailwind color palette, and three sizes.", gridSize: "small", group: "fluid" },
  { slug: "button", name: "Button", description: "Versatile button with variants, sizes, loading state, and icon support.", gridSize: "small", group: "fluid" },
  { slug: "checkbox-group", name: "CheckboxGroup", description: "Checkbox group with merged backgrounds for contiguous selections.", gridSize: "small", group: "fluid" },
  { slug: "color-picker", name: "ColorPicker", description: "Color picker with HEX/RGB/HSL/OKLCH formats, alpha, swatches, and popover trigger.", isNew: true, gridSize: "medium", group: "fluid" },
  { slug: "dialog", name: "Dialog", description: "Modal dialog with smooth enter/exit animations and overlay.", gridSize: "small", group: "fluid" },
  { slug: "dropdown", name: "Dropdown", description: "Menu-style dropdown with proximity hover and animated backgrounds.", gridSize: "medium", group: "fluid" },
  { slug: "input-copy", name: "InputCopy", description: "Read-only input with copy-to-clipboard button and animated feedback.", isNew: true, gridSize: "small", group: "fluid" },
  { slug: "input-group", name: "InputGroup", description: "Input field group with proximity hover and validation.", gridSize: "small", group: "fluid" },
  { slug: "radio-group", name: "RadioGroup", description: "Radio button group with proximity hover and animated selection.", gridSize: "small", group: "fluid" },
  { slug: "select", name: "Select", description: "Animated select menu with bordered/borderless variants and optional icons.", gridSize: "medium", group: "fluid" },
  { slug: "slider", name: "Slider", description: "Range slider with step snapping, range mode, and animated thumb.", gridSize: "medium", group: "fluid" },
  { slug: "switch", name: "Switch", description: "Toggle switch with animated thumb and label.", gridSize: "small", group: "fluid" },
  { slug: "table", name: "Table", description: "Data table with row hover effects and semantic markup.", gridSize: "large", group: "fluid" },
  { slug: "tabs", name: "Tabs", description: "Segmented control with sliding indicator and proximity hover.", isNew: true, gridSize: "medium", group: "fluid" },
  { slug: "tabs-subtle", name: "TabsSubtle", description: "Tab navigation with smooth pill animations.", gridSize: "medium", group: "fluid" },
  { slug: "thinking-indicator", name: "ThinkingIndicator", description: "Animated status indicator with morphing SVG and cycling text.", gridSize: "small", group: "fluid" },
  { slug: "thinking-steps", name: "ThinkingSteps", description: "Chain-of-thought display with sequential animation and collapsible steps.", isNew: true, gridSize: "large", group: "fluid" },
  { slug: "tooltip", name: "Tooltip", description: "Floating tooltip with spring-based animations and configurable placement.", gridSize: "small", group: "fluid" },

  // ─── Agent Elements ────────────────────────────────────────────────────────
  { slug: "agent-chat", name: "AgentChat", description: "Drop-in agent chat shell combining MessageList + InputBar. Wire to Vercel AI SDK useChat().", isNew: true, gridSize: "large", group: "agent" },
  { slug: "agent-message-list", name: "MessageList", description: "Renders Vercel AI SDK UIMessage[] with streaming, tool calls, and copy actions.", isNew: true, gridSize: "large", group: "agent" },
  { slug: "agent-input-bar", name: "InputBar", description: "Composable input with suggestions, attachments, model and mode pickers.", isNew: true, gridSize: "medium", group: "agent" },
  { slug: "agent-user-message", name: "UserMessage", description: "User-side chat bubble with custom theme tokens.", isNew: true, gridSize: "small", group: "agent" },
  { slug: "agent-error-message", name: "ErrorMessage", description: "Error state for failed tool calls or model responses.", isNew: true, gridSize: "small", group: "agent" },
  { slug: "agent-markdown", name: "Markdown", description: "Streaming markdown via Streamdown + Shiki syntax highlighting.", isNew: true, gridSize: "medium", group: "agent" },
  { slug: "agent-text-shimmer", name: "TextShimmer", description: "Animated text shimmer/skeleton for streaming token loaders.", isNew: true, gridSize: "small", group: "agent" },
  { slug: "agent-spiral-loader", name: "SpiralLoader", description: "Lottie-driven spiral spinner for agent-thinking states.", isNew: true, gridSize: "small", group: "agent" },
  { slug: "agent-bash-tool", name: "BashTool", description: "Live terminal output renderer with ANSI color support.", isNew: true, gridSize: "medium", group: "agent" },
  { slug: "agent-edit-tool", name: "EditTool", description: "File diff viewer with approval footer.", isNew: true, gridSize: "medium", group: "agent" },
  { slug: "agent-search-tool", name: "SearchTool", description: "Web search results grid for agent search calls.", isNew: true, gridSize: "medium", group: "agent" },
  { slug: "agent-todo-tool", name: "TodoTool", description: "Checklist with animated state transitions for todo tools.", isNew: true, gridSize: "small", group: "agent" },
  { slug: "agent-plan-tool", name: "PlanTool", description: "Task/step breakdown UI for agent planning.", isNew: true, gridSize: "medium", group: "agent" },
  { slug: "agent-subagent-tool", name: "SubagentTool", description: "Nested agent invocation card.", isNew: true, gridSize: "small", group: "agent" },
  { slug: "agent-mcp-tool", name: "McpTool", description: "Model Context Protocol tool renderer.", isNew: true, gridSize: "small", group: "agent" },
  { slug: "agent-thinking-tool", name: "ThinkingTool", description: "Collapsible reasoning panel for chain-of-thought tokens.", isNew: true, gridSize: "small", group: "agent" },
  { slug: "agent-generic-tool", name: "GenericTool", description: "Fallback renderer for unknown tool types.", isNew: true, gridSize: "small", group: "agent" },
  { slug: "agent-tool-group", name: "ToolGroup", description: "Groups multiple tool calls into a single collapsible card.", isNew: true, gridSize: "small", group: "agent" },
  { slug: "agent-question-tool", name: "QuestionTool", description: "Clarifying questions UI (single/multi/free-text).", isNew: true, gridSize: "medium", group: "agent" },

  // ─── Effects ───────────────────────────────────────────────────────────────
  { slug: "border-beam", name: "BorderBeam", description: "Animated traveling glow border (web port of the React Native original). Sizes, color variants, theme.", isNew: true, gridSize: "medium", group: "effect" },

  // ─── AI SDK Pro Blocks (via aisdkagents.com) ───────────────────────────────
  { slug: "claude-input", name: "ClaudeInput", description: "Claude-style landing composer: rounded prompt surface, model menu with extended thinking, attachment trigger, voice control, and category chips.", isNew: true, gridSize: "large", group: "ai-block" },
  { slug: "claude-email-tool", name: "ClaudeEmailTool", description: "Animated email draft tool card with subject, recipient chips, body preview, and approval actions.", isNew: true, gridSize: "medium", group: "ai-block" },
  { slug: "claude-recommend-apps-tool", name: "ClaudeRecommendAppsTool", description: "Recommendation grid for Claude apps with categorized presets.", isNew: true, gridSize: "medium", group: "ai-block" },
  { slug: "claude-recipe-tool", name: "ClaudeRecipeTool", description: "Recipe card tool with unit conversion (us/metric), ingredient list, and step-by-step instructions.", isNew: true, gridSize: "medium", group: "ai-block" },
  { slug: "claude-map-itinerary-tool", name: "ClaudeMapItineraryTool", description: "Multi-day itinerary tool with Leaflet map, stop markers, and travel modes.", isNew: true, gridSize: "large", group: "ai-block" },
  { slug: "cursor-questions-panel", name: "CursorQuestionsPanel", description: "Cursor-style clarifying questions dialog with progress and multi-step Q&A.", isNew: true, gridSize: "medium", group: "ai-block" },
  { slug: "openai-chat-image", name: "OpenAIChatImage", description: "OpenAI-style chat image preview with attachments and idea suggestions.", isNew: true, gridSize: "medium", group: "ai-block" },

  // ─── Form ──────────────────────────────────────────────────────────────────
  { slug: "theme-card-radio", name: "ThemeCardRadio", description: "Visual theme selector with image card previews (System / Light / Dark). Adapted from coss.com p-radio-group-6.", isNew: true, gridSize: "medium", group: "form" },

  // ─── Calendar ──────────────────────────────────────────────────────────────
  { slug: "calendar", name: "Calendar", description: "react-day-picker v10 wrapped with nexUI tokens. Themed for light/dark.", isNew: true, gridSize: "medium", group: "calendar" },
  { slug: "calendar-pricing", name: "CalendarPricing", description: "Two-month pricing calendar with custom day buttons and good-price highlighting. Adapted from coss.com p-calendar-24.", isNew: true, gridSize: "large", group: "calendar" },
  { slug: "calendar-with-date-input", name: "CalendarWithDateInput", description: "Calendar + linked ISO date text input. Adapted from coss.com p-calendar-17.", isNew: true, gridSize: "medium", group: "calendar" },
  { slug: "calendar-with-time", name: "CalendarWithTime", description: "Calendar + time input. Adapted from coss.com p-calendar-18.", isNew: true, gridSize: "medium", group: "calendar" },
  { slug: "date-picker-presets", name: "DatePickerPresets", description: "Popover date picker with quick presets (Today / Tomorrow / In 3 days / In a week). Adapted from coss.com p-date-picker-4.", isNew: true, gridSize: "medium", group: "calendar" },

  // ─── Avatar ────────────────────────────────────────────────────────────────
  { slug: "avatar", name: "Avatar", description: "Radix-based image + fallback avatar with theme-aware tokens.", isNew: true, gridSize: "small", group: "avatar" },
  { slug: "avatar-generators", name: "AvatarGenerators", description: "DiceBear (7 styles) + MetaMask Jazzicon + spell.sh fallback. Deterministic, seed-based avatars.", isNew: true, gridSize: "medium", group: "avatar" },
  { slug: "avatar-group", name: "AvatarGroup", description: "Overlapping avatar stack with ring separator and +N overflow pill. Adapted from coss.com p-avatar-13.", isNew: true, gridSize: "small", group: "avatar" },
  { slug: "avatar-button", name: "AvatarButton", description: "Pill button with leading avatar. Adapted from coss.com p-button-28.", isNew: true, gridSize: "small", group: "avatar" },
  { slug: "avatar-select", name: "AvatarSelect", description: "Single-select dropdown showing avatar+name rows. Adapted from coss.com p-select-19.", isNew: true, gridSize: "medium", group: "avatar" },
  { slug: "member-filter", name: "MemberFilter", description: "Segmented filter pill with searchable multi-select member combobox. Adapted from coss.com p-group-23.", isNew: true, gridSize: "medium", group: "avatar" },

  // ─── Tables (coss.com p-table-*) ───────────────────────────────────────────
  { slug: "p-table-2", name: "PTable2", description: "Compact data table with row hover, status badges, and frame wrapper.", isNew: true, gridSize: "large", group: "table" },
  { slug: "p-table-3", name: "PTable3", description: "Selectable table with checkboxes, sorting, pagination, and frame wrapper.", isNew: true, gridSize: "large", group: "table" },
  { slug: "p-table-4", name: "PTable4", description: "Table variant with extended column controls.", isNew: true, gridSize: "large", group: "table" },
  { slug: "p-table-6", name: "PTable6", description: "Table with grouped headers and filter affordances.", isNew: true, gridSize: "large", group: "table" },
  { slug: "p-table-8", name: "PTable8", description: "Advanced table with multi-state row actions.", isNew: true, gridSize: "large", group: "table" },

  // ─── Input blocks (coss.com p-input-*, p-autocomplete-*) ───────────────────
  { slug: "p-input-11", name: "PInput11", description: "Input with keyboard shortcut hint (Kbd) suffix.", isNew: true, gridSize: "small", group: "input-block" },
  { slug: "p-input-group-20", name: "PInputGroup20", description: "Input group with search icon prefix.", isNew: true, gridSize: "small", group: "input-block" },
  { slug: "p-input-group-23", name: "PInputGroup23", description: "Search input group with loader and microphone affordance.", isNew: true, gridSize: "medium", group: "input-block" },
  { slug: "p-autocomplete-12", name: "PAutocomplete12", description: "Async-loading autocomplete combobox with Spinner.", isNew: true, gridSize: "medium", group: "input-block" },

  // ─── Frames (coss.com p-frame-*) ───────────────────────────────────────────
  { slug: "p-frame-1", name: "PFrame1", description: "Basic Frame primitive with rounded surface and shadow.", isNew: true, gridSize: "small", group: "frame" },
  { slug: "p-frame-2", name: "PFrame2", description: "Frame with header (FrameHeader) and content panel (FramePanel).", isNew: true, gridSize: "medium", group: "frame" },
  { slug: "p-frame-3", name: "PFrame3", description: "Frame with split panels.", isNew: true, gridSize: "medium", group: "frame" },
  { slug: "p-frame-4", name: "PFrame4", description: "Frame with separator and stacked sections.", isNew: true, gridSize: "medium", group: "frame" },

  // ─── Surface blocks (cards, sheets, command palette) ───────────────────────
  { slug: "p-card-11", name: "PCard11", description: "Empty-state card with folder icon, title, description, and primary action.", isNew: true, gridSize: "medium", group: "surface-block" },
  { slug: "p-sheet-2", name: "PSheet2", description: "Form-driven side sheet (Field + Form + Input) with submit and cancel.", isNew: true, gridSize: "medium", group: "surface-block" },
  { slug: "p-command-1", name: "PCommand1", description: "Command palette with grouped suggestions/commands and keyboard shortcut hints.", isNew: true, gridSize: "large", group: "surface-block" },
  { slug: "p-command-2", name: "PCommand2", description: "Command palette with autocomplete filter, empty-state, and external commandHandle export.", isNew: true, gridSize: "large", group: "surface-block" },

  // ─── Layouts ───────────────────────────────────────────────────────────────
  { slug: "linear-shell", name: "LinearShell", description: "Linear.app-inspired application shell: 244px scrollable sidebar with grouped sections, 32px top action bar, framed content card, floating help button. Compound API, light + dark adaptive via nexUI tokens.", isNew: true, gridSize: "large", group: "layout" },
  { slug: "linear-agent-shell", name: "LinearAgentShell", description: "Example block: LinearShell + GlassAvatar + ThinkingSteps + ThinkingIndicator + Markdown + ClaudeInput. A complete user↔agent conversation surface ready to drop into a Next.js page.", isNew: true, gridSize: "large", group: "layout" },
];
