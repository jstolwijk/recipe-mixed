import type { Config } from "tailwindcss";

export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        basil: "#2f6f4e",
        ink: "#20201d",
        paper: "#faf8f2",
        saffron: "#f2b84b",
        tomato: "#d94b35"
      }
    }
  },
  plugins: []
} satisfies Config;

