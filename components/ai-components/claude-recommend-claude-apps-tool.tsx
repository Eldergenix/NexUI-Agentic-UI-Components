"use client";

import type { SVGProps } from "react";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

/**
 * API: `recommend_claude_apps` — App install / download cards
 *
 * ```json
 * {
 *   "app_ids": ["desktop", "ios", "claude_code_terminal"]
 * }
 * ```
 */
export type ClaudeRecommendAppId =
  | "desktop"
  | "ios"
  | "android"
  | "claude_code_terminal"
  | "claude_code_vscode"
  | "claude_code_jetbrains"
  | "claude_code_slack"
  | "excel"
  | "powerpoint"
  | "chrome";

type AppRowIcon =
  | "apple"
  | "android"
  | "terminal"
  | "vscode"
  | "jetbrains"
  | "slack"
  | "excel"
  | "powerpoint"
  | "chrome";

type AppRowDef = {
  id: ClaudeRecommendAppId;
  title: string;
  description: string;
  icon: AppRowIcon;
  action: "download" | "install";
  href: string;
  external?: boolean;
};

const APP_CATALOG: Record<ClaudeRecommendAppId, AppRowDef> = {
  desktop: {
    id: "desktop",
    title: "Claude Desktop for macOS",
    description:
      "Get access to Cowork so Claude can work in your folders and browser.",
    icon: "apple",
    action: "download",
    href: "https://claude.ai/download",
    external: true,
  },
  ios: {
    id: "ios",
    title: "Claude for iOS",
    description: "Chat hands-free and sync conversations across your devices.",
    icon: "apple",
    action: "download",
    href: "https://apps.apple.com/us/app/claude-by-anthropic/id6473753684",
    external: true,
  },
  android: {
    id: "android",
    title: "Claude for Android",
    description: "Take Claude with you and keep your chats in sync on the go.",
    icon: "android",
    action: "download",
    href: "https://play.google.com/store/apps/details?id=com.anthropic.claude",
    external: true,
  },
  claude_code_terminal: {
    id: "claude_code_terminal",
    title: "Claude Code",
    description: "Build, debug, and ship from your terminal.",
    icon: "terminal",
    action: "install",
    href: "https://docs.anthropic.com/en/docs/claude-code/overview",
    external: true,
  },
  claude_code_vscode: {
    id: "claude_code_vscode",
    title: "Claude Code for VS Code",
    description: "Use Claude Code inside Visual Studio Code.",
    icon: "vscode",
    action: "install",
    href: "https://marketplace.visualstudio.com/items?itemName=Anthropic.claude-code",
    external: true,
  },
  claude_code_jetbrains: {
    id: "claude_code_jetbrains",
    title: "Claude Code for JetBrains",
    description: "Bring Claude Code into your JetBrains IDE.",
    icon: "jetbrains",
    action: "install",
    href: "https://docs.anthropic.com/en/docs/claude-code/jetbrains",
    external: true,
  },
  claude_code_slack: {
    id: "claude_code_slack",
    title: "Claude Code for Slack",
    description: "Collaborate on code workflows from Slack.",
    icon: "slack",
    action: "install",
    href: "https://docs.anthropic.com/en/docs/claude-code/slack",
    external: true,
  },
  excel: {
    id: "excel",
    title: "Claude for Excel",
    description: "Analyze spreadsheets and automate tasks in Excel.",
    icon: "excel",
    action: "install",
    href: "https://www.anthropic.com/claude-for-excel",
    external: true,
  },
  powerpoint: {
    id: "powerpoint",
    title: "Claude for PowerPoint",
    description: "Draft and refine slides with Claude in PowerPoint.",
    icon: "powerpoint",
    action: "install",
    href: "https://www.anthropic.com/claude-for-powerpoint",
    external: true,
  },
  chrome: {
    id: "chrome",
    title: "Claude for Chrome",
    description: "Use Claude alongside your browsing workflow.",
    icon: "chrome",
    action: "install",
    href: "https://claude.ai/",
    external: true,
  },
};

function DownloadGlyph({ className }: { className?: string }) {
  return (
    <svg
      aria-hidden
      className={cn("size-4 shrink-0", className)}
      fill="currentColor"
      viewBox="0 0 20 20"
      xmlns="http://www.w3.org/2000/svg"
    >
      <title>Download icon</title>
      <path d="M16.5 13a.5.5 0 0 1 .5.5v2a1.5 1.5 0 0 1-1.5 1.5h-11A1.5 1.5 0 0 1 3 15.5v-2a.5.5 0 0 1 1 0v2a.5.5 0 0 0 .5.5h11a.5.5 0 0 0 .5-.5v-2a.5.5 0 0 1 .5-.5M10 3a.5.5 0 0 1 .5.5v8.686l3.126-3.518a.5.5 0 0 1 .748.664l-4 4.5-.08.071a.5.5 0 0 1-.668-.071l-4-4.5-.059-.082A.5.5 0 0 1 6.3 8.6l.075.068L9.5 12.186V3.5A.5.5 0 0 1 10 3" />
    </svg>
  );
}

function ExternalCornerGlyph({ className }: { className?: string }) {
  return (
    <svg
      aria-hidden
      className={cn("size-4 shrink-0", className)}
      fill="currentColor"
      viewBox="0 0 20 20"
      xmlns="http://www.w3.org/2000/svg"
    >
      <title>Opens in a new tab</title>
      <path d="M13.5 6a.5.5 0 0 1 .5.5v5a.5.5 0 0 1-1 0V7.707l-6.147 6.147a.5.5 0 0 1-.707-.707L12.293 7H8.5a.5.5 0 0 1 0-1z" />
    </svg>
  );
}

