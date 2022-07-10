import { IS_BROWSER } from "$fresh/runtime.ts";
import { apply, Configuration, setup } from "twind";
import * as colors from "twind/colors";
export * from "twind";
export const config: Configuration = {
  mode: "strict",
  theme: {
    extend: {
      fontFamily: {
        sans: ["IBM Plex Sans", "sans-serif"],
        serif: ["IBM Plex Serif", "serif"],
        mono: ["IBM Plex Mono", "monospace"],
      },
      colors,
    },
  },
  preflight: {
    "@import":
      `url('https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:wght@400;700&family=IBM+Plex+Sans&family=IBM+Plex+Serif&display=swap')`,
    body: apply`text-black dark:text-white font-sans bg-white dark:bg-gray-800`,
    footer: apply`text-gray-400`,
  },
};
if (IS_BROWSER) setup(config);
