"use client";

import {
  Check,
  Copy,
  Minus,
  Pause,
  Play,
  Plus,
  Printer,
  Ruler,
} from "lucide-react";
import NextImage from "next/image";
import Link from "next/link";
import { type ReactNode, useCallback, useEffect, useId, useState } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";

const WEB_RESULTS_HREF =
  "https://support.claude.com/en/articles/13641943-visual-and-interactive-content";

export type UnitSystem = "as_written" | "us" | "metric";

export type RecipeImage = {
  src: string;
  alt: string;
  credit: string;
};

export type RecipeIngredientItem = {
  id: string;
  name: string;
  amount: number;
  unit?: string;
};

export type RecipeStepItem = {
  id: string;
  title: string;
  content: string;
  /**
   * When set with `timer_seconds`, text after the inline timer
   * (e.g. " to let the flavors meld. Serve with chips.").
   */
  content_after?: string;
  timer_seconds?: number;
};

export type RecipeData = {
  title: string;
  description: string;
  base_servings: number;
  ingredients: RecipeIngredientItem[];
  steps: RecipeStepItem[];
  notes: string;
  images?: RecipeImage[];
  web_results_caption?: string;
  /** Shown for "Results from the web" link; defaults to Anthropic help article. */
  web_results_href?: string;
};

const DEFAULT_RECIPE_DATA: RecipeData = {
  title: "Classic Guacamole",
  description: "Fresh, creamy, and ready in 10 min",
  base_servings: 4,
  ingredients: [
    { id: "0001", name: "ripe avocados", amount: 3 },
    { id: "0002", name: "lime, juiced", amount: 1 },
    { id: "0003", name: "salt", amount: 0.5, unit: "tsp" },
    { id: "0004", name: "cilantro, chopped", amount: 2, unit: "tbsp" },
  ],
  steps: [
    {
      id: "s1",
      title: "Prep avocados",
      content: "Halve {0001}, scoop flesh into bowl.",
    },
    {
      id: "s2",
      title: "Mash & season",
      content: "Mash, add {0002} and {0003}.",
    },
    {
      id: "s3",
      title: "Rest",
      content: "Let sit 5 minutes.",
      timer_seconds: 300,
    },
  ],
  notes: "Plastic wrap on surface prevents browning.",
};

function formatAmount(n: number): string {
  if (Number.isInteger(n) || Math.abs(n - Math.round(n)) < 1e-6) {
    return String(Math.round(n));
  }
  const t = n.toFixed(2);
  if (t.endsWith("0")) {
    return n.toFixed(1);
  }
  return t;
}

/** US customary / cooking conversions (ml, g). */
const ML_PER_TSP = 4.928_921_593_75;
const ML_PER_TBSP = 14.786_764_781_25;
const ML_PER_CUP = 236.588_236_5;
const ML_PER_FLOZ = 29.573_529_562_5;
const G_PER_OZ = 28.349_523_125;
const G_PER_LB = 453.592_37;

type MeasureKind = "count" | "volume_ml" | "mass_g";

type ParsedMeasure = {
  kind: MeasureKind;
  /** ml per one `ingredient.amount` before servings factor (volume). */
  mlPerAmount?: number;
  /** g per one `ingredient.amount` before servings factor (mass). */
  gPerAmount?: number;
};

const UNIT_TO_ML_PER_UNIT: Record<string, number> = {
  tsp: ML_PER_TSP,
  teaspoon: ML_PER_TSP,
  teaspoons: ML_PER_TSP,
  tbsp: ML_PER_TBSP,
  tablespoon: ML_PER_TBSP,
  tablespoons: ML_PER_TBSP,
  tbs: ML_PER_TBSP,
  cup: ML_PER_CUP,
  cups: ML_PER_CUP,
  c: ML_PER_CUP,
  floz: ML_PER_FLOZ,
  "fl oz": ML_PER_FLOZ,
  "fluid oz": ML_PER_FLOZ,
  "fluid ounce": ML_PER_FLOZ,
  "fluid ounces": ML_PER_FLOZ,
  ml: 1,
  milliliter: 1,
  milliliters: 1,
  millilitre: 1,
  millilitres: 1,
  l: 1000,
  liter: 1000,
  liters: 1000,
  litre: 1000,
  litres: 1000,
};