/** Brand marks inlined from SVGL (svgl.app). Gradient / mask ids are namespaced per icon. */
function RowBrandApple(props: SVGProps<SVGSVGElement>) {
  return (
    <svg {...props} viewBox="0 0 814 1000" xmlSpace="preserve">
      <path d="M788.1 340.9c-5.8 4.5-108.2 62.2-108.2 190.5 0 148.4 130.3 200.9 134.2 202.2-.6 3.2-20.7 71.9-68.7 141.9-42.8 61.6-87.5 123.1-155.5 123.1s-85.5-39.5-164-39.5c-76.5 0-103.7 40.8-165.9 40.8s-105.6-57-155.5-127C46.7 790.7 0 663 0 541.8c0-194.4 126.4-297.5 250.8-297.5 66.1 0 121.2 43.4 162.7 43.4 39.5 0 101.1-46 176.3-46 28.5 0 130.9 2.6 198.3 99.2zm-234-181.5c31.1-36.9 53.1-88.1 53.1-139.3 0-7.1-.6-14.3-1.9-20.1-50.6 1.9-110.8 33.7-147.1 75.8-28.5 32.4-55.1 83.6-55.1 135.5 0 7.8 1.3 15.6 1.9 18.1 3.2.6 8.4 1.3 13.6 1.3 45.4 0 102.5-30.4 135.5-71.3z" />
    </svg>
  );
}

function RowBrandAndroid(props: SVGProps<SVGSVGElement>) {
  return (
    <svg {...props} preserveAspectRatio="xMidYMid" viewBox="0 0 256 150">
      <path
        d="M255.285 143.47c-.084-.524-.164-1.042-.251-1.56a128.119 128.119 0 0 0-12.794-38.288 128.778 128.778 0 0 0-23.45-31.86 129.166 129.166 0 0 0-22.713-18.005c.049-.08.09-.168.14-.25 2.582-4.461 5.172-8.917 7.755-13.38l7.576-13.068c1.818-3.126 3.632-6.26 5.438-9.386a11.776 11.776 0 0 0 .662-10.484 11.668 11.668 0 0 0-4.823-5.536 11.85 11.85 0 0 0-5.004-1.61 11.963 11.963 0 0 0-2.218.018 11.738 11.738 0 0 0-8.968 5.798c-1.814 3.127-3.628 6.26-5.438 9.386l-7.576 13.069c-2.583 4.462-5.173 8.918-7.755 13.38-.282.487-.567.973-.848 1.467-.392-.157-.78-.313-1.172-.462-14.24-5.43-29.688-8.4-45.836-8.4-.442 0-.879 0-1.324.006-14.357.143-28.152 2.64-41.022 7.12a119.434 119.434 0 0 0-4.42 1.642c-.262-.455-.532-.911-.79-1.367-2.583-4.462-5.173-8.918-7.755-13.38L65.123 15.25c-1.818-3.126-3.632-6.259-5.439-9.386A11.736 11.736 0 0 0 48.5.048 11.71 11.71 0 0 0 43.49 1.66a11.716 11.716 0 0 0-4.077 4.063c-.281.474-.532.967-.742 1.473a11.808 11.808 0 0 0-.365 8.188c.259.786.594 1.554 1.023 2.296a3973.32 3973.32 0 0 1 5.439 9.386c2.53 4.357 5.054 8.713 7.58 13.069 2.582 4.462 5.168 8.918 7.75 13.38.02.038.046.075.065.112A129.184 129.184 0 0 0 45.32 64.38a129.693 129.693 0 0 0-22.2 24.015 127.737 127.737 0 0 0-9.34 15.24 128.238 128.238 0 0 0-10.843 28.764 130.743 130.743 0 0 0-1.951 9.524c-.087.518-.167 1.042-.247 1.56A124.978 124.978 0 0 0 0 149.118h256c-.205-1.891-.449-3.77-.734-5.636l.019-.012Z"
        fill="#34A853"
      />
      <path
        d="M194.59 113.712c5.122-3.41 5.867-11.3 1.661-17.62-4.203-6.323-11.763-8.682-16.883-5.273-5.122 3.41-5.868 11.3-1.662 17.621 4.203 6.322 11.764 8.682 16.883 5.272ZM78.518 108.462c4.206-6.321 3.46-14.21-1.662-17.62-5.123-3.41-12.68-1.05-16.886 5.27-4.203 6.323-3.458 14.212 1.662 17.622 5.122 3.41 12.683 1.05 16.886-5.272Z"
        fill="#202124"
      />
    </svg>
  );
}

function RowBrandBash(props: SVGProps<SVGSVGElement>) {
  return (
    <svg {...props} viewBox="0 0 32 32">
      <path
        d="M28.057 6.53 17.952.532a3.8 3.8 0 0 0-3.88 0L3.965 6.53A4.03 4.03 0 0 0 2 10.002v11.996a4.03 4.03 0 0 0 1.948 3.472l10.105 5.998a3.8 3.8 0 0 0 3.88 0L28.04 25.47a4.03 4.03 0 0 0 1.948-3.472V10.002a4.03 4.03 0 0 0-1.93-3.472zM20.23 25.262v.86a.318.318 0 0 1-.148.265l-.512.293c-.08.042-.148 0-.148-.113v-.847a1.66 1.66 0 0 1-1.164.113c-.062-.042-.086-.122-.056-.2l.183-.78a.322.322 0 0 1 .102-.17.18.18 0 0 1 .05-.035.11.11 0 0 1 .08 0 1.41 1.41 0 0 0 1.059-.134 1.41 1.41 0 0 0 .79-1.21c0-.438-.24-.62-.82-.625-.734 0-1.4-.14-1.43-1.224a3.137 3.137 0 0 1 1.186-2.4v-.872a.34.34 0 0 1 .148-.268l.494-.314c.08-.042.148 0 .148.116v.872a1.61 1.61 0 0 1 .967-.116c.07.04.098.128.064.2l-.173.773a.325.325 0 0 1-.138.195c-.02.012-.05.008-.074 0a1.28 1.28 0 0 0-.931.152 1.17 1.17 0 0 0-.706 1.037c0 .395.208.515.907.53.935 0 1.337.423 1.348 1.362a3.346 3.346 0 0 1-1.228 2.53zm5.293-1.45a.201.201 0 0 1-.078.194L22.9 25.558c-.024.02-.06.023-.087.007s-.04-.05-.033-.08v-.66a.184.184 0 0 1 .116-.162l2.516-1.507c.024-.02.06-.023.087-.007s.04.05.033.08v.582zM27.288 9.06l-9.562 5.906c-1.193.706-2.07 1.478-2.07 2.914v11.778c0 .86.353 1.4.882 1.58a3.14 3.14 0 0 1-.53.053 3.13 3.13 0 0 1-1.595-.441L4.308 24.853A3.3 3.3 0 0 1 2.706 22V10.002a3.304 3.304 0 0 1 1.602-2.858l10.105-5.998c.98-.58 2.196-.58 3.176 0l10.105 5.998c.833.504 1.4 1.35 1.552 2.3-.328-.713-1.083-.9-1.962-.395h.003z"
        fill="#1b1b1f"
        fillRule="evenodd"
      />
    </svg>
  );
}

