import React from "react";
import ReactDOM from "react-dom/client";
import {
  AlertTriangle,
  ArrowRight,
  CheckCircle2,
  ChefHat,
  Clipboard,
  ExternalLink,
  History,
  LoaderCircle,
  RotateCcw,
  Save,
  Share2,
  Sparkles,
  WandSparkles
} from "lucide-react";
import "./styles.css";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

type RemixDirection = "french" | "chinese" | "mexican" | "pantry" | "vegetarian";
type FlowStep = "draft" | "importing" | "generating" | "review";
type SourceMode = "paste" | "link";
type CompareView = "original" | "remix" | "changes";
type ChangeKind = "kept" | "changed" | "added" | "removed" | "optional";

type Recipe = {
  source: SourceMode;
  sourceUrl: string | null;
  rawText: string;
  title: string;
  ingredients: string[];
  steps: string[];
  servings: string;
  timing: string;
  notes: string[];
  missingFields: string[];
};

type RecipeChange = {
  kind: ChangeKind;
  section: "ingredient" | "technique" | "timing" | "note";
  label: string;
  detail: string;
};

type SanityNote = {
  level: "ok" | "watch" | "missing";
  label: string;
  detail: string;
};

type RemixResult = {
  id: string;
  title: string;
  summary: string;
  directionLabel: string;
  servings: string;
  timing: string;
  ingredients: Array<{ text: string; change: ChangeKind }>;
  steps: Array<{ text: string; change: ChangeKind }>;
  notes: string[];
  changes: RecipeChange[];
  sanity: SanityNote[];
  settings: RemixSettings;
  versionNote: string;
};

type RemixSettings = {
  direction: RemixDirection;
  skillLevel: string;
  timeLimit: string;
  spiceLevel: string;
  diet: string;
  pantryItems: string;
  adjustments: string[];
  customAdjustment: string;
};

type SavedRemix = {
  id: string;
  savedAt: string;
  original: Recipe;
  remix: RemixResult;
  sharePath: string;
};

const defaultRecipe = `Creamy tomato pasta

Servings: 4
Total time: 35 minutes

Ingredients
- 400g rigatoni
- 2 cups crushed tomatoes
- 1/2 cup cream
- basil
- parmesan

Steps
1. Simmer tomatoes with cream.
2. Cook pasta until al dente.
3. Toss pasta with sauce, basil, and parmesan.

Notes
Keep sauce loose with pasta water.`;

const importedFallback = `Sheet Pan Lemon Chicken

Servings: 4
Total time: 40 minutes

Ingredients
- 6 chicken thighs
- 1 pound potatoes
- 1 lemon
- 3 cloves garlic
- olive oil
- parsley

Steps
1. Heat oven to 425°F.
2. Toss potatoes with oil, lemon, garlic, and salt.
3. Roast chicken and potatoes until chicken reaches 165°F.
4. Rest five minutes and finish with parsley.

Notes
Use thermometer for doneness.`;

const directionCopy: Record<
  RemixDirection,
  {
    label: string;
    titlePrefix: string;
    summary: string;
    ingredientAdds: string[];
    ingredientSwaps: string[];
    technique: string;
    note: string;
  }
> = {
  french: {
    label: "French-inspired",
    titlePrefix: "Provençal",
    summary: "Herb-forward, savory, and finished with a little bistro polish.",
    ingredientAdds: ["herbes de Provence", "Dijon mustard", "gruyere"],
    ingredientSwaps: ["butter or olive oil for richer finish", "parsley or tarragon for fresh herbs"],
    technique: "Finish under broiler or with a pan sauce for browned, glossy edges.",
    note: "Inspired by French flavors; not framed as traditional."
  },
  chinese: {
    label: "Chinese-inspired",
    titlePrefix: "Scallion-Soy",
    summary: "Savory, glossy, and aromatic with gentle umami depth.",
    ingredientAdds: ["scallions", "soy sauce", "sesame oil"],
    ingredientSwaps: ["miso or stock for creaminess", "ginger-garlic base for fresh herbs"],
    technique: "Bloom aromatics first, then toss ingredients through sauce right before serving.",
    note: "Inspired by Chinese pantry flavors; not framed as traditional."
  },
  mexican: {
    label: "Mexican-inspired",
    titlePrefix: "Chile-Lime",
    summary: "Bright, smoky, and punchy without burying the source recipe.",
    ingredientAdds: ["lime", "cumin", "roasted poblano"],
    ingredientSwaps: ["cotija for hard cheese", "cilantro for basil or parsley"],
    technique: "Char or toast one element for smoky depth, then finish with lime.",
    note: "Inspired by Mexican flavors; not framed as traditional."
  },
  pantry: {
    label: "Weeknight pantry",
    titlePrefix: "One-Pot",
    summary: "Same comfort, fewer dishes, and no specialty shopping.",
    ingredientAdds: ["garlic powder", "canned beans", "shelf-stable broth"],
    ingredientSwaps: ["pantry herbs for fresh herbs", "hard cheese or nuts for garnish"],
    technique: "Collapse prep into one pot or one tray where cooking times still make sense.",
    note: "Uses shelf-stable substitutions where possible."
  },
  vegetarian: {
    label: "Vegetarian dinner",
    titlePrefix: "Garden",
    summary: "Vegetables, dairy or legumes, and crunch make the meal feel complete.",
    ingredientAdds: ["roasted peppers", "spinach", "toasted almonds"],
    ingredientSwaps: ["beans or mushrooms for meat", "ricotta or yogurt for creamy body"],
    technique: "Add vegetables in stages so watery ingredients reduce before finishing.",
    note: "Checks protein and texture so it eats like dinner."
  }
};

