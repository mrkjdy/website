import { IS_BROWSER } from "$fresh/runtime.ts";
import { Configuration, setup } from "twind";
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
    },
  },
};
if (IS_BROWSER) setup(config);