function RowBrandChrome(props: SVGProps<SVGSVGElement>) {
  return (
    <svg {...props} preserveAspectRatio="xMidYMid" viewBox="0 0 190.5 190.5">
      <path
        d="M95.252 142.873c26.304 0 47.627-21.324 47.627-47.628s-21.323-47.628-47.627-47.628-47.627 21.324-47.627 47.628 21.323 47.628 47.627 47.628z"
        fill="#fff"
      />
      <path
        d="m54.005 119.07-41.24-71.43a95.227 95.227 0 0 0-.003 95.25 95.234 95.234 0 0 0 82.496 47.61l41.24-71.43v-.011a47.613 47.613 0 0 1-17.428 17.443 47.62 47.62 0 0 1-47.632.007 47.62 47.62 0 0 1-17.433-17.437z"
        fill="#229342"
      />
      <path
        d="m136.495 119.067-41.239 71.43a95.229 95.229 0 0 0 82.489-47.622A95.24 95.24 0 0 0 190.5 95.248a95.237 95.237 0 0 0-12.772-47.623H95.249l-.01.007a47.62 47.62 0 0 1 23.819 6.372 47.618 47.618 0 0 1 17.439 17.431 47.62 47.62 0 0 1-.001 47.633z"
        fill="#fbc116"
      />
      <path
        d="M95.252 132.961c20.824 0 37.705-16.881 37.705-37.706S116.076 57.55 95.252 57.55 57.547 74.431 57.547 95.255s16.881 37.706 37.705 37.706z"
        fill="#1a73e8"
      />
      <path
        d="M95.252 47.628h82.479A95.237 95.237 0 0 0 142.87 12.76 95.23 95.23 0 0 0 95.245 0a95.222 95.222 0 0 0-47.623 12.767 95.23 95.23 0 0 0-34.856 34.872l41.24 71.43.011.006a47.62 47.62 0 0 1-.015-47.633 47.61 47.61 0 0 1 41.252-23.815z"
        fill="#e33b2e"
      />
    </svg>
  );
}

function RowBrandJetbrains(props: SVGProps<SVGSVGElement>) {
  return (
    <svg {...props} preserveAspectRatio="xMidYMid" viewBox="0 0 256 256">
      <path d="M0 0h256v256H0z" />
      <path
        d="M28 208h96v16H28v-16ZM24 66l7-7c1 2 4 4 6 4 3 0 5-2 5-6V32h11v25c0 5-1 9-4 12-3 2-6 4-10 4h-1c-5 0-10-2-14-6v-1Zm34-34h32v9H69v7h19v8H69v6h21v10H58V32Zm48 10H94V32h35v10h-12v30h-11V42ZM28 88h19c4-1 8 1 11 3 2 2 3 4 3 7 0 4-3 7-7 9 5 1 8 5 8 10 0 7-5 11-15 11H28V88Zm22 12c0-2-2-3-5-3h-6v7h5c4 0 6-1 6-4Zm-4 11h-7v8h7c3 0 5-1 5-4 0-2-1-3-4-3l-1-1Zm43 17-8-12h-4v12H66V88h18c4-1 9 1 13 4 2 2 3 5 3 9 0 6-3 11-8 13l8 11 16-37h10l17 40h-12l-2-7h-16l-3 7H89Zm32-27-5 11h9l-4-11Zm-38-4h-6v10h6c4 0 6-2 6-5s-2-5-6-5Zm62-9h11v40h-11V88Zm15 0h11l14 21V88h11v40h-10l-15-22v22h-11V88Zm38 34 6-8c4 3 8 5 13 5 3 0 4-1 4-3 0-1 0-2-3-3h-3l-1-1h-2l-2-1c-6-1-10-4-10-11s5-13 15-13c6 0 12 2 16 6l-5 7c-3-2-7-4-11-4-3 0-4 1-4 3l3 3h2l2 1c9 2 15 5 15 12 0 8-6 13-15 13h-1c-7 0-13-2-18-5l-1-1Z"
        fill="#FFF"
      />
    </svg>
  );
}

function RowBrandSlack(props: SVGProps<SVGSVGElement>) {
  return (
    <svg {...props} viewBox="0 0 2447.6 2452.5">
      <g clipRule="evenodd" fillRule="evenodd">
        <path
          d="m897.4 0c-135.3.1-244.8 109.9-244.7 245.2-.1 135.3 109.5 245.1 244.8 245.2h244.8v-245.1c.1-135.3-109.5-245.1-244.9-245.3.1 0 .1 0 0 0m0 654h-652.6c-135.3.1-244.9 109.9-244.8 245.2-.2 135.3 109.4 245.1 244.7 245.3h652.7c135.3-.1 244.9-109.9 244.8-245.2.1-135.4-109.5-245.2-244.8-245.3z"
          fill="#36c5f0"
        />
        <path
          d="m2447.6 899.2c.1-135.3-109.5-245.1-244.8-245.2-135.3.1-244.9 109.9-244.8 245.2v245.3h244.8c135.3-.1 244.9-109.9 244.8-245.3zm-652.7 0v-654c.1-135.2-109.4-245-244.7-245.2-135.3.1-244.9 109.9-244.8 245.2v654c-.2 135.3 109.4 245.1 244.7 245.3 135.3-.1 244.9-109.9 244.8-245.3z"
          fill="#2eb67d"
        />
        <path
          d="m1550.1 2452.5c135.3-.1 244.9-109.9 244.8-245.2.1-135.3-109.5-245.1-244.8-245.2h-244.8v245.2c-.1 135.2 109.5 245 244.8 245.2zm0-654.1h652.7c135.3-.1 244.9-109.9 244.8-245.2.2-135.3-109.4-245.1-244.7-245.3h-652.7c-135.3.1-244.9 109.9-244.8 245.2-.1 135.4 109.4 245.2 244.7 245.3z"
          fill="#ecb22e"
        />
        <path
          d="m0 1553.2c-.1 135.3 109.5 245.1 244.8 245.2 135.3-.1 244.9-109.9 244.8-245.2v-245.2h-244.8c-135.3.1-244.9 109.9-244.8 245.2zm652.7 0v654c-.2 135.3 109.4 245.1 244.7 245.3 135.3-.1 244.9-109.9 244.8-245.2v-653.9c.2-135.3-109.4-245.1-244.7-245.3-135.4 0-244.9 109.8-244.8 245.1 0 0 0 .1 0 0"
          fill="#e01e5a"
        />
      </g>
    </svg>
  );
}

