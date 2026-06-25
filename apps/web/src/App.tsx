import { PantrySignals } from "@/components/pantry-signals";
import { RemixForm } from "@/components/remix-form";

export function App() {
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

          <RemixForm />
        </div>

        <PantrySignals />
      </section>
    </main>
  );
}