const skillOptions = ["Beginner-friendly", "Confident home cook", "Tight weeknight"];
const spiceOptions = ["Mild", "Medium", "Hot"];
const dietOptions = ["No extra diet", "Vegetarian", "Dairy-light", "Gluten-light"];
const quickAdjustments = ["Less spicy", "Faster", "Simpler", "Vegetarian", "Use pantry items"];
const stepLabels: Array<{ key: FlowStep | "saved"; label: string }> = [
  { key: "draft", label: "Input" },
  { key: "importing", label: "Import" },
  { key: "generating", label: "Generate" },
  { key: "review", label: "Review" },
  { key: "saved", label: "Save" }
];

function cleanListItem(line: string) {
  return line.replace(/^[-*•]\s*/, "").replace(/^\d+[.)]\s*/, "").trim();
}

function safeJsonParse<T>(value: string | null, fallback: T): T {
  if (!value) {
    return fallback;
  }

  try {
    return JSON.parse(value) as T;
  } catch {
    return fallback;
  }
}

function extractSection(lines: string[], names: string[]) {
  const values: string[] = [];
  let active = false;

  for (const line of lines) {
    const normalized = line.replace(/:$/, "").toLowerCase();
    const isAnyHeading = /^(ingredients?|steps?|directions?|method|instructions?|notes?)$/i.test(
      normalized
    );

    if (names.includes(normalized)) {
      active = true;
      continue;
    }

    if (active && isAnyHeading) {
      active = false;
      continue;
    }

    if (active) {
      const item = cleanListItem(line);
      if (item) {
        values.push(item);
      }
    }
  }

  return values;
}

function normalizeRecipe(text: string, source: SourceMode, sourceUrl: string | null): Recipe {
  const lines = text
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean);
  const title =
    lines.find((line) => !/^(serves?|servings?|yield|total|prep|cook|ingredients?|steps?|directions?|method|instructions?|notes?)/i.test(line)) ??
    (sourceUrl ? new URL(sourceUrl).hostname.replace(/^www\./, "") : "Untitled recipe");
  const servings =
    text.match(/\b(?:serves?|servings?|yield)\s*:?\s*([^\n]+)/i)?.[1]?.trim() ?? "Not specified";
  const timing =
    text.match(/\b(?:total|prep|cook)\s*time\s*:?\s*([^\n]+)/i)?.[1]?.trim() ??
    text.match(/\b(\d+\s*(?:minutes?|mins?|hours?|hrs?))\b/i)?.[1] ??
    "Not specified";
  const ingredients = extractSection(lines, ["ingredient", "ingredients"]).slice(0, 12);
  const steps = extractSection(lines, ["step", "steps", "direction", "directions", "method", "instruction", "instructions"]).slice(0, 8);
  const notes = extractSection(lines, ["note", "notes"]).slice(0, 4);
  const missingFields = [
    title ? "" : "title",
    ingredients.length ? "" : "ingredients",
    steps.length ? "" : "steps",
    servings === "Not specified" ? "servings" : "",
    timing === "Not specified" ? "timing" : ""
  ].filter(Boolean);

  return {
    source,
    sourceUrl,
    rawText: text,
    title,
    ingredients,
    steps,
    servings,
    timing,
    notes,
    missingFields
  };
}

function formatMinutes(value: string) {
  const minutes = Number.parseInt(value, 10);
  return Number.isFinite(minutes) && minutes > 0 ? `${minutes} minutes` : "Flexible timing";
}

function buildSanityNotes(recipe: Recipe, remix: RemixResult): SanityNote[] {
  const notes: SanityNote[] = [];

  if (!remix.ingredients.length || !remix.steps.length) {
    notes.push({
      level: "missing",
      label: "Core fields missing",
      detail: "Result needs ingredients and steps before cooking."
    });
  }

  if (recipe.missingFields.length) {
    notes.push({
      level: "watch",
      label: "Source parse incomplete",
      detail: `Original recipe missing ${recipe.missingFields.join(", ")}. Review before cooking.`
    });
  }

  if (/chicken|pork|beef|fish|egg/i.test(remix.ingredients.map((ingredient) => ingredient.text).join(" "))) {
    notes.push({
      level: "watch",
      label: "Doneness check",
      detail: "Use a thermometer or visual doneness cue for animal proteins."
    });
  }

  if (!/\d/.test(remix.timing)) {
    notes.push({
      level: "watch",
      label: "Timing uncertain",
      detail: "Timing is estimated; cook to texture and doneness."
    });
  }

  if (!notes.length) {
    notes.push({
      level: "ok",
      label: "Basic cookability check passed",
      detail: "Has title, servings, timing, ingredients, steps, and practical notes."
    });
  }

  return notes;
}