function RowBrandVscode(props: SVGProps<SVGSVGElement>) {
  return (
    <svg {...props} fill="none" viewBox="0 0 100 100">
      <mask
        height="100"
        id="recVscMask"
        mask-type="alpha"
        maskUnits="userSpaceOnUse"
        width="100"
        x="0"
        y="0"
      >
        <path
          clipRule="evenodd"
          d="M70.912 99.317a6.223 6.223 0 0 0 4.96-.19l20.589-9.907A6.25 6.25 0 0 0 100 83.587V16.413a6.25 6.25 0 0 0-3.54-5.632L75.874.874a6.226 6.226 0 0 0-7.104 1.21L29.355 38.04 12.187 25.01a4.162 4.162 0 0 0-5.318.236l-5.506 5.009a4.168 4.168 0 0 0-.004 6.162L16.247 50 1.36 63.583a4.168 4.168 0 0 0 .004 6.162l5.506 5.01a4.162 4.162 0 0 0 5.318.236l17.168-13.032L68.77 97.917a6.217 6.217 0 0 0 2.143 1.4ZM75.015 27.3 45.11 50l29.906 22.701V27.3Z"
          fill="#fff"
          fillRule="evenodd"
        />
      </mask>
      <g mask="url(#recVscMask)">
        <path
          d="M96.461 10.796 75.857.876a6.23 6.23 0 0 0-7.107 1.207l-67.451 61.5a4.167 4.167 0 0 0 .004 6.162l5.51 5.009a4.167 4.167 0 0 0 5.32.236l81.228-61.62c2.725-2.067 6.639-.124 6.639 3.297v-.24a6.25 6.25 0 0 0-3.539-5.63Z"
          fill="#0065A9"
        />
        <g filter="url(#recVscB)">
          <path
            d="m96.461 89.204-20.604 9.92a6.229 6.229 0 0 1-7.107-1.207l-67.451-61.5a4.167 4.167 0 0 1 .004-6.162l5.51-5.009a4.167 4.167 0 0 1 5.32-.236l81.228 61.62c2.725 2.067 6.639.124 6.639-3.297v.24a6.25 6.25 0 0 1-3.539 5.63Z"
            fill="#007ACC"
          />
        </g>
        <g filter="url(#recVscC)">
          <path
            d="M75.858 99.126a6.232 6.232 0 0 1-7.108-1.21c2.306 2.307 6.25.674 6.25-2.588V4.672c0-3.262-3.944-4.895-6.25-2.589a6.232 6.232 0 0 1 7.108-1.21l20.6 9.908A6.25 6.25 0 0 1 100 16.413v67.174a6.25 6.25 0 0 1-3.541 5.633l-20.601 9.906Z"
            fill="#1F9CF0"
          />
        </g>
        <path
          clipRule="evenodd"
          d="M70.851 99.317a6.224 6.224 0 0 0 4.96-.19L96.4 89.22a6.25 6.25 0 0 0 3.54-5.633V16.413a6.25 6.25 0 0 0-3.54-5.632L75.812.874a6.226 6.226 0 0 0-7.104 1.21L29.294 38.04 12.126 25.01a4.162 4.162 0 0 0-5.317.236l-5.507 5.009a4.168 4.168 0 0 0-.004 6.162L16.186 50 1.298 63.583a4.168 4.168 0 0 0 .004 6.162l5.507 5.009a4.162 4.162 0 0 0 5.317.236L29.294 61.96l39.414 35.958a6.218 6.218 0 0 0 2.143 1.4ZM74.954 27.3 45.048 50l29.906 22.701V27.3Z"
          fill="url(#recVscD)"
          fillRule="evenodd"
          opacity=".25"
          style={{ mixBlendMode: "overlay" }}
        />
      </g>
      <defs>
        <filter
          colorInterpolationFilters="sRGB"
          filterUnits="userSpaceOnUse"
          height="92.246"
          id="recVscB"
          width="116.727"
          x="-8.394"
          y="15.829"
        >
          <feFlood floodOpacity="0" result="BackgroundImageFix" />
          <feColorMatrix
            in="SourceAlpha"
            values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
          />
          <feOffset />
          <feGaussianBlur stdDeviation="4.167" />
          <feColorMatrix values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.25 0" />
          <feBlend
            in2="BackgroundImageFix"
            mode="overlay"
            result="effect1_dropShadow"
          />
          <feBlend in="SourceGraphic" in2="effect1_dropShadow" result="shape" />
        </filter>
        <filter
          colorInterpolationFilters="sRGB"
          filterUnits="userSpaceOnUse"
          height="116.151"
          id="recVscC"
          width="47.917"
          x="60.417"
          y="-8.076"
        >
          <feFlood floodOpacity="0" result="BackgroundImageFix" />
          <feColorMatrix
            in="SourceAlpha"
            values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
          />
          <feOffset />
          <feGaussianBlur stdDeviation="4.167" />
          <feColorMatrix values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.25 0" />
          <feBlend
            in2="BackgroundImageFix"
            mode="overlay"
            result="effect1_dropShadow"
          />
          <feBlend in="SourceGraphic" in2="effect1_dropShadow" result="shape" />
        </filter>
        <linearGradient
          gradientUnits="userSpaceOnUse"
          id="recVscD"
          x1="49.939"
          x2="49.939"
          y1=".258"
          y2="99.742"
        >
          <stop stopColor="#fff" />
          <stop offset="1" stopColor="#fff" stopOpacity="0" />
        </linearGradient>
      </defs>
    </svg>
  );
}