const UNIT_TO_G_PER_UNIT: Record<string, number> = {
  g: 1,
  gram: 1,
  grams: 1,
  kg: 1000,
  kilogram: 1000,
  kilograms: 1000,
  oz: G_PER_OZ,
  ounce: G_PER_OZ,
  ounces: G_PER_OZ,
  lb: G_PER_LB,
  lbs: G_PER_LB,
  pound: G_PER_LB,
  pounds: G_PER_LB,
};

const NAME_UNIT_PREFIX =
  /^(teaspoons|teaspoon|tablespoons|tablespoon|cups|cup)\s+(.+)$/i;

function normalizeUnitKey(raw: string | undefined): string | undefined {
  if (raw === undefined) {
    return;
  }
  const trimmed = raw.trim();
  if (trimmed === "T") {
    return "tbsp";
  }
  const k = trimmed.toLowerCase();
  return k.length > 0 ? k : undefined;
}

function parseMeasureFromIngredient(ing: RecipeIngredientItem): {
  name: string;
  measure: ParsedMeasure;
} {
  const explicit = normalizeUnitKey(ing.unit);
  if (explicit) {
    const ml = UNIT_TO_ML_PER_UNIT[explicit];
    if (ml !== undefined) {
      return {
        name: ing.name,
        measure: { kind: "volume_ml", mlPerAmount: ml },
      };
    }
    const g = UNIT_TO_G_PER_UNIT[explicit];
    if (g !== undefined) {
      return {
        name: ing.name,
        measure: { kind: "mass_g", gPerAmount: g },
      };
    }
  }

  const m = ing.name.match(NAME_UNIT_PREFIX);
  if (m) {
    const word = m[1].toLowerCase();
    const rest = m[2];
    let mlPerAmount: number | undefined;
    if (word === "teaspoon" || word === "teaspoons") {
      mlPerAmount = ML_PER_TSP;
    } else if (word === "tablespoon" || word === "tablespoons") {
      mlPerAmount = ML_PER_TBSP;
    } else if (word === "cup" || word === "cups") {
      mlPerAmount = ML_PER_CUP;
    }
    if (mlPerAmount !== undefined) {
      return {
        name: rest,
        measure: { kind: "volume_ml", mlPerAmount },
      };
    }
  }

  return { name: ing.name, measure: { kind: "count" } };
}

function formatMetricVolume(totalMl: number): string {
  if (totalMl >= 1000) {
    return `${formatAmount(totalMl / 1000)} L`;
  }
  return `${formatAmount(totalMl)} ml`;
}

function formatMetricMass(totalG: number): string {
  if (totalG >= 1000) {
    return `${formatAmount(totalG / 1000)} kg`;
  }
  return `${formatAmount(totalG)} g`;
}

function formatUSVolume(totalMl: number): string {
  if (totalMl >= ML_PER_CUP * 0.2) {
    const cups = totalMl / ML_PER_CUP;
    const label = Math.abs(cups - 1) < 1e-6 ? "cup" : "cups";
    return `${formatAmount(cups)} ${label}`;
  }
  if (totalMl >= ML_PER_TBSP * 0.25) {
    const tbsp = totalMl / ML_PER_TBSP;
    return `${formatAmount(tbsp)} tbsp`;
  }
  const tsp = totalMl / ML_PER_TSP;
  return `${formatAmount(tsp)} tsp`;
}