function makeLocalRemix(recipe: Recipe, settings: RemixSettings, versionNote = "Generated locally"): RemixResult {
  const direction = directionCopy[settings.direction];
  const baseIngredients = recipe.ingredients.length
    ? recipe.ingredients.slice(0, 5)
    : ["main ingredient", "salt", "cooking oil"];
  const addedIngredients = [
    ...direction.ingredientAdds.slice(0, 2),
    ...(settings.pantryItems ? settings.pantryItems.split(",").map((item) => item.trim()).filter(Boolean).slice(0, 2) : [])
  ];
  const timeTarget = formatMinutes(settings.timeLimit);
  const title = `${direction.titlePrefix} ${recipe.title}`;
  const customNote = settings.customAdjustment.trim();
  const activeAdjustments = [
    ...settings.adjustments,
    ...(customNote ? [customNote] : []),
    settings.diet !== "No extra diet" ? settings.diet : ""
  ].filter(Boolean);
  const ingredients = [
    ...baseIngredients.map((ingredient, index) => ({
      text: index < 2 ? ingredient : `${ingredient} (adjusted for ${direction.label.toLowerCase()})`,
      change: index < 2 ? ("kept" as const) : ("changed" as const)
    })),
    ...addedIngredients.map((ingredient) => ({ text: ingredient, change: "added" as const }))
  ];
  const steps = [
    {
      text: `Prep original core ingredients, keeping enough structure from ${recipe.title}.`,
      change: "kept" as const
    },
    {
      text: `${direction.technique} Keep heat moderate and taste before adding salt.`,
      change: "changed" as const
    },
    {
      text: `Finish for ${settings.spiceLevel.toLowerCase()} spice and ${settings.skillLevel.toLowerCase()} pacing.`,
      change: "added" as const
    }
  ];
  const result: RemixResult = {
    id: crypto.randomUUID(),
    title,
    summary: `${direction.summary} Target: ${timeTarget}. ${
      activeAdjustments.length ? `Adjustment: ${activeAdjustments.join(", ")}.` : direction.note
    }`,
    directionLabel: direction.label,
    servings: recipe.servings,
    timing: timeTarget,
    ingredients,
    steps,
    notes: [
      direction.note,
      "If sauce tightens or pan dries, add water or stock a splash at a time.",
      activeAdjustments.length ? `Applied: ${activeAdjustments.join(", ")}.` : "No follow-up adjustments yet."
    ],
    changes: [
      {
        kind: "changed",
        section: "ingredient",
        label: "Flavor base",
        detail: `${direction.ingredientSwaps[0]} while keeping main ingredients recognizable.`
      },
      {
        kind: "added",
        section: "ingredient",
        label: "New accents",
        detail: addedIngredients.length ? addedIngredients.join(", ") : direction.ingredientAdds.join(", ")
      },
      {
        kind: "changed",
        section: "technique",
        label: "Method",
        detail: direction.technique
      },
      {
        kind: "changed",
        section: "timing",
        label: "Time target",
        detail: `Adjusted to fit about ${timeTarget}.`
      }
    ],
    sanity: [],
    settings,
    versionNote
  };

  return {
    ...result,
    sanity: buildSanityNotes(recipe, result)
  };
}

async function postJson<TResponse>(path: string, payload: unknown): Promise<TResponse | null> {
  try {
    const response = await fetch(path, {
      body: JSON.stringify(payload),
      headers: { "Content-Type": "application/json" },
      method: "POST"
    });

    if (!response.ok) {
      return null;
    }

    return (await response.json()) as TResponse;
  } catch {
    return null;
  }
}

async function importRecipeFromUrl(sourceUrl: string): Promise<Recipe> {
  const apiRecipe = await postJson<Partial<Recipe>>("/api/recipes/import", { url: sourceUrl });
  if (apiRecipe?.rawText) {
    return {
      ...normalizeRecipe(apiRecipe.rawText, "link", sourceUrl),
      ...apiRecipe,
      source: "link",
      sourceUrl
    };
  }

  return normalizeRecipe(importedFallback, "link", sourceUrl);
}

async function generateRemix(recipe: Recipe, settings: RemixSettings): Promise<RemixResult> {
  const apiRemix = await postJson<RemixResult>("/api/remixes", { recipe, settings });
  if (apiRemix?.title && apiRemix.ingredients?.length && apiRemix.steps?.length) {
    return {
      ...apiRemix,
      settings,
      sanity: apiRemix.sanity?.length ? apiRemix.sanity : buildSanityNotes(recipe, apiRemix)
    };
  }

  return makeLocalRemix(recipe, settings);
}