function RowBrandExcel(props: SVGProps<SVGSVGElement>) {
  return (
    <svg {...props} viewBox="0 0 486 500">
      <defs>
        <radialGradient
          cx="-746.66"
          cy="781.44"
          fx="-746.66"
          fy="781.44"
          gradientTransform="matrix(-28.32596 -29.80763 -23.11916 21.97986 -2596.39 -38900.31)"
          gradientUnits="userSpaceOnUse"
          id="recXlsA"
          r="13.89"
        >
          <stop offset=".06" stopColor="#379539" />
          <stop offset=".42" stopColor="#297c2d" />
          <stop offset=".7" stopColor="#15561c" />
        </radialGradient>
        <radialGradient
          cx="-773.19"
          cy="771.25"
          fx="-773.19"
          fy="771.25"
          gradientTransform="matrix(-11.97612 -11.58137 -8.95853 9.26806 -2155.12 -15858.88)"
          gradientUnits="userSpaceOnUse"
          id="recXlsB"
          r="13.89"
        >
          <stop offset="0" stopColor="#073b10" />
          <stop offset=".99" stopColor="#084a13" stopOpacity="0" />
        </radialGradient>
        <radialGradient
          cx="-824.11"
          cy="810.99"
          fx="-824.11"
          fy="810.99"
          gradientTransform="matrix(-9.02 0 0 19.09 -7120.4 -15378.69)"
          gradientUnits="userSpaceOnUse"
          id="recXlsF"
          r="13.89"
        >
          <stop offset=".29" stopColor="#4eb43b" />
          <stop offset="1" stopColor="#72cc61" stopOpacity="0" />
        </radialGradient>
        <radialGradient
          cx="-769.14"
          cy="808.9"
          fx="-769.14"
          fy="808.9"
          gradientTransform="matrix(-16.9077 -13.68182 13.64112 -16.86345 -23523.37 3309.71)"
          gradientUnits="userSpaceOnUse"
          id="recXlsH"
          r="13.89"
        >
          <stop offset=".44" stopColor="#79e96d" />
          <stop offset="1" stopColor="#d0eb76" />
        </radialGradient>
        <radialGradient
          cx="-675.64"
          cy="793.28"
          fx="-675.64"
          fy="793.28"
          gradientTransform="matrix(15.99196 15.99755 45.54153 -45.54797 -25315.85 47178.18)"
          gradientUnits="userSpaceOnUse"
          id="recXlsI"
          r="13.89"
        >
          <stop offset="0" stopColor="#20a85e" />
          <stop offset=".94" stopColor="#09442a" />
        </radialGradient>
        <radialGradient
          cx="-657.62"
          cy="853.99"
          fx="-657.62"
          fy="853.99"
          gradientTransform="matrix(0 11.2 12.9 0 -10902.85 7734.8)"
          gradientUnits="userSpaceOnUse"
          id="recXlsJ"
          r="13.89"
        >
          <stop offset=".58" stopColor="#33a662" stopOpacity="0" />
          <stop offset=".97" stopColor="#98f0b0" />
        </radialGradient>
        <linearGradient
          gradientTransform="matrix(1 0 0 -1 0 502)"
          gradientUnits="userSpaceOnUse"
          id="recXlsC"
          x1="69.43"
          x2="260.84"
          y1="210.33"
          y2="210.33"
        >
          <stop offset="0" stopColor="#52d17c" />
          <stop offset=".33" stopColor="#4aa647" />
        </linearGradient>
        <linearGradient
          gradientTransform="matrix(1 0 0 -1 0 502)"
          gradientUnits="userSpaceOnUse"
          id="recXlsD"
          x1="194.4"
          x2="194.4"
          y1="335.33"
          y2="161.68"
        >
          <stop offset="0" stopColor="#29852f" />
          <stop offset=".5" stopColor="#4aa647" stopOpacity="0" />
        </linearGradient>
        <linearGradient
          gradientTransform="matrix(1 0 0 -1 0 502)"
          gradientUnits="userSpaceOnUse"
          id="recXlsE"
          x1="80.49"
          x2="311.45"
          y1="297.22"
          y2="497.54"
        >
          <stop offset="0" stopColor="#66d052" />
          <stop offset="1" stopColor="#85e972" />
        </linearGradient>
        <linearGradient
          gradientTransform="matrix(1 0 0 -1 0 502)"
          gradientUnits="userSpaceOnUse"
          id="recXlsG"
          x1="182.11"
          x2="69.43"
          y1="377"
          y2="377"
        >
          <stop offset=".18" stopColor="#c0e075" stopOpacity="0" />
          <stop offset="1" stopColor="#d1eb95" />
        </linearGradient>
      </defs>
      <path
        d="M69.43 159.72c0-34.52 27.98-62.5 62.49-62.5h354.09v361.11c0 23.01-18.65 41.67-41.66 41.67H152.74c-46.01 0-83.31-37.31-83.31-83.33V159.72Z"
        style={{ fill: "url(#recXlsA)" }}
      />
      <path
        d="M69.43 159.72c0-34.52 27.98-62.5 62.49-62.5h354.09v361.11c0 23.01-18.65 41.67-41.66 41.67H152.74c-46.01 0-83.31-37.31-83.31-83.33V159.72Z"
        style={{ fill: "url(#recXlsB)", fillOpacity: ".7" }}
      />
      <path
        d="M69.43 229.17c0-34.52 27.98-62.5 62.49-62.5h187.46c-23.01 0-41.66 18.66-41.66 41.67v83.33c0 23.01-18.65 41.67-41.66 41.67h-83.31c-46.01 0-83.31 37.31-83.31 83.33v-187.5Z"
        style={{ fill: "url(#recXlsC)" }}
      />
      <path
        d="M69.43 229.17c0-34.52 27.98-62.5 62.49-62.5h187.46c-23.01 0-41.66 18.66-41.66 41.67v83.33c0 23.01-18.65 41.67-41.66 41.67h-83.31c-46.01 0-83.31 37.31-83.31 83.33v-187.5Z"
        style={{ fill: "url(#recXlsD)", fillOpacity: ".3" }}
      />
      <path
        d="M69.43 83.33C69.43 37.31 106.73 0 152.74 0h166.63v166.67H152.74c-46.01 0-83.31 37.31-83.31 83.33V83.33Z"
        style={{ fill: "url(#recXlsE)" }}
      />
      <path
        d="M69.43 83.33C69.43 37.31 106.73 0 152.74 0h166.63v166.67H152.74c-46.01 0-83.31 37.31-83.31 83.33V83.33Z"
        style={{ fill: "url(#recXlsF)" }}
      />
      <path
        d="M69.43 83.33C69.43 37.31 106.73 0 152.74 0h166.63v166.67H152.74c-46.01 0-83.31 37.31-83.31 83.33V83.33Z"
        style={{ fill: "url(#recXlsG)" }}
      />
      <rect
        height="166.67"
        rx="41.66"
        ry="41.66"
        style={{ fill: "url(#recXlsH)" }}
        width="208.29"
        x="277.71"
      />
      <rect
        height="222.22"
        rx="45.13"
        ry="45.13"
        style={{ fill: "url(#recXlsI)" }}
        width="222.17"
        y="236.11"
      />
      <rect
        height="222.22"
        rx="45.13"
        ry="45.13"
        style={{ fillOpacity: ".3", fill: "url(#recXlsJ)" }}
        width="222.17"
        y="236.11"
      />
      <path
        d="M169.48 410.71h-34.25l-21.5-40.47c-.77-1.42-1.36-2.54-1.77-3.37-.35-.88-.74-1.89-1.15-3.01h-.35c-.53 1.42-1.03 2.57-1.5 3.45-.47.89-1.03 1.98-1.68 3.28l-22.3 40.11h-32.3l38.76-63.58-36.1-63.4h33.8l19.11 36.13c.77 1.48 1.42 2.78 1.95 3.9.59 1.06 1.18 2.33 1.77 3.81h.35l1.95-4.07c.53-1 1.24-2.33 2.12-3.98l19.82-35.77h32.21l-36.63 62.43 37.7 64.55Z"
        style={{ fill: "#fff" }}
      />
    </svg>
  );
}

