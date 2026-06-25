import React from "react";
import ReactDOM from "react-dom/client";
import {
  AlertTriangle,
  ArrowRight,
  CheckCircle2,
  ChefHat,
  Clipboard,
  LoaderCircle,
  Save,
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

type RemixDirection = "french" | "chinese" | "pantry" | "vegetarian";
type FlowStep = "draft" | "loading" | "review";

type ParsedRecipe = {
  title: string;
  ingredients: string[];
  steps: string[];
  servings: string;
  time: string;
};

const defaultRecipe = `Creamy tomato pasta

Ingredients
- 400g rigatoni
- 2 cups crushed tomatoes
- 1/2 cup cream
- basil
- parmesan

Steps
1. Simmer tomatoes with cream.
2. Cook pasta until al dente.
3. Toss pasta with sauce, basil, and parmesan.`;

const directionCopy: Record<
  RemixDirection,
  {
    label: string;
    title: string;
    summary: string;
    ingredients: string[];
    steps: string[];
    changes: string[];
  }
> = {
  french: {
    label: "French-inspired",
    title: "Provençal Tomato Pasta Gratin",
    summary: "Tomato pasta becomes a baked, herb-forward dinner with a crisp topping.",
    ingredients: [
      "Rigatoni",
      "Crushed tomatoes",
      "Herbes de Provence",
      "Garlic",
      "Gruyere",
      "Breadcrumbs"
    ],
    steps: [
      "Simmer tomatoes with garlic and herbes de Provence.",
      "Fold sauce through cooked rigatoni with a little pasta water.",
      "Top with gruyere and breadcrumbs, then broil until browned."
    ],
    changes: [
      "Cream reduced so tomato and herbs stay bright.",
      "Parmesan swapped for gruyere for a nutty baked finish.",
      "Broiler step added for texture."
    ]
  },
  chinese: {
    label: "Chinese-inspired",
    title: "Tomato Miso Noodles With Scallion Oil",
    summary: "Creamy pasta turns into glossy noodles with savory tomato-miso depth.",
    ingredients: [
      "Wheat noodles",
      "Crushed tomatoes",
      "White miso",
      "Soy sauce",
      "Scallions",
      "Sesame oil"
    ],
    steps: [
      "Bloom scallions in oil until fragrant.",
      "Simmer tomato with miso and soy sauce until glossy.",
      "Toss noodles through sauce and finish with sesame oil."
    ],
    changes: [
      "Cream replaced by miso for body without heaviness.",
      "Basil swapped for scallion oil.",
      "Sauce kept loose so noodles coat evenly."
    ]
  },
  pantry: {
    label: "Weeknight pantry",
    title: "One-Pot Tomato Pasta Skillet",
    summary: "Same comfort, fewer dishes, faster path to dinner.",
    ingredients: [
      "Short pasta",
      "Canned tomatoes",
      "Olive oil",
      "Garlic powder",
      "Shelf-stable cream",
      "Hard cheese"
    ],
    steps: [
      "Toast pasta briefly in olive oil.",
      "Add tomatoes, water, and seasoning, then simmer until tender.",
      "Stir in cream and cheese off heat."
    ],
    changes: [
      "One-pot method removes separate boiling step.",
      "Pantry seasonings replace fresh herbs.",
      "Liquid adjusted so pasta cooks in the sauce."
    ]
  },
  vegetarian: {
    label: "Vegetarian dinner",
    title: "Roasted Pepper Tomato Pasta",
    summary: "Vegetable sweetness and toasted nuts make the bowl feel complete.",
    ingredients: [
      "Rigatoni",
      "Crushed tomatoes",
      "Roasted peppers",
      "Spinach",
      "Ricotta",
      "Toasted almonds"
    ],
    steps: [
      "Blend roasted peppers into the tomato sauce.",
      "Wilt spinach into the hot pasta.",
      "Finish with ricotta and toasted almonds."
    ],
    changes: [
      "Roasted peppers add depth without meat.",
      "Spinach increases vegetable volume.",
      "Almonds add crunch and protein."
    ]
  }
};

const skillOptions = ["Beginner-friendly", "Confident home cook", "Tight weeknight"];
const stepLabels: Array<{ key: FlowStep | "saved"; label: string }> = [
  { key: "draft", label: "Input" },
  { key: "loading", label: "Generate" },
  { key: "review", label: "Review" },
  { key: "saved", label: "Save" }
];

function cleanListItem(line: string) {
  return line.replace(/^[-*•]\s*/, "").replace(/^\d+[.)]\s*/, "").trim();
}

