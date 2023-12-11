import { defineConfig } from "$fresh/server.ts";
import tailwind from "$fresh/plugins/tailwind.ts";
import tailwindConfig from "./tailwind.config.ts";
import { TailwindPluginOptions } from "$fresh/plugins/tailwind/types.ts";

export default defineConfig({
  plugins: [tailwind(tailwindConfig as TailwindPluginOptions)],
});
