import { Options } from "$fresh/plugins/twind.ts";
import { apply } from "twind";
import * as colors from "twind/colors";

export default {
  selfURL: import.meta.url,
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
    body:
      apply`text-black dark:text-white font-sans bg-white dark:bg-[#0d1117]`,
    "::-webkit-scrollbar": apply`w-3 h-3`,
    "::-webkit-scrollbar-thumb": apply`bg-gray-300 dark:bg-gray-700`,
    "::-webkit-scrollbar-thumb:hover": apply`bg-gray-400 dark:bg-gray-600`,
  },
} satisfies Options;
