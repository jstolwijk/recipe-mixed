import { WandSparkles } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { sampleRecipeText } from "@/data/sample-recipe";

export function RemixForm() {
  return (
    <Card>
      <CardContent className="grid gap-4 p-4">
        <form className="grid gap-4">
          <div className="grid gap-2">
            <Label htmlFor="recipe">Original recipe</Label>
            <Textarea
              className="min-h-44 resize-y bg-paper text-base"
              defaultValue={sampleRecipeText}
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
  );
}