function RowBrandPowerpoint(props: SVGProps<SVGSVGElement>) {
  return (
    <svg {...props} viewBox="60 78.75 581.25 562.5">
      <defs>
        <radialGradient
          cx="0"
          cy="0"
          fx="0"
          fy="0"
          gradientTransform="rotate(135 185.459 218.557) scale(564.67953 950.43148)"
          gradientUnits="userSpaceOnUse"
          id="recPptB"
          r="1"
        >
          <stop
            offset=".152"
            style={{ stopColor: "#aa1d2d", stopOpacity: "1" }}
          />
          <stop
            offset=".381"
            style={{ stopColor: "#d12b18", stopOpacity: ".439216" }}
          />
          <stop
            offset=".602"
            style={{ stopColor: "#ff3c00", stopOpacity: "0" }}
          />
        </radialGradient>
        <radialGradient
          cx="0"
          cy="0"
          fx="0"
          fy="0"
          gradientTransform="matrix(484.01207 -228.61784 414.17447 876.85825 -19.41 588.618)"
          gradientUnits="userSpaceOnUse"
          id="recPptC"
          r="1"
        >
          <stop
            offset=".407"
            style={{ stopColor: "#ff66fb", stopOpacity: ".501961" }}
          />
          <stop offset="1" style={{ stopColor: "#ea3d01", stopOpacity: "0" }} />
        </radialGradient>
        <radialGradient
          cx="0"
          cy="0"
          fx="0"
          fy="0"
          gradientTransform="matrix(355.8576 74.56878 -71.0897 339.25471 312.756 393.631)"
          gradientUnits="userSpaceOnUse"
          id="recPptE"
          r="1"
        >
          <stop
            offset=".786"
            style={{ stopColor: "#ffa05c", stopOpacity: "0" }}
          />
          <stop
            offset=".905"
            style={{ stopColor: "#ffce84", stopOpacity: "1" }}
          />
        </radialGradient>
        <radialGradient
          cx="0"
          cy="0"
          fx="0"
          fy="0"
          gradientTransform="matrix(307.21144 -201.01593 192.23383 293.78981 369.795 355.78)"
          gradientUnits="userSpaceOnUse"
          id="recPptF"
          r="1"
        >
          <stop
            offset=".295"
            style={{ stopColor: "#ff99e9", stopOpacity: ".8" }}
          />
          <stop
            offset=".728"
            style={{ stopColor: "#ff99e9", stopOpacity: "0" }}
          />
        </radialGradient>
        <radialGradient
          cx="0"
          cy="0"
          fx="0"
          fy="0"
          gradientTransform="matrix(257.14316 -294.39511 268.86446 234.84308 328.567 398.718)"
          gradientUnits="userSpaceOnUse"
          id="recPptG"
          r="1"
        >
          <stop offset="0" style={{ stopColor: "#fd6ef9", stopOpacity: "1" }} />
          <stop offset=".637" style={{ stopColor: "#f94", stopOpacity: "1" }} />
          <stop
            offset=".852"
            style={{ stopColor: "#fcc479", stopOpacity: "1" }}
          />
        </radialGradient>
        <radialGradient
          cx="0"
          cy="0"
          fx="0"
          fy="0"
          gradientTransform="matrix(-29.04584 196.8193 -444.81484 -65.64406 302.985 115.92)"
          gradientUnits="userSpaceOnUse"
          id="recPptH"
          r="1"
        >
          <stop
            offset=".144"
            style={{ stopColor: "#ff8d13", stopOpacity: "1" }}
          />
          <stop
            offset=".537"
            style={{ stopColor: "#ff7f29", stopOpacity: "0" }}
          />
        </radialGradient>
        <radialGradient
          cx="0"
          cy="0"
          fx="0"
          fy="0"
          gradientTransform="rotate(45 -386.466 244.891) scale(339.41099)"
          gradientUnits="userSpaceOnUse"
          id="recPptI"
          r="1"
        >
          <stop offset="0" style={{ stopColor: "#f8193e", stopOpacity: "1" }} />
          <stop
            offset=".939"
            style={{ stopColor: "#920616", stopOpacity: "1" }}
          />
        </radialGradient>
        <radialGradient
          cx="0"
          cy="0"
          fx="0"
          fy="0"
          gradientTransform="matrix(0 168 -191.25 0 179.97 489)"
          gradientUnits="userSpaceOnUse"
          id="recPptJ"
          r="1"
        >
          <stop
            offset=".576"
            style={{ stopColor: "#ffb055", stopOpacity: "0" }}
          />
          <stop
            offset=".974"
            style={{ stopColor: "#fff2be", stopOpacity: ".301961" }}
          />
        </radialGradient>
        <linearGradient
          gradientTransform="scale(15)"
          gradientUnits="userSpaceOnUse"
          id="recPptA"
          x1="22.096"
          x2="-.876"
          y1="4.056"
          y2="26.033"
        >
          <stop
            offset=".058"
            style={{ stopColor: "#ff7f48", stopOpacity: "1" }}
          />
          <stop offset="1" style={{ stopColor: "#e5495b", stopOpacity: "1" }} />
        </linearGradient>
        <linearGradient
          gradientTransform="scale(15)"
          gradientUnits="userSpaceOnUse"
          id="recPptD"
          x1="27.549"
          x2="47.729"
          y1="28.172"
          y2="13.216"
        >
          <stop
            offset=".311"
            style={{ stopColor: "#ff6e30", stopOpacity: "1" }}
          />
          <stop
            offset=".635"
            style={{ stopColor: "#ffa05c", stopOpacity: "1" }}
          />
        </linearGradient>
      </defs>
      <path
        d="M641.2 360c0-155.332-125.907-281.25-281.223-281.25C204.66 78.75 78.75 204.668 78.75 360s125.91 281.25 281.227 281.25c155.316 0 281.222-125.918 281.222-281.25Zm0 0"
        style={{ stroke: "none", fillRule: "nonzero", fill: "url(#recPptA)" }}
      />
      <path
        d="M641.2 360c0-155.332-125.907-281.25-281.223-281.25C204.66 78.75 78.75 204.668 78.75 360s125.91 281.25 281.227 281.25c155.316 0 281.222-125.918 281.222-281.25Zm0 0"
        style={{ stroke: "none", fillRule: "nonzero", fill: "url(#recPptB)" }}
      />
      <path
        d="M641.2 360c0-155.332-125.907-281.25-281.223-281.25C204.66 78.75 78.75 204.668 78.75 360s125.91 281.25 281.227 281.25c155.316 0 281.222-125.918 281.222-281.25Zm0 0"
        style={{ stroke: "none", fillRule: "nonzero", fill: "url(#recPptC)" }}
      />
      <path
        d="M360.016 78.75c155.312.004 281.218 125.922 281.218 281.25 0 51.672-13.96 100.07-38.273 141.68l4.57-10.121c27.832-61.797-17.406-131.727-85.183-131.676l-111.93.086c-27.824.023-50.402-22.535-50.402-50.36V197.477c-.004-67.805-70.012-112.993-131.793-85.067l-8.996 4.074c41.406-23.992 89.492-37.734 140.789-37.734Zm0 0"
        style={{ stroke: "none", fillRule: "nonzero", fill: "url(#recPptD)" }}
      />
      <path
        d="M360.016 78.75c155.312.004 281.218 125.922 281.218 281.25 0 51.672-13.96 100.07-38.273 141.68l4.57-10.121c27.832-61.797-17.406-131.727-85.183-131.676l-111.93.086c-27.824.023-50.402-22.535-50.402-50.36V197.477c-.004-67.805-70.012-112.993-131.793-85.067l-8.996 4.074c41.406-23.992 89.492-37.734 140.789-37.734Zm0 0"
        style={{ stroke: "none", fillRule: "nonzero", fill: "url(#recPptE)" }}
      />
      <path
        d="M360.016 78.75c155.312.004 281.218 125.922 281.218 281.25 0 51.672-13.96 100.07-38.273 141.68l4.57-10.121c27.832-61.797-17.406-131.727-85.183-131.676l-111.93.086c-27.824.023-50.402-22.535-50.402-50.36V197.477c-.004-67.805-70.012-112.993-131.793-85.067l-8.996 4.074c41.406-23.992 89.492-37.734 140.789-37.734Zm0 0"
        style={{ stroke: "none", fillRule: "nonzero", fill: "url(#recPptF)" }}
      />
      <path
        d="M360.016 78.75c155.312.004 281.218 125.922 281.218 281.25 0 51.672-13.96 100.07-38.273 141.68l4.57-10.121c27.832-61.797-17.406-131.727-85.183-131.676l-111.93.086c-27.824.023-50.402-22.535-50.402-50.36V197.477c-.004-67.805-70.012-112.993-131.793-85.067l-8.996 4.074c41.406-23.992 89.492-37.734 140.789-37.734Zm0 0"
        style={{ stroke: "none", fillRule: "nonzero", fill: "url(#recPptG)" }}
      />
      <path
        d="M360.016 78.75c155.312.004 281.218 125.922 281.218 281.25 0 51.672-13.96 100.07-38.273 141.68l4.57-10.121c27.832-61.797-17.406-131.727-85.183-131.676l-111.93.086c-27.824.023-50.402-22.535-50.402-50.36V197.477c-.004-67.805-70.012-112.993-131.793-85.067l-8.996 4.074c41.406-23.992 89.492-37.734 140.789-37.734Zm0 0"
        style={{ stroke: "none", fillRule: "nonzero", fill: "url(#recPptH)" }}
      />
      <path
        d="M108.75 345h142.5c26.926 0 48.75 21.824 48.75 48.75v142.5c0 26.926-21.824 48.75-48.75 48.75h-142.5C81.824 585 60 563.176 60 536.25v-142.5C60 366.824 81.824 345 108.75 345Zm0 0"
        style={{ stroke: "none", fillRule: "nonzero", fill: "url(#recPptI)" }}
      />
      <path
        d="M108.75 345h142.5c26.926 0 48.75 21.824 48.75 48.75v142.5c0 26.926-21.824 48.75-48.75 48.75h-142.5C81.824 585 60 563.176 60 536.25v-142.5C60 366.824 81.824 345 108.75 345Zm0 0"
        style={{ stroke: "none", fillRule: "nonzero", fill: "url(#recPptJ)" }}
      />
      <path
        d="M168.293 488.906v44.664h-30.875V396.426h47.7c17.077 0 30.077 3.73 39 11.191 8.987 7.457 13.48 18.52 13.48 33.184 0 15.113-5.036 26.906-15.106 35.387-10.004 8.48-23.453 12.718-40.34 12.718Zm0-68.761v45.043h12.906c7.645 0 13.543-2.004 17.684-6.024 4.14-4.016 6.215-9.785 6.215-17.309 0-6.949-2.043-12.304-6.121-16.07-4.016-3.762-9.782-5.64-17.301-5.64Zm0 0"
        style={{
          stroke: "none",
          fillRule: "nonzero",
          fill: "#fff",
          fillOpacity: "1",
        }}
      />
    </svg>
  );
}