function buildCopyText(recipe: Recipe, remix: RemixResult) {
  const source = recipe.sourceUrl ? `\nSource: ${recipe.sourceUrl}` : "";

  return `${remix.title}
${remix.directionLabel} remix of ${recipe.title}${source}

Servings: ${remix.servings}
Time: ${remix.timing}

Ingredients
${remix.ingredients.map((ingredient) => `- ${ingredient.text}`).join("\n")}

Steps
${remix.steps.map((step, index) => `${index + 1}. ${step.text}`).join("\n")}

Notes
${remix.notes.map((note) => `- ${note}`).join("\n")}

What changed
${remix.changes.map((change) => `- ${change.label}: ${change.detail}`).join("\n")}`;
}

function App() {
  const [sourceMode, setSourceMode] = React.useState<SourceMode>("paste");
  const [sourceUrl, setSourceUrl] = React.useState("");
  const [recipeText, setRecipeText] = React.useState(defaultRecipe);
  const [recipe, setRecipe] = React.useState(() => normalizeRecipe(defaultRecipe, "paste", null));
  const [settings, setSettings] = React.useState<RemixSettings>({
    adjustments: [],
    customAdjustment: "",
    diet: dietOptions[0],
    direction: "french",
    pantryItems: "",
    skillLevel: skillOptions[1],
    spiceLevel: spiceOptions[0],
    timeLimit: "35"
  });
  const [remix, setRemix] = React.useState<RemixResult | null>(null);
  const [priorRemixes, setPriorRemixes] = React.useState<RemixResult[]>([]);
  const [savedRemixes, setSavedRemixes] = React.useState<SavedRemix[]>(() =>
    safeJsonParse<SavedRemix[]>(window.localStorage.getItem("recipe-mixer-remixes"), [])
  );
  const [step, setStep] = React.useState<FlowStep>("draft");
  const [compareView, setCompareView] = React.useState<CompareView>("remix");
  const [status, setStatus] = React.useState("");
  const [error, setError] = React.useState("");

  const isBusy = step === "importing" || step === "generating";
  const direction = directionCopy[settings.direction];
  const draftRecipe = React.useMemo(
    () => normalizeRecipe(recipeText, sourceMode, sourceMode === "link" ? sourceUrl || null : null),
    [recipeText, sourceMode, sourceUrl]
  );
  const activeRecipe = step === "draft" ? draftRecipe : recipe;
  const recipeWordCount = recipeText.trim().split(/\s+/).filter(Boolean).length;
  const savedCurrent = Boolean(remix && savedRemixes.some((saved) => saved.remix.id === remix.id));

  function updateSettings(patch: Partial<RemixSettings>) {
    setSettings((current) => ({ ...current, ...patch }));
  }

  async function importLink() {
    setError("");
    setStatus("");

    try {
      new URL(sourceUrl);
    } catch {
      setError("Enter full recipe URL, including https://.");
      return;
    }

    setSourceMode("link");
    setStep("importing");
    const importedRecipe = await importRecipeFromUrl(sourceUrl);
    setRecipe(importedRecipe);
    setRecipeText(importedRecipe.rawText);
    setStep("draft");
    setStatus("Imported with local fallback when API unavailable.");
  }

  async function startRemix(event?: React.FormEvent<HTMLFormElement>, override?: RemixSettings) {
    event?.preventDefault();
    setError("");
    setStatus("");

    const nextRecipe =
      sourceMode === "paste" ? normalizeRecipe(recipeText, "paste", null) : normalizeRecipe(recipeText, "link", sourceUrl || null);

    if (nextRecipe.rawText.trim().length < 80) {
      setError("Recipe looks short. Add ingredients and steps, or import from link first.");
      return;
    }

    setRecipe(nextRecipe);
    setStep("generating");
    const nextSettings = override ?? settings;
    const nextRemix = await generateRemix(nextRecipe, nextSettings);
    setPriorRemixes((current) => (remix ? [remix, ...current].slice(0, 3) : current));
    setRemix(nextRemix);
    setStep("review");
    setCompareView("remix");
    setStatus(nextRemix.versionNote);
  }

  async function applyAdjustment(adjustment: string) {
    const nextAdjustments = settings.adjustments.includes(adjustment)
      ? settings.adjustments.filter((item) => item !== adjustment)
      : [...settings.adjustments, adjustment];
    const nextSettings = { ...settings, adjustments: nextAdjustments };
    setSettings(nextSettings);

    if (remix) {
      await startRemix(undefined, nextSettings);
    }
  }

  async function submitCustomAdjustment(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!settings.customAdjustment.trim() || !remix) {
      return;
    }
    await startRemix(undefined, settings);
  }

  async function copyRemix() {
    if (!remix) {
      return;
    }

    try {
      await navigator.clipboard.writeText(buildCopyText(recipe, remix));
      setStatus("Copied clean cooking format.");
    } catch {
      setStatus("Copy failed. Select recipe text and copy manually.");
    }
  }

  function saveRemix() {
    if (!remix) {
      return;
    }

    const saved: SavedRemix = {
      id: crypto.randomUUID(),
      original: recipe,
      remix,
      savedAt: new Date().toISOString(),
      sharePath: `#remix-${remix.id}`
    };
    const nextSaved = [saved, ...savedRemixes.filter((item) => item.remix.id !== remix.id)].slice(0, 8);
    setSavedRemixes(nextSaved);
    window.localStorage.setItem("recipe-mixer-remixes", JSON.stringify(nextSaved));
    setStatus("Saved in this browser.");
  }

  async function shareRemix() {
    if (!remix) {
      return;
    }

    const text = buildCopyText(recipe, remix);
    const shareUrl = `${window.location.origin}${window.location.pathname}#remix-${remix.id}`;

    if (navigator.share) {
      await navigator.share({ text, title: remix.title, url: shareUrl });
      setStatus("Share sheet opened.");
      return;
    }

    await navigator.clipboard.writeText(`${shareUrl}\n\n${text}`);
    setStatus("Share link and recipe copied.");
  }

  function openSaved(saved: SavedRemix) {
    setRecipe(saved.original);
    setRecipeText(saved.original.rawText);
    setSourceMode(saved.original.source);
    setSourceUrl(saved.original.sourceUrl ?? "");
    setSettings(saved.remix.settings);
    setRemix(saved.remix);
    setStep("review");
    setCompareView("remix");
    setStatus(`Opened saved remix from ${new Date(saved.savedAt).toLocaleDateString()}.`);
  }

  return (
    <main className="min-h-screen bg-background text-foreground">
      <section className="mx-auto grid w-full max-w-7xl gap-6 px-4 py-5 sm:px-6 lg:grid-cols-[280px_minmax(0,1fr)] lg:px-8">
        <aside className="space-y-4 lg:sticky lg:top-5 lg:self-start">
          <div className="flex items-center gap-3">
            <div className="grid h-11 w-11 place-items-center rounded-md bg-primary text-primary-foreground">
              <ChefHat aria-hidden="true" className="h-5 w-5" />
            </div>
            <div>
              <p className="text-sm font-semibold uppercase text-accent">Recipe Mixer</p>
              <h1 className="text-2xl font-black leading-tight">Remix studio</h1>
            </div>
          </div>

          <Card>
            <CardHeader className="p-4">
              <CardTitle className="text-base">Flow</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-3 p-4 pt-0">
              {stepLabels.map((item, index) => {
                const isActive = item.key === step || (item.key === "saved" && savedCurrent);
                const isComplete =
                  (item.key === "draft" && step !== "draft") ||
                  (item.key === "importing" && sourceMode === "link" && recipe.sourceUrl !== null) ||
                  (item.key === "generating" && step === "review") ||
                  (item.key === "review" && savedCurrent) ||
                  (item.key === "saved" && savedCurrent);

                return (
                  <div className="flex items-center gap-3" key={item.key}>
                    <div
                      className={`grid h-8 w-8 shrink-0 place-items-center rounded-md border text-sm font-bold ${
                        isActive || isComplete
                          ? "border-primary bg-primary text-primary-foreground"
                          : "border-border bg-card text-muted-foreground"
                      }`}
                    >
                      {isComplete ? <CheckCircle2 aria-hidden="true" className="h-4 w-4" /> : index + 1}
                    </div>
                    <span className="text-sm font-medium">{item.label}</span>
                  </div>
                );
              })}
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="p-4">
              <CardTitle className="flex items-center gap-2 text-base">
                <History aria-hidden="true" className="h-4 w-4" />
                Saved
              </CardTitle>
            </CardHeader>
            <CardContent className="grid gap-2 p-4 pt-0">
              {savedRemixes.length ? (
                savedRemixes.map((saved) => (
                  <button
                    className="rounded-md border bg-paper p-3 text-left text-sm hover:bg-muted"
                    key={saved.id}
                    onClick={() => openSaved(saved)}
                    type="button"
                  >
                    <span className="block font-bold">{saved.remix.title}</span>
                    <span className="text-muted-foreground">{saved.remix.directionLabel}</span>
                  </button>
                ))
              ) : (
                <p className="text-sm text-muted-foreground">No saved remixes yet.</p>
              )}
            </CardContent>
          </Card>
        </aside>

        <div className="grid gap-5">
          <Card>
            <CardHeader className="p-4 sm:p-5">
              <CardTitle className="text-xl font-black sm:text-2xl">Start with recipe already trusted</CardTitle>
            </CardHeader>
            <CardContent className="p-4 pt-0 sm:p-5 sm:pt-0">
              <form className="grid gap-5" onSubmit={startRemix}>
                <div className="flex flex-wrap gap-2">
                  <Button
                    onClick={() => setSourceMode("paste")}
                    type="button"
                    variant={sourceMode === "paste" ? "default" : "outline"}
                  >
                    Paste
                  </Button>
                  <Button
                    onClick={() => setSourceMode("link")}
                    type="button"
                    variant={sourceMode === "link" ? "default" : "outline"}
                  >
                    Link
                  </Button>
                </div>

                {sourceMode === "link" ? (
                  <div className="grid gap-3 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-end">
                    <div className="grid gap-2">
                      <Label htmlFor="source-url">Recipe URL</Label>
                      <Input
                        id="source-url"
                        onChange={(event) => setSourceUrl(event.target.value)}
                        placeholder="https://example.com/recipe"
                        type="url"
                        value={sourceUrl}
                      />
                    </div>
                    <Button disabled={isBusy} onClick={importLink} type="button" variant="outline">
                      {step === "importing" ? <LoaderCircle aria-hidden="true" className="animate-spin" /> : <ExternalLink aria-hidden="true" />}
                      Import
                    </Button>
                  </div>
                ) : null}

                <div className="grid gap-2">
                  <Label htmlFor="recipe">Original recipe</Label>
                  <Textarea
                    className="min-h-64 resize-y bg-paper text-base leading-relaxed"
                    id="recipe"
                    onChange={(event) => setRecipeText(event.target.value)}
                    value={recipeText}
                  />
                </div>

                <div className="grid gap-4 lg:grid-cols-3">
                  <div className="grid gap-2">
                    <Label htmlFor="direction">Remix direction</Label>
                    <Select
                      onValueChange={(value) => updateSettings({ direction: value as RemixDirection })}
                      value={settings.direction}
                    >
                      <SelectTrigger className="h-11 bg-white" id="direction">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {Object.entries(directionCopy).map(([value, option]) => (
                          <SelectItem key={value} value={value}>
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="grid gap-2">
                    <Label htmlFor="skill-level">Cook profile</Label>
                    <Select onValueChange={(value) => updateSettings({ skillLevel: value })} value={settings.skillLevel}>
                      <SelectTrigger className="h-11 bg-white" id="skill-level">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {skillOptions.map((option) => (
                          <SelectItem key={option} value={option}>
                            {option}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="grid gap-2">
                    <Label htmlFor="time-limit">Time limit</Label>
                    <Input
                      id="time-limit"
                      inputMode="numeric"
                      onChange={(event) => updateSettings({ timeLimit: event.target.value })}
                      value={settings.timeLimit}
                    />
                  </div>
                </div>

                <div className="grid gap-4 lg:grid-cols-3">
                  <div className="grid gap-2">
                    <Label htmlFor="spice-level">Spice</Label>
                    <Select onValueChange={(value) => updateSettings({ spiceLevel: value })} value={settings.spiceLevel}>
                      <SelectTrigger className="h-11 bg-white" id="spice-level">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {spiceOptions.map((option) => (
                          <SelectItem key={option} value={option}>
                            {option}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="grid gap-2">
                    <Label htmlFor="diet">Diet</Label>
                    <Select onValueChange={(value) => updateSettings({ diet: value })} value={settings.diet}>
                      <SelectTrigger className="h-11 bg-white" id="diet">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {dietOptions.map((option) => (
                          <SelectItem key={option} value={option}>
                            {option}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="grid gap-2">
                    <Label htmlFor="pantry">Pantry items</Label>
                    <Input
                      id="pantry"
                      onChange={(event) => updateSettings({ pantryItems: event.target.value })}
                      placeholder="beans, spinach, rice"
                      value={settings.pantryItems}
                    />
                  </div>
                </div>

                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <div className="flex flex-wrap gap-2">
                    <Badge variant="secondary">{direction.label}</Badge>
                    <Badge variant="outline">{settings.skillLevel}</Badge>
                    <Badge variant="outline">{formatMinutes(settings.timeLimit)}</Badge>
                  </div>
                  <Button className="h-11 w-full sm:w-auto" disabled={isBusy} type="submit">
                    {step === "generating" ? <LoaderCircle aria-hidden="true" className="animate-spin" /> : <WandSparkles aria-hidden="true" />}
                    {step === "generating" ? "Mixing" : "Generate remix"}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>

          {error ? (
            <div className="rounded-md border border-destructive/40 bg-destructive/10 p-4 text-destructive" role="status">
              <div className="flex items-start gap-3">
                <AlertTriangle aria-hidden="true" className="mt-0.5 h-5 w-5 shrink-0" />
                <p className="text-sm text-foreground">{error}</p>
              </div>
            </div>
          ) : null}

          {status ? (
            <div className="rounded-md border bg-card p-3 text-sm font-medium text-primary" role="status">
              {status}
            </div>
          ) : null}

          <section className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_360px]">
            <Card>
              <CardHeader className="p-4 sm:p-5">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                  <div>
                    <p className="text-sm font-semibold uppercase text-accent">Remix result</p>
                    <CardTitle className="mt-1 text-xl font-black sm:text-2xl">
                      {remix ? remix.title : "Ready when recipe is"}
                    </CardTitle>
                  </div>
                  <Badge variant={remix ? "default" : "secondary"}>
                    {step === "generating" ? "Generating" : remix ? "Ready" : "Draft"}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="grid gap-5 p-4 pt-0 sm:p-5 sm:pt-0">
                {step === "generating" || step === "importing" ? (
                  <div className="grid min-h-80 place-items-center rounded-md border border-dashed bg-muted/60 p-6 text-center">
                    <div className="grid justify-items-center gap-3">
                      <LoaderCircle aria-hidden="true" className="h-8 w-8 animate-spin text-primary" />
                      <div>
                        <h2 className="text-lg font-bold">{step === "importing" ? "Importing recipe" : "Building cookable remix"}</h2>
                        <p className="mt-1 max-w-sm text-sm text-muted-foreground">
                          {step === "importing" ? "Trying API first, then local structured fallback." : "Checking changes, constraints, and cooking sanity."}
                        </p>
                      </div>
                    </div>
                  </div>
                ) : remix ? (
                  <>
                    <p className="text-base leading-7 text-muted-foreground">{remix.summary}</p>

                    <div className="grid gap-4 md:grid-cols-2">
                      <div className="rounded-md border bg-muted/40 p-4">
                        <h3 className="font-bold">Ingredients</h3>
                        <ul className="mt-3 grid gap-2 text-sm">
                          {remix.ingredients.map((ingredient) => (
                            <li className="grid grid-cols-[auto_minmax(0,1fr)] gap-2" key={ingredient.text}>
                              <Badge variant={ingredient.change === "kept" ? "outline" : "secondary"}>{ingredient.change}</Badge>
                              <span>{ingredient.text}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      <div className="rounded-md border bg-muted/40 p-4">
                        <h3 className="font-bold">Cook plan</h3>
                        <ol className="mt-3 grid gap-2 text-sm">
                          {remix.steps.map((recipeStep, index) => (
                            <li className="grid grid-cols-[24px_minmax(0,1fr)] gap-2" key={recipeStep.text}>
                              <span className="font-bold text-primary">{index + 1}</span>
                              <span>
                                {recipeStep.text} <Badge variant="outline">{recipeStep.change}</Badge>
                              </span>
                            </li>
                          ))}
                        </ol>
                      </div>
                    </div>

                    <div className="rounded-md border bg-paper p-4">
                      <h3 className="font-bold">Notes</h3>
                      <ul className="mt-3 grid gap-2 text-sm text-muted-foreground">
                        {remix.notes.map((note) => (
                          <li key={note}>{note}</li>
                        ))}
                      </ul>
                    </div>

                    <div className="flex flex-col gap-3 sm:flex-row">
                      <Button onClick={copyRemix} type="button" variant="outline">
                        <Clipboard aria-hidden="true" />
                        Copy
                      </Button>
                      <Button onClick={shareRemix} type="button" variant="outline">
                        <Share2 aria-hidden="true" />
                        Share
                      </Button>
                      <Button onClick={saveRemix} type="button">
                        <Save aria-hidden="true" />
                        {savedCurrent ? "Saved" : "Save remix"}
                      </Button>
                    </div>
                  </>
                ) : (
                  <div className="grid min-h-80 place-items-center rounded-md border border-dashed bg-muted/60 p-6 text-center">
                    <div className="grid max-w-sm justify-items-center gap-3">
                      <ArrowRight aria-hidden="true" className="h-8 w-8 text-primary" />
                      <h2 className="text-lg font-bold">Paste or import, choose direction, remix</h2>
                      <p className="text-sm text-muted-foreground">
                        {activeRecipe.title} can become {direction.label.toLowerCase()} in about {formatMinutes(settings.timeLimit)}.
                      </p>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            <div className="grid gap-5">
              <Card>
                <CardHeader className="p-4 sm:p-5">
                  <CardTitle className="text-lg font-black">Adjust remix</CardTitle>
                </CardHeader>
                <CardContent className="grid gap-4 p-4 pt-0 sm:p-5 sm:pt-0">
                  <div className="flex flex-wrap gap-2">
                    {quickAdjustments.map((adjustment) => (
                      <Button
                        key={adjustment}
                        onClick={() => void applyAdjustment(adjustment)}
                        type="button"
                        variant={settings.adjustments.includes(adjustment) ? "default" : "outline"}
                      >
                        <Sparkles aria-hidden="true" />
                        {adjustment}
                      </Button>
                    ))}
                  </div>
                  <form className="grid gap-2" onSubmit={(event) => void submitCustomAdjustment(event)}>
                    <Label htmlFor="custom-adjustment">Custom adjustment</Label>
                    <Input
                      id="custom-adjustment"
                      onChange={(event) => updateSettings({ customAdjustment: event.target.value })}
                      placeholder="more lemon, less cream, use rice"
                      value={settings.customAdjustment}
                    />
                    <Button disabled={!remix || isBusy} type="submit" variant="outline">
                      <RotateCcw aria-hidden="true" />
                      Update remix
                    </Button>
                  </form>
                  {priorRemixes.length ? (
                    <p className="text-sm text-muted-foreground">
                      Prior version kept: {priorRemixes[0].title}
                    </p>
                  ) : null}
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="p-4 sm:p-5">
                  <CardTitle className="text-lg font-black">Cooking sanity</CardTitle>
                </CardHeader>
                <CardContent className="grid gap-3 p-4 pt-0 sm:p-5 sm:pt-0">
                  {(remix?.sanity ?? [
                    {
                      detail: "Generate remix to check fields, timing, and obvious cooking risks.",
                      label: "Waiting for result",
                      level: "watch" as const
                    }
                  ]).map((note) => (
                    <div className="rounded-md border bg-paper p-3 text-sm" key={note.label}>
                      <div className="flex items-center gap-2 font-bold">
                        {note.level === "ok" ? (
                          <CheckCircle2 aria-hidden="true" className="h-4 w-4 text-primary" />
                        ) : (
                          <AlertTriangle aria-hidden="true" className="h-4 w-4 text-accent" />
                        )}
                        {note.label}
                      </div>
                      <p className="mt-1 text-muted-foreground">{note.detail}</p>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>

            <Card className="xl:col-span-2">
              <CardHeader className="p-4 sm:p-5">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                  <div>
                    <p className="text-sm font-semibold uppercase text-accent">Compare</p>
                    <CardTitle className="mt-1 text-lg font-black">Original vs remix</CardTitle>
                  </div>
                  <div className="flex flex-wrap gap-2 md:hidden">
                    {(["original", "remix", "changes"] as CompareView[]).map((view) => (
                      <Button
                        key={view}
                        onClick={() => setCompareView(view)}
                        size="sm"
                        type="button"
                        variant={compareView === view ? "default" : "outline"}
                      >
                        {view}
                      </Button>
                    ))}
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-4 pt-0 sm:p-5 sm:pt-0">
                <div className="grid gap-4 md:grid-cols-3">
                  <ComparePanel active={compareView === "original"} title="Original">
                    <RecipeSummary recipe={activeRecipe} wordCount={recipeWordCount} />
                  </ComparePanel>
                  <ComparePanel active={compareView === "remix"} title="Remix">
                    {remix ? <RemixSummary remix={remix} /> : <p className="text-sm text-muted-foreground">Generate remix first.</p>}
                  </ComparePanel>
                  <ComparePanel active={compareView === "changes"} title="Changes">
                    <ChangeSummary changes={remix?.changes ?? []} />
                  </ComparePanel>
                </div>
              </CardContent>
            </Card>
          </section>
        </div>
      </section>
    </main>
  );
}

function ComparePanel({
  active,
  children,
  title
}: {
  active: boolean;
  children: React.ReactNode;
  title: string;
}) {
  return (
    <div className={`${active ? "grid" : "hidden"} gap-3 rounded-md border bg-paper p-4 md:grid`}>
      <h3 className="font-bold">{title}</h3>
      {children}
    </div>
  );
}

function RecipeSummary({ recipe, wordCount }: { recipe: Recipe; wordCount: number }) {
  return (
    <div className="grid gap-3 text-sm">
      <div className="flex flex-wrap gap-2">
        <Badge variant="secondary">{wordCount} words</Badge>
        <Badge variant="outline">source: {recipe.source}</Badge>
        {recipe.sourceUrl ? <Badge variant="outline">URL preserved</Badge> : null}
      </div>
      <p className="font-bold">{recipe.title}</p>
      <p className="text-muted-foreground">
        {recipe.servings} · {recipe.timing}
      </p>
      <ListBlock items={recipe.ingredients} title="Ingredients" />
      <ListBlock items={recipe.steps} ordered title="Steps" />
      {recipe.missingFields.length ? (
        <p className="text-muted-foreground">Missing: {recipe.missingFields.join(", ")}</p>
      ) : null}
    </div>
  );
}

function RemixSummary({ remix }: { remix: RemixResult }) {
  return (
    <div className="grid gap-3 text-sm">
      <div className="flex flex-wrap gap-2">
        <Badge variant="secondary">{remix.directionLabel}</Badge>
        <Badge variant="outline">{remix.timing}</Badge>
      </div>
      <p className="font-bold">{remix.title}</p>
      <p className="text-muted-foreground">{remix.summary}</p>
      <ListBlock items={remix.ingredients.map((ingredient) => `${ingredient.text} (${ingredient.change})`)} title="Ingredients" />
      <ListBlock items={remix.steps.map((step) => `${step.text} (${step.change})`)} ordered title="Steps" />
    </div>
  );
}

function ChangeSummary({ changes }: { changes: RecipeChange[] }) {
  if (!changes.length) {
    return <p className="text-sm text-muted-foreground">Generate remix to see labeled differences.</p>;
  }

  return (
    <div className="grid gap-2 text-sm">
      {changes.map((change) => (
        <div className="rounded-md border bg-card p-3" key={`${change.label}-${change.kind}`}>
          <div className="flex flex-wrap gap-2">
            <Badge variant={change.kind === "kept" ? "outline" : "secondary"}>{change.kind}</Badge>
            <Badge variant="outline">{change.section}</Badge>
          </div>
          <p className="mt-2 font-bold">{change.label}</p>
          <p className="mt-1 text-muted-foreground">{change.detail}</p>
        </div>
      ))}
    </div>
  );
}

function ListBlock({ items, ordered = false, title }: { items: string[]; ordered?: boolean; title: string }) {
  const ListTag = ordered ? "ol" : "ul";

  return (
    <div>
      <h4 className="font-bold">{title}</h4>
      {items.length ? (
        <ListTag className={`mt-2 grid gap-1 text-muted-foreground ${ordered ? "list-decimal pl-5" : ""}`}>
          {items.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ListTag>
      ) : (
        <p className="mt-2 text-muted-foreground">Missing</p>
      )}
    </div>
  );
}

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
