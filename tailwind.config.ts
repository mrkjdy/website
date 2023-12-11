import { type Config } from "tailwindcss";

export default {
  content: [
    "{routes,islands,components}/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["IBM Plex Sans", "sans-serif"],
        serif: ["IBM Plex Serif", "serif"],
        mono: ["IBM Plex Mono", "monospace"],
      },
    },
  },
} satisfies Config;