const ROW_ICON_CLASS = "size-[18px] shrink-0";

function RowIcon({ kind }: { kind: AppRowIcon }) {
  return (
    <div
      className={cn(
        "flex size-7 shrink-0 items-center justify-center rounded-md border-[0.5px] border-border bg-muted/60"
      )}
    >
      {kind === "apple" ? (
        <RowBrandApple
          aria-hidden
          className={cn(ROW_ICON_CLASS, "fill-current text-foreground")}
        />
      ) : null}
      {kind === "android" ? (
        <RowBrandAndroid
          aria-hidden
          className="h-[18px] w-auto max-w-[28px] shrink-0 object-contain"
        />
      ) : null}
      {kind === "terminal" ? (
        <RowBrandBash aria-hidden className={ROW_ICON_CLASS} />
      ) : null}
      {kind === "vscode" ? (
        <RowBrandVscode aria-hidden className={ROW_ICON_CLASS} />
      ) : null}
      {kind === "jetbrains" ? (
        <RowBrandJetbrains aria-hidden className={ROW_ICON_CLASS} />
      ) : null}
      {kind === "slack" ? (
        <RowBrandSlack aria-hidden className={ROW_ICON_CLASS} />
      ) : null}
      {kind === "excel" ? (
        <RowBrandExcel aria-hidden className={ROW_ICON_CLASS} />
      ) : null}
      {kind === "powerpoint" ? (
        <RowBrandPowerpoint aria-hidden className={ROW_ICON_CLASS} />
      ) : null}
      {kind === "chrome" ? (
        <RowBrandChrome aria-hidden className={ROW_ICON_CLASS} />
      ) : null}
    </div>
  );
}