function parseRecipeText(text: string): ParsedRecipe {
  const lines = text
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean);
  const title =
    lines.find((line) => !/^(ingredients?|steps?|directions?|method|instructions?)$/i.test(line)) ?? "";
  const servings = text.match(/\b(serves?|servings?|yield)\s*:?\s*([^\n]+)/i)?.[2]?.trim() ?? "";
  const time =
    text.match(/\b(total|prep|cook)\s*time\s*:?\s*([^\n]+)/i)?.[2]?.trim() ??
    text.match(/\b(\d+\s*(?:minutes?|mins?|hours?|hrs?))\b/i)?.[1] ??
    "";

  const ingredients: string[] = [];
  const steps: string[] = [];
  let section: "ingredients" | "steps" | null = null;

  for (const line of lines) {
    if (/^ingredients?:?$/i.test(line)) {
      section = "ingredients";
      continue;
    }

    if (/^(steps?|directions?|method|instructions?):?$/i.test(line)) {
      section = "steps";
      continue;
    }

    if (!section) {
      continue;
    }

    const item = cleanListItem(line);
    if (!item) {
      continue;
    }

    if (section === "ingredients") {
      ingredients.push(item);
    } else {
      steps.push(item);
    }
  }

  return {
    title,
    ingredients: ingredients.slice(0, 8),
    steps: steps.slice(0, 6),
    servings,
    time
  };
}