function formatUSMass(totalG: number): string {
  if (totalG >= G_PER_LB * 0.5) {
    const lb = totalG / G_PER_LB;
    const label = Math.abs(lb - 1) < 1e-6 ? "lb" : "lbs";
    return `${formatAmount(lb)} ${label}`;
  }
  const oz = totalG / G_PER_OZ;
  return `${formatAmount(oz)} oz`;
}

function formatIngredientForDisplay(
  ing: RecipeIngredientItem,
  factor: number,
  unitSystem: UnitSystem
) {
  if (unitSystem === "as_written") {
    const a = formatAmount(ing.amount * factor);
    if (ing.unit) {
      return `${a} ${ing.unit} ${ing.name}`.trim();
    }
    return `${a} ${ing.name}`.trim();
  }

  const { name, measure } = parseMeasureFromIngredient(ing);
  const scaled = ing.amount * factor;

  if (measure.kind === "count") {
    const a = formatAmount(scaled);
    if (ing.unit) {
      return `${a} ${ing.unit} ${name}`.trim();
    }
    return `${a} ${name}`.trim();
  }

  if (measure.kind === "volume_ml") {
    const totalMl = scaled * (measure.mlPerAmount ?? 0);
    if (unitSystem === "metric") {
      return `${formatMetricVolume(totalMl)} ${name}`.trim();
    }
    return `${formatUSVolume(totalMl)} ${name}`.trim();
  }

  const totalG = scaled * (measure.gPerAmount ?? 0);
  if (unitSystem === "metric") {
    return `${formatMetricMass(totalG)} ${name}`.trim();
  }
  return `${formatUSMass(totalG)} ${name}`.trim();
}

function formatTime(totalSec: number): string {
  const s = Math.max(0, Math.floor(totalSec));
  const m = Math.floor(s / 60);
  const r = s % 60;
  return `${String(m).padStart(2, "0")}:${String(r).padStart(2, "0")}`;
}

function buildSubstitutionMap(
  ingredients: RecipeIngredientItem[],
  factor: number,
  unitSystem: UnitSystem
) {
  const m = new Map<string, string>();
  for (const ing of ingredients) {
    m.set(ing.id, formatIngredientForDisplay(ing, factor, unitSystem));
  }
  return m;
}

function resolvePlaceholders(
  content: string,
  substitutions: Map<string, string>
) {
  return content.replace(/\{([0-9a-zA-Z_]+)\}/g, (full, id: string) => {
    const r = substitutions.get(id);
    return r === undefined ? full : r;
  });
}

type InlineTimerPillProps = {
  labelId: string;
  initialSeconds: number;
};

function InlineTimerPill({ labelId, initialSeconds }: InlineTimerPillProps) {
  const [running, setRunning] = useState(false);
  const [remaining, setRemaining] = useState(initialSeconds);

  useEffect(() => {
    setRemaining(initialSeconds);
  }, [initialSeconds]);

  useEffect(() => {
    if (!running) {
      return;
    }
    if (remaining <= 0) {
      setRunning(false);
      return;
    }
    const t = setInterval(() => {
      setRemaining((r) => {
        if (r <= 1) {
          setRunning(false);
          return 0;
        }
        return r - 1;
      });
    }, 1000);
    return () => clearInterval(t);
  }, [running, remaining]);

  const onClick = () => {
    if (remaining === 0) {
      setRemaining(initialSeconds);
    }
    setRunning((r) => !r);
  };

  return (
    <button
      aria-controls={labelId}
      aria-label={running ? "Pause timer" : "Start timer"}
      className="relative top-px inline-flex items-center gap-1 rounded-full bg-muted px-1.5 text-muted-foreground text-sm transition-colors ease-out hover:bg-secondary"
      onClick={onClick}
      type="button"
    >
      {running ? (
        <Pause aria-hidden className="size-3 shrink-0" />
      ) : (
        <Play aria-hidden className="size-3 shrink-0" />
      )}
      <span className="tabular-nums" id={labelId}>
        {formatTime(remaining)}
      </span>
    </button>
  );
}