const DEFAULT_APP_IDS: ClaudeRecommendAppId[] = [
  "desktop",
  "ios",
  "claude_code_terminal",
];

export const ALL_CLAUDE_RECOMMEND_APP_IDS = Object.keys(
  APP_CATALOG
) as ClaudeRecommendAppId[];

export function ClaudeRecommendClaudeAppsTool({
  appIds = DEFAULT_APP_IDS,
  maxVisible = 3,
  className,
}: {
  appIds?: ClaudeRecommendAppId[];
  /** Max rows to render (tool payloads often send a small list). */
  maxVisible?: number;
  className?: string;
}) {
  const cap = Number.isFinite(maxVisible) ? Math.max(1, maxVisible) : 3;
  const ids = appIds
    .filter((id): id is ClaudeRecommendAppId => id in APP_CATALOG)
    .slice(0, cap);

  return (
    <div className={cn("pt-1 pb-2 pl-2", className)}>
      <div className="my-3 overflow-hidden rounded-lg border-[0.5px] border-border bg-card font-sans">
        <div className="flex h-10.5 items-center gap-2 px-3 py-2">
          <div className="flex size-5 items-center justify-center text-foreground">
            <div className="flex size-4 items-center justify-center">
              <DownloadGlyph className="size-5" />
            </div>
          </div>
          <span className="text-pretty text-muted-foreground text-sm">
            Recommended apps and extensions
          </span>
        </div>

        <div className="space-y-1 px-2 pb-2">
          {ids.map((id) => {
            const app = APP_CATALOG[id];
            const label = app.action === "download" ? "Download" : "Install";
            const trailing =
              app.action === "download" ? (
                <DownloadGlyph className="size-3" />
              ) : (
                <ExternalCornerGlyph className="size-3" />
              );
            const actionClass = cn(
              buttonVariants({ variant: "outline", size: "lg" }),
              "min-w-16 gap-1 px-3 pr-2 pl-2.5 text-xs [&_svg]:size-3"
            );

            return (
              <div
                className="flex items-center gap-3 rounded-md p-2 transition-colors duration-150 fine-hover:hover:bg-muted/80"
                key={app.id}
              >
                <RowIcon kind={app.icon} />
                <div className="min-w-0 flex-1">
                  <div className="text-pretty font-medium text-foreground text-sm">
                    {app.title}
                  </div>
                  <div className="truncate text-muted-foreground text-xs">
                    {app.description}
                  </div>
                </div>
                <div className="shrink-0">
                  <a
                    className={actionClass}
                    href={app.href}
                    rel={app.external ? "noopener noreferrer" : undefined}
                    target={app.external ? "_blank" : undefined}
                  >
                    {label}
                    {trailing}
                  </a>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
