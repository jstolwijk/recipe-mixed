import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { sampleIngredients } from "@/data/sample-recipe";

export function PantrySignals() {
  return (
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
  );
}
