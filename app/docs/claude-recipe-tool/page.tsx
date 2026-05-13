"use client";

import {
  ClaudeRecipeTool,
  DEFAULT_RECIPE_DATA,
} from "@/components/ai-components/claude-recipe-tool";
import { ComponentPreview } from "@/lib/docs/ComponentPreview";
import { PropsTable, type PropDef } from "@/lib/docs/PropsTable";
import { DocPage, DocSection } from "@/lib/docs/DocPage";

const defaultCode = `import { ClaudeRecipeTool } from "./components/claude-recipe-tool";

// Renders with the built-in DEFAULT_RECIPE_DATA when no \`recipe\` is passed.
<ClaudeRecipeTool />`;

const customRecipeCode = `import { ClaudeRecipeTool } from "./components/claude-recipe-tool";

<ClaudeRecipeTool
  recipe={{
    title: "Weeknight Tomato Pasta",
    description: "Pantry-friendly red sauce, 25 min start to finish",
    base_servings: 2,
    ingredients: [
      { id: "i1", name: "spaghetti", amount: 200, unit: "g" },
      { id: "i2", name: "olive oil", amount: 2, unit: "tbsp" },
      { id: "i3", name: "garlic, sliced", amount: 3 },
      { id: "i4", name: "canned tomatoes", amount: 1, unit: "cup" },
      { id: "i5", name: "salt", amount: 1, unit: "tsp" },
    ],
    steps: [
      {
        id: "s1",
        title: "Boil pasta",
        content: "Cook {i1} in salted water until al dente.",
        timer_seconds: 540,
      },
      {
        id: "s2",
        title: "Build sauce",
        content: "Warm {i2}, add {i3}, then {i4} and {i5}.",
      },
      {
        id: "s3",
        title: "Combine",
        content: "Toss pasta with sauce. Serve hot.",
      },
    ],
    notes: "Reserve a splash of pasta water to loosen the sauce.",
  }}
  onGetCooking={() => console.log("Get cooking")}
/>`;

const recipeProps: PropDef[] = [
  {
    name: "recipe",
    type: "Partial<RecipeData>",
    default: "DEFAULT_RECIPE_DATA",
    description:
      "Recipe payload. Missing fields fall back to the built-in default. Includes title, description, base_servings, ingredients, steps, notes, and optional images.",
  },
  {
    name: "onGetCooking",
    type: "() => void",
    description: 'Called when the user clicks the "Get cooking" button.',
  },
  {
    name: "top",
    type: "ReactNode",
    description: "Optional content rendered above the gallery and header.",
  },
  {
    name: "className",
    type: "string",
    description: "Class names merged onto the root card.",
  },
];

const unitSystemProps: PropDef[] = [
  {
    name: "UnitSystem",
    type: '"as_written" | "us" | "metric"',
    default: '"as_written"',
    description:
      "Internal state controlled by the ruler dropdown. 'as_written' keeps the original units; 'us' converts to cups/tbsp/tsp and oz/lb; 'metric' converts to ml/L and g/kg.",
  },
];

export default function ClaudeRecipeToolDoc() {
  return (
    <DocPage
      title="Claude Recipe Tool"
      slug="claude-recipe-tool"
      description="Recipe card that scales servings, switches between as-written, US, and metric units, and turns embedded {ingredient_id} placeholders into resolved measurements. Includes inline step timers, copy-to-clipboard, and a print action."
    >
      <DocSection title="Default">
        <ComponentPreview code={defaultCode}>
          <div className="w-full max-w-2xl">
            <ClaudeRecipeTool recipe={DEFAULT_RECIPE_DATA as any} />
          </div>
        </ComponentPreview>
      </DocSection>

      <DocSection title="Custom recipe">
        <ComponentPreview code={customRecipeCode}>
          <div className="w-full max-w-2xl">
            <ClaudeRecipeTool
              recipe={{
                title: "Weeknight Tomato Pasta",
                description: "Pantry-friendly red sauce, 25 min start to finish",
                base_servings: 2,
                ingredients: [
                  { id: "i1", name: "spaghetti", amount: 200, unit: "g" },
                  { id: "i2", name: "olive oil", amount: 2, unit: "tbsp" },
                  { id: "i3", name: "garlic, sliced", amount: 3 },
                  { id: "i4", name: "canned tomatoes", amount: 1, unit: "cup" },
                  { id: "i5", name: "salt", amount: 1, unit: "tsp" },
                ],
                steps: [
                  {
                    id: "s1",
                    title: "Boil pasta",
                    content: "Cook {i1} in salted water until al dente.",
                    timer_seconds: 540,
                  },
                  {
                    id: "s2",
                    title: "Build sauce",
                    content: "Warm {i2}, add {i3}, then {i4} and {i5}.",
                  },
                  {
                    id: "s3",
                    title: "Combine",
                    content: "Toss pasta with sauce. Serve hot.",
                  },
                ],
                notes: "Reserve a splash of pasta water to loosen the sauce.",
              }}
              onGetCooking={() => {}}
            />
          </div>
        </ComponentPreview>
      </DocSection>

      <DocSection title="API Reference">
        <PropsTable props={recipeProps} />
      </DocSection>

      <DocSection title="UnitSystem">
        <PropsTable props={unitSystemProps} />
      </DocSection>
    </DocPage>
  );
}