function App() {
  const [recipeName, setRecipeName] = React.useState("Creamy tomato pasta");
  const [recipeText, setRecipeText] = React.useState(defaultRecipe);
  const [direction, setDirection] = React.useState<RemixDirection>("french");
  const [skillLevel, setSkillLevel] = React.useState(skillOptions[1]);
  const [timeLimit, setTimeLimit] = React.useState("35");
  const [step, setStep] = React.useState<FlowStep>("draft");
  const [error, setError] = React.useState("");
  const [saved, setSaved] = React.useState(false);
  const [copyStatus, setCopyStatus] = React.useState("");

  const remix = directionCopy[direction];
  const canReview = step === "review";
  const parsedRecipe = React.useMemo(() => parseRecipeText(recipeText), [recipeText]);
  const recipeWordCount = recipeText.trim().split(/\s+/).filter(Boolean).length;
  const detectionCount = [
    parsedRecipe.title,
    parsedRecipe.servings,
    parsedRecipe.time,
    parsedRecipe.ingredients.length ? parsedRecipe.ingredients : "",
    parsedRecipe.steps.length ? parsedRecipe.steps : ""
  ].filter(Boolean).length;

  function buildResultText() {
    return `${remix.title}

${remix.summary}

Ingredients
${remix.ingredients.map((ingredient) => `- ${ingredient}`).join("\n")}

Steps
${remix.steps.map((recipeStep, index) => `${index + 1}. ${recipeStep}`).join("\n")}

What changed
${remix.changes.map((change) => `- ${change}`).join("\n")}`;
  }

  function proceedToRemix() {
    setCopyStatus("");
    setSaved(false);
    setError("");
    setStep("loading");
    window.setTimeout(() => {
      setStep("review");
    }, 900);
  }

  function startRemix(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (recipeText.trim().length < 80) {
      setCopyStatus("");
      setSaved(false);
      setError("This paste looks short. Add ingredients and steps for better results, or continue anyway.");
      setStep("draft");
      return;
    }

    proceedToRemix();
  }

  async function copyRemix() {
    try {
      await navigator.clipboard.writeText(buildResultText());
      setCopyStatus("Copied");
    } catch {
      setCopyStatus("Copy failed. Select the result text and copy manually.");
    }
  }

  function saveRemix() {
    const savedRemixes = JSON.parse(window.localStorage.getItem("recipe-mixer-remixes") ?? "[]");
    window.localStorage.setItem(
      "recipe-mixer-remixes",
      JSON.stringify([
        {
          detected: parsedRecipe,
          direction: remix.label,
          original: recipeName,
          originalText: recipeText,
          savedAt: new Date().toISOString(),
          title: remix.title
        },
        ...savedRemixes
      ])
    );
    setSaved(true);
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
                const isActive = item.key === step || (item.key === "saved" && saved);
                const isComplete =
                  (item.key === "draft" && step !== "draft") ||
                  (item.key === "loading" && canReview) ||
                  (item.key === "review" && saved) ||
                  (item.key === "saved" && saved);

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
        </aside>

        <div className="grid gap-5">
          <Card>
            <CardHeader className="p-4 sm:p-5">
              <CardTitle className="text-xl font-black sm:text-2xl">
                Start with recipe you already trust
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4 pt-0 sm:p-5 sm:pt-0">
              <form className="grid gap-5" onSubmit={startRemix}>
                <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_260px]">
                  <div className="grid gap-2">
                    <Label htmlFor="recipe-name">Recipe name</Label>
                    <Input
                      id="recipe-name"
                      onChange={(event) => setRecipeName(event.target.value)}
                      value={recipeName}
                    />
                  </div>

                  <div className="grid gap-2">
                    <Label htmlFor="time-limit">Time limit</Label>
                    <Input
                      id="time-limit"
                      inputMode="numeric"
                      onChange={(event) => setTimeLimit(event.target.value)}
                      value={timeLimit}
                    />
                  </div>
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="recipe">Original recipe</Label>
                  <Textarea
                    className="min-h-64 resize-y bg-paper text-base leading-relaxed"
                    id="recipe"
                    onChange={(event) => setRecipeText(event.target.value)}
                    value={recipeText}
                  />
                </div>

                <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)_auto] lg:items-end">
                  <div className="grid gap-2">
                    <Label htmlFor="direction">Remix direction</Label>
                    <Select
                      onValueChange={(value) => setDirection(value as RemixDirection)}
                      value={direction}
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
                    <Select onValueChange={setSkillLevel} value={skillLevel}>
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

                  <Button className="h-11 w-full lg:w-auto" disabled={step === "loading"} type="submit">
                    {step === "loading" ? (
                      <LoaderCircle aria-hidden="true" className="animate-spin" />
                    ) : (
                      <WandSparkles aria-hidden="true" />
                    )}
                    {step === "loading" ? "Mixing" : "Start remix"}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>

          {error ? (
            <div
              className="grid gap-3 rounded-md border border-destructive/40 bg-destructive/10 p-4 text-destructive"
              role="status"
            >
              <div className="flex items-start gap-3">
                <AlertTriangle aria-hidden="true" className="mt-0.5 h-5 w-5 shrink-0" />
                <div>
                  <h2 className="font-bold">Recipe may be incomplete</h2>
                  <p className="text-sm text-foreground">{error}</p>
                </div>
              </div>
              <div className="flex flex-col gap-2 sm:flex-row">
                <Button className="w-fit" onClick={proceedToRemix} type="button">
                  Continue anyway
                </Button>
                <Button className="w-fit" onClick={() => setError("")} type="button" variant="outline">
                  Review recipe
                </Button>
              </div>
            </div>
          ) : null}

          <section className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_360px]">
            <Card>
              <CardHeader className="p-4 sm:p-5">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                  <div>
                    <p className="text-sm font-semibold uppercase text-accent">Remix result</p>
                    <CardTitle className="mt-1 text-xl font-black sm:text-2xl">
                      {canReview ? remix.title : "Ready when recipe is"}
                    </CardTitle>
                  </div>
                  <Badge variant={canReview ? "default" : "secondary"}>
                    {step === "loading" ? "Generating" : canReview ? "Ready" : "Draft"}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="grid gap-5 p-4 pt-0 sm:p-5 sm:pt-0">
                {step === "loading" ? (
                  <div className="grid min-h-80 place-items-center rounded-md border border-dashed bg-muted/60 p-6 text-center">
                    <div className="grid justify-items-center gap-3">
                      <LoaderCircle aria-hidden="true" className="h-8 w-8 animate-spin text-primary" />
                      <div>
                        <h2 className="text-lg font-bold">Building cookable remix</h2>
                        <p className="mt-1 max-w-sm text-sm text-muted-foreground">
                          Checking flavor direction, method changes, and timing.
                        </p>
                      </div>
                    </div>
                  </div>
                ) : canReview ? (
                  <>
                    <p className="text-base leading-7 text-muted-foreground">{remix.summary}</p>

                    <div className="grid gap-4 md:grid-cols-2">
                      <div className="rounded-md border bg-muted/40 p-4">
                        <h3 className="font-bold">Ingredients</h3>
                        <ul className="mt-3 grid gap-2 text-sm">
                          {remix.ingredients.map((ingredient) => (
                            <li className="flex items-center gap-2" key={ingredient}>
                              <CheckCircle2 aria-hidden="true" className="h-4 w-4 text-primary" />
                              {ingredient}
                            </li>
                          ))}
                        </ul>
                      </div>

                      <div className="rounded-md border bg-muted/40 p-4">
                        <h3 className="font-bold">Cook plan</h3>
                        <ol className="mt-3 grid gap-2 text-sm">
                          {remix.steps.map((recipeStep, index) => (
                            <li className="grid grid-cols-[24px_minmax(0,1fr)] gap-2" key={recipeStep}>
                              <span className="font-bold text-primary">{index + 1}</span>
                              <span>{recipeStep}</span>
                            </li>
                          ))}
                        </ol>
                      </div>
                    </div>

                    <div className="flex flex-col gap-3 sm:flex-row">
                      <Button onClick={copyRemix} type="button" variant="outline">
                        <Clipboard aria-hidden="true" />
                        Copy
                      </Button>
                      <Button onClick={saveRemix} type="button">
                        <Save aria-hidden="true" />
                        Save remix
                      </Button>
                      {copyStatus || saved ? (
                        <p className="self-center text-sm font-medium text-primary">
                          {[copyStatus, saved ? "Saved" : ""].filter(Boolean).join(" · ")}
                        </p>
                      ) : null}
                    </div>
                  </>
                ) : (
                  <div className="grid min-h-80 place-items-center rounded-md border border-dashed bg-muted/60 p-6 text-center">
                    <div className="grid max-w-sm justify-items-center gap-3">
                      <ArrowRight aria-hidden="true" className="h-8 w-8 text-primary" />
                      <h2 className="text-lg font-bold">Paste, choose direction, remix</h2>
                      <p className="text-sm text-muted-foreground">
                        {recipeName} can become {remix.label.toLowerCase()} in about {timeLimit} minutes.
                      </p>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="p-4 sm:p-5">
                <CardTitle className="text-lg font-black">What changed</CardTitle>
              </CardHeader>
              <CardContent className="grid gap-4 p-4 pt-0 sm:p-5 sm:pt-0">
                <div className="flex flex-wrap gap-2">
                  <Badge variant="secondary">{remix.label}</Badge>
                  <Badge variant="outline">{skillLevel}</Badge>
                  <Badge variant="outline">{timeLimit} minutes</Badge>
                </div>

                <div className="grid gap-3">
                  {(canReview
                    ? remix.changes
                    : ["Flavor direction ready", "Timing target set", "Cook profile selected"]
                  ).map((change) => (
                    <div className="rounded-md border bg-paper p-3 text-sm" key={change}>
                      {change}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="p-4 sm:p-5">
                <CardTitle className="text-lg font-black">Detected from paste</CardTitle>
              </CardHeader>
              <CardContent className="grid gap-4 p-4 pt-0 text-sm sm:p-5 sm:pt-0">
                <div className="flex flex-wrap gap-2">
                  <Badge variant="secondary">{recipeWordCount} words</Badge>
                  <Badge variant={detectionCount ? "default" : "outline"}>
                    {detectionCount ? `${detectionCount} fields` : "No fields yet"}
                  </Badge>
                </div>

                <dl className="grid gap-3">
                  <div>
                    <dt className="font-bold">Title</dt>
                    <dd className="mt-1 text-muted-foreground">{parsedRecipe.title || "Not detected"}</dd>
                  </div>
                  <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-1">
                    <div>
                      <dt className="font-bold">Servings</dt>
                      <dd className="mt-1 text-muted-foreground">{parsedRecipe.servings || "Not detected"}</dd>
                    </div>
                    <div>
                      <dt className="font-bold">Time</dt>
                      <dd className="mt-1 text-muted-foreground">{parsedRecipe.time || "Not detected"}</dd>
                    </div>
                  </div>
                  <div>
                    <dt className="font-bold">Ingredients</dt>
                    <dd className="mt-2 grid gap-2">
                      {parsedRecipe.ingredients.length ? (
                        parsedRecipe.ingredients.map((ingredient) => (
                          <span className="rounded-md border bg-paper px-3 py-2" key={ingredient}>
                            {ingredient}
                          </span>
                        ))
                      ) : (
                        <span className="text-muted-foreground">Not detected</span>
                      )}
                    </dd>
                  </div>
                  <div>
                    <dt className="font-bold">Steps</dt>
                    <dd className="mt-2 grid gap-2">
                      {parsedRecipe.steps.length ? (
                        parsedRecipe.steps.map((recipeStep, index) => (
                          <span
                            className="grid grid-cols-[24px_minmax(0,1fr)] rounded-md border bg-paper px-3 py-2"
                            key={recipeStep}
                          >
                            <span className="font-bold text-primary">{index + 1}</span>
                            <span>{recipeStep}</span>
                          </span>
                        ))
                      ) : (
                        <span className="text-muted-foreground">Not detected</span>
                      )}
                    </dd>
                  </div>
                </dl>
              </CardContent>
            </Card>
          </section>
        </div>
      </section>
    </main>
  );
}

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
