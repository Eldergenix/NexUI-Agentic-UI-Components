import tsParser from "@typescript-eslint/parser";
import tsPlugin from "@typescript-eslint/eslint-plugin";
import nextPlugin from "@next/eslint-plugin-next";

// Tailwind utilities reserved for the canonical-shadcn theme on /compare.
// See app/compare/shadcn-theme.css. These render as transparent outside
// `.shadcn-theme`; this rule blocks accidental use in FF components.
const SHADCN_RESERVED_REGEX =
  "\\b(bg|text|border|ring|hover:bg|hover:text|focus-visible:ring|focus:ring)-(primary|secondary|popover|primary-foreground|secondary-foreground|popover-foreground|destructive-foreground)(\\/[0-9]+)?\\b";

const shadcnRestrictedRules = {
  "no-restricted-syntax": [
    "error",
    {
      selector: `Literal[value=/${SHADCN_RESERVED_REGEX}/]`,
      message:
        "Tailwind utility reserved for /compare's shadcn theme. Use FF tokens (bg-foreground, bg-card, bg-accent, bg-destructive, text-foreground, etc.) instead.",
    },
    {
      selector: `TemplateElement[value.raw=/${SHADCN_RESERVED_REGEX}/]`,
      message:
        "Tailwind utility reserved for /compare's shadcn theme. Use FF tokens instead.",
    },
  ],
};

export default [
  {
    ignores: [
      ".claude/**",
      ".next/**",
      "dist/**",
      "next-env.d.ts",
      "node_modules/**",
      "public/r/**",
    ],
  },
  {
    files: ["**/*.{js,mjs,cjs,ts,tsx}"],
    languageOptions: {
      parser: tsParser,
      parserOptions: {
        ecmaVersion: "latest",
        sourceType: "module",
        ecmaFeatures: {
          jsx: true,
        },
      },
    },
    plugins: {
      "@typescript-eslint": tsPlugin,
      "@next/next": nextPlugin,
    },
    rules: {
      ...tsPlugin.configs.recommended.rules,
      ...nextPlugin.configs.recommended.rules,
      ...nextPlugin.configs["core-web-vitals"].rules,
      "@typescript-eslint/no-unused-vars": [
        "warn",
        {
          argsIgnorePattern: "^_",
          varsIgnorePattern: "^_",
        },
      ],
    },
  },
  // Block shadcn-reserved Tailwind tokens in Fluid Functionalism code.
  // The canonical shadcn install (components/shadcn/**) and the /compare page
  // are explicitly exempt because they need these utilities by design.
  {
    files: ["**/*.{ts,tsx}"],
    ignores: [
      "components/shadcn/**",
      "app/compare/**",
      "app/components/shadcn-previews.tsx",
    ],
    rules: shadcnRestrictedRules,
  },
];
