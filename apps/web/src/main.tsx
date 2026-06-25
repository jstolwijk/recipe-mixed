import React from "react";
import ReactDOM from "react-dom/client";
import "./styles.css";

const sampleIngredients = ["rigatoni", "tomatoes", "miso", "basil", "parmesan"];

function App() {
  return (
    <main className="min-h-screen bg-paper text-ink">
      <section className="mx-auto grid min-h-screen w-full max-w-6xl gap-8 px-6 py-8 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
        <div className="space-y-8">
          <header className="space-y-3">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-tomato">
              Recipe Mixer
            </p>
            <h1 className="max-w-3xl text-5xl font-black leading-tight md:text-6xl">
              Remix a recipe without losing the cookable core.
            </h1>
          </header>

          <form className="grid gap-4 rounded-lg border border-ink/15 bg-white p-4 shadow-sm">
            <label className="grid gap-2">
              <span className="text-sm font-bold">Original recipe</span>
              <textarea
                className="min-h-44 resize-y rounded-md border border-ink/20 bg-paper p-3 text-base outline-none transition focus:border-basil focus:ring-2 focus:ring-basil/20"
                defaultValue={`Creamy tomato pasta\n\nIngredients\n- 400g rigatoni\n- 2 cups crushed tomatoes\n- 1/2 cup cream\n- basil\n\nSteps\nSimmer sauce, cook pasta, toss together.`}
              />
            </label>

            <div className="grid gap-3 sm:grid-cols-[1fr_auto] sm:items-end">
              <label className="grid gap-2">
                <span className="text-sm font-bold">Remix direction</span>
                <select className="h-11 rounded-md border border-ink/20 bg-white px-3 outline-none transition focus:border-basil focus:ring-2 focus:ring-basil/20">
                  <option>French-inspired</option>
                  <option>Chinese-inspired</option>
                  <option>Weeknight pantry</option>
                  <option>Vegetarian dinner</option>
                </select>
              </label>
              <button
                className="h-11 rounded-md bg-basil px-5 font-bold text-white transition hover:bg-ink focus:outline-none focus:ring-2 focus:ring-basil/30"
                type="button"
              >
                Start remix
              </button>
            </div>
          </form>
        </div>

        <aside className="grid gap-4 rounded-lg border border-ink/15 bg-white p-4 shadow-sm">
          <div className="aspect-[4/3] overflow-hidden rounded-md bg-[radial-gradient(circle_at_20%_20%,#f2b84b_0_12%,transparent_13%),linear-gradient(135deg,#2f6f4e,#faf8f2_48%,#d94b35)]">
            <div className="grid h-full place-items-center bg-white/30 backdrop-blur-[1px]">
              <div className="grid h-40 w-40 place-items-center rounded-full border-8 border-white bg-paper text-center text-sm font-black uppercase tracking-[0.18em] text-basil shadow-xl">
                Recipe Remix
              </div>
            </div>
          </div>
          <div>
            <h2 className="text-lg font-black">Current pantry signals</h2>
            <div className="mt-3 flex flex-wrap gap-2">
              {sampleIngredients.map((ingredient) => (
                <span
                  className="rounded-full border border-ink/15 bg-paper px-3 py-1 text-sm font-semibold"
                  key={ingredient}
                >
                  {ingredient}
                </span>
              ))}
            </div>
          </div>
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