function stepTitleForDisplay(title: string) {
  const t = title.trim();
  if (t.endsWith(":")) {
    return t;
  }
  return `${t}:`;
}

export type ClaudeRecipeToolProps = {
  recipe?: Partial<RecipeData>;
  onGetCooking?: () => void;
  top?: ReactNode;
  className?: string;
};

function mergeRecipeData(recipe: Partial<RecipeData> | undefined): RecipeData {
  if (recipe === undefined) {
    return DEFAULT_RECIPE_DATA;
  }
  return {
    ...DEFAULT_RECIPE_DATA,
    ...recipe,
    title: recipe.title ?? DEFAULT_RECIPE_DATA.title,
    description: recipe.description ?? DEFAULT_RECIPE_DATA.description,
    base_servings: recipe.base_servings ?? DEFAULT_RECIPE_DATA.base_servings,
    ingredients: recipe.ingredients ?? DEFAULT_RECIPE_DATA.ingredients,
    steps: recipe.steps ?? DEFAULT_RECIPE_DATA.steps,
    notes: recipe.notes ?? DEFAULT_RECIPE_DATA.notes,
    images:
      recipe.images === undefined ? DEFAULT_RECIPE_DATA.images : recipe.images,
    web_results_caption:
      recipe.web_results_caption === undefined
        ? DEFAULT_RECIPE_DATA.web_results_caption
        : recipe.web_results_caption,
    web_results_href: recipe.web_results_href ?? WEB_RESULTS_HREF,
  };
}

const iconBtnClass =
  "inline-flex h-8 w-8 shrink-0 select-none items-center justify-center rounded-md text-muted-foreground transition-colors ease-out focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-inset focus-visible:ring-primary disabled:opacity-40 hover:bg-muted hover:text-foreground";

