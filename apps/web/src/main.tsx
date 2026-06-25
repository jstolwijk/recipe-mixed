import React from "react";
import ReactDOM from "react-dom/client";
import { WandSparkles } from "lucide-react";
import "./styles.css";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

const sampleIngredients = ["rigatoni", "tomatoes", "miso", "basil", "parmesan"];

function App() {
  return (
    <main className="min-h-screen bg-background text-foreground">
      <section className="mx-auto grid min-h-screen w-full max-w-6xl gap-8 px-6 py-8 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
        <div className="space-y-8">
          <header className="space-y-3">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-accent">
              Recipe Mixer
            </p>
            <h1 className="max-w-3xl text-5xl font-black leading-tight md:text-6xl">
              Remix a recipe without losing the cookable core.
            </h1>
          </header>

          <Card>
            <CardContent className="grid gap-4 p-4">
              <form className="grid gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="recipe">Original recipe</Label>
                  <Textarea
                    className="min-h-44 resize-y bg-paper text-base"
                    defaultValue={`Creamy tomato pasta\n\nIngredients\n- 400g rigatoni\n- 2 cups crushed tomatoes\n- 1/2 cup cream\n- basil\n\nSteps\nSimmer sauce, cook pasta, toss together.`}
                    id="recipe"
                  />
                </div>

                <div className="grid gap-3 sm:grid-cols-[1fr_auto] sm:items-end">
                  <div className="grid gap-2">
                    <Label htmlFor="direction">Remix direction</Label>
                    <Select defaultValue="french">
                      <SelectTrigger className="h-11 bg-white" id="direction">
                        <SelectValue placeholder="Choose direction" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="french">French-inspired</SelectItem>
                        <SelectItem value="chinese">Chinese-inspired</SelectItem>
                        <SelectItem value="pantry">Weeknight pantry</SelectItem>
                        <SelectItem value="vegetarian">Vegetarian dinner</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <Button className="h-11" type="button">
                    <WandSparkles aria-hidden="true" />
                    Start remix
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>

        <aside>
          <Card>
            <CardContent className="grid gap-4 p-4">
              <div className="aspect-[4/3] overflow-hidden rounded-md bg-[radial-gradient(circle_at_20%_20%,#f2b84b_0_12%,transparent_13%),linear-gradient(135deg,#2f6f4e,#faf8f2_48%,#d94b35)]">
                <div className="grid h-full place-items-center bg-white/30 backdrop-blur-[1px]">
                  <div className="grid h-40 w-40 place-items-center rounded-full border-8 border-white bg-paper text-center text-sm font-black uppercase tracking-[0.18em] text-basil shadow-xl">
                    Recipe Remix
                  </div>
                </div>
              </div>
              <CardHeader className="p-0">
                <CardTitle className="text-lg font-black">Current pantry signals</CardTitle>
                <div className="mt-3 flex flex-wrap gap-2">
                  {sampleIngredients.map((ingredient) => (
                    <Badge key={ingredient} variant="secondary">
                      {ingredient}
                    </Badge>
                  ))}
                </div>
              </CardHeader>
            </CardContent>
          </Card>
        </aside>
      </section>
    </main>
  );
}

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