export function ClaudeRecipeTool({
  recipe: recipeProp,
  onGetCooking,
  top,
  className,
}: ClaudeRecipeToolProps) {
  const data = mergeRecipeData(recipeProp);
  const {
    title,
    description,
    base_servings,
    ingredients,
    steps,
    notes,
    images = [],
  } = data;
  const webResultsCaption = data.web_results_caption;
  const webResultsHref = data.web_results_href ?? WEB_RESULTS_HREF;
  const hasGallery = images.length > 0;

  const [servings, setServings] = useState(base_servings);
  const [unitSystem, setUnitSystem] = useState<UnitSystem>("as_written");
  const [copied, setCopied] = useState(false);
  const stepTimerIdBase = useId();

  useEffect(() => {
    setServings(base_servings);
  }, [base_servings]);

  const factor = servings / base_servings;
  const substitutions = buildSubstitutionMap(ingredients, factor, unitSystem);

  const buildPlainText = useCallback(() => {
    const f = servings / base_servings;
    const sub = buildSubstitutionMap(ingredients, f, unitSystem);
    const ing = ingredients
      .map((i) => formatIngredientForDisplay(i, f, unitSystem))
      .join("\n");
    const st = steps
      .map((s) => {
        const body = resolvePlaceholders(s.content, sub);
        const after = s.content_after
          ? resolvePlaceholders(s.content_after, sub)
          : "";
        const timePart = s.timer_seconds
          ? ` [${formatTime(s.timer_seconds)}]`
          : "";
        return `${stepTitleForDisplay(s.title)} ${body}${timePart}${after ? ` ${after}` : ""}`;
      })
      .join("\n\n");
    return `${title}\n\n${description}\n\nINGREDIENTS\n${ing}\n\nSTEPS\n${st}\n\nNOTES\n${notes}`;
  }, [
    base_servings,
    description,
    ingredients,
    notes,
    servings,
    steps,
    title,
    unitSystem,
  ]);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(buildPlainText());
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handlePrint = () => {
    window.print();
  };

  const decServings = () => setServings((n) => Math.max(1, n - 1));
  const incServings = () => setServings((n) => n + 1);

  return (
    <div
      className={cn(
        "w-full max-w-2xl rounded-2xl border border-border/80 bg-background p-5 text-foreground",
        className
      )}
    >
      {top ? <div className="mb-4">{top}</div> : null}

      {hasGallery ? (
        <>
          <ul
            aria-label={`${title} photos`}
            className="mb-4 flex snap-x snap-mandatory list-none gap-2 overflow-x-auto p-0 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
          >
            {images.map((img, i) => (
              <li className="shrink-0 snap-start" key={`${img.src}-${i}`}>
                <button
                  aria-label={`View full image: ${img.alt}`}
                  className="relative h-60 w-[280px] cursor-pointer overflow-hidden rounded-xl bg-muted text-left focus:outline-none focus-visible:ring-1 focus-visible:ring-primary focus-visible:ring-inset"
                  type="button"
                >
                  <NextImage
                    alt={img.alt}
                    className="h-full w-full object-cover"
                    height={240}
                    loading={i > 0 ? "lazy" : "eager"}
                    priority={i === 0}
                    referrerPolicy="no-referrer"
                    src={img.src}
                    unoptimized={img.src.startsWith("http://")}
                    width={280}
                  />
                  <span className="pointer-events-none absolute right-1 bottom-1 z-10 flex items-center justify-center rounded-full bg-foreground/30 px-2.5 py-1 text-[8px] text-white">
                    Image: {img.credit}
                  </span>
                </button>
              </li>
            ))}
          </ul>
          {webResultsCaption ? (
            <div className="-mt-2.5 mb-4 text-right font-sans text-[12px] leading-tight">
              <Link
                className="text-muted-foreground underline-offset-2 hover:underline"
                href={webResultsHref}
                rel="noopener noreferrer"
                target="_blank"
              >
                {webResultsCaption}
              </Link>
            </div>
          ) : null}
        </>
      ) : null}

      <div className="mb-4">
        <h2 className="mb-1 text-balance font-bold text-foreground text-lg">
          {title}
        </h2>
        <p className="text-pretty text-muted-foreground text-sm">
          {description}
        </p>
      </div>

      <div className="mb-4 flex flex-col gap-3 md:flex-row md:items-center md:gap-2">
        <div className="flex items-center gap-2">
          <span className="text-muted-foreground text-sm">Servings</span>
          <div className="flex items-center rounded-full border border-border px-1">
            <button
              aria-label="Decrease servings"
              className="flex h-7 w-5 items-center justify-center text-muted-foreground transition-colors ease-out hover:text-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary disabled:cursor-not-allowed disabled:opacity-40"
              disabled={servings <= 1}
              onClick={decServings}
              type="button"
            >
              <Minus className="size-3" />
            </button>
            <span
              aria-live="polite"
              className="px-1 text-center font-medium text-foreground text-sm tabular-nums"
            >
              {servings}
            </span>
            <button
              aria-label="Increase servings"
              className="flex h-7 w-5 items-center justify-center text-muted-foreground transition-colors ease-out hover:text-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary"
              onClick={incServings}
              type="button"
            >
              <Plus className="size-3" />
            </button>
          </div>
        </div>

        <div aria-hidden className="hidden flex-1 md:block" />

        <div className="flex items-center gap-1">
          <div className="w-fit">
            <DropdownMenu>
              <DropdownMenuTrigger
                aria-label="Change units"
                className={iconBtnClass}
                type="button"
              >
                <Ruler aria-hidden className="size-5" />
              </DropdownMenuTrigger>
              <DropdownMenuContent
                align="start"
                className="w-40 rounded-xl border p-1 shadow-md"
                sideOffset={6}
              >
                <DropdownMenuRadioGroup
                  onValueChange={(v) => setUnitSystem(v as UnitSystem)}
                  value={unitSystem}
                >
                  <DropdownMenuRadioItem
                    className="min-h-8 text-xs"
                    value="as_written"
                  >
                    As written
                  </DropdownMenuRadioItem>
                  <DropdownMenuRadioItem className="min-h-8 text-xs" value="us">
                    US
                  </DropdownMenuRadioItem>
                  <DropdownMenuRadioItem
                    className="min-h-8 text-xs"
                    value="metric"
                  >
                    Metric
                  </DropdownMenuRadioItem>
                </DropdownMenuRadioGroup>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
          <div className="w-fit">
            <button
              aria-label="Print"
              className={iconBtnClass}
              onClick={handlePrint}
              type="button"
            >
              <Printer aria-hidden className="size-5" />
            </button>
          </div>
          <div className="w-fit">
            <button
              aria-label="Copy"
              className={iconBtnClass}
              onClick={handleCopy}
              type="button"
            >
              {copied ? (
                <Check aria-hidden className="size-5 text-emerald-600" />
              ) : (
                <Copy aria-hidden className="size-5" />
              )}
            </button>
          </div>
          <button
            className="backface-hidden ml-1 inline-flex h-8 min-w-16 shrink-0 select-none items-center justify-center rounded-md border border-transparent bg-primary px-3 font-semibold text-primary-foreground text-xs transition-[transform,box-shadow,opacity] duration-150 ease-out will-change-transform hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/40"
            onClick={onGetCooking}
            type="button"
          >
            Get cooking
          </button>
        </div>
      </div>

      <section className="mb-8">
        <h3 className="mb-3 font-medium text-muted-foreground text-xs uppercase">
          Ingredients
        </h3>
        <ul className="space-y-1 text-foreground text-sm leading-relaxed">
          {ingredients.map((i) => (
            <li key={i.id}>
              <span>{formatIngredientForDisplay(i, factor, unitSystem)}</span>
            </li>
          ))}
        </ul>
      </section>

      <section className="mb-8">
        <h3 className="mb-4 font-medium text-muted-foreground text-xs uppercase">
          Steps
        </h3>
        <div className="flex flex-col gap-4">
          {steps.map((s, index) => {
            const n = index + 1;
            const resolved = resolvePlaceholders(s.content, substitutions);
            const resolvedAfter = s.content_after
              ? resolvePlaceholders(s.content_after, substitutions)
              : "";
            return (
              <div className="flex items-start gap-3" key={s.id}>
                <button
                  aria-label="Mark as complete"
                  className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full border border-border text-muted-foreground text-xs transition-colors hover:border-primary focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary focus-visible:ring-inset"
                  type="button"
                >
                  {n}
                </button>
                <div className="min-w-0 text-foreground text-sm leading-relaxed">
                  <span className="font-semibold text-foreground">
                    {stepTitleForDisplay(s.title)}
                  </span>{" "}
                  {resolved}
                  {s.timer_seconds === undefined ? null : (
                    <>
                      {" "}
                      <InlineTimerPill
                        initialSeconds={s.timer_seconds}
                        labelId={`${stepTimerIdBase}-${s.id}`}
                      />
                    </>
                  )}
                  {resolvedAfter}
                </div>
              </div>
            );
          })}
        </div>
      </section>

      <section className="mt-8 rounded-xl bg-muted p-5">
        <h3 className="mb-2 font-medium text-muted-foreground text-xs uppercase">
          Notes
        </h3>
        <div className="text-muted-foreground text-sm leading-relaxed [&_em]:italic [&_li]:my-0.5 [&_ol]:my-1 [&_ol]:list-decimal [&_ol]:pl-4 [&_p:first-child]:mt-0 [&_p:last-child]:mb-0 [&_p]:my-1 [&_strong]:font-semibold [&_ul]:my-1 [&_ul]:list-disc [&_ul]:pl-4">
          <p>{notes}</p>
        </div>
      </section>
    </div>
  );
}

export { DEFAULT_RECIPE_DATA };
