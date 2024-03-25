import { defineConfig } from "$fresh/server.ts";
import tailwind from "$fresh/plugins/tailwind.ts";
import tailwindConfig from "./tailwind.config.ts";
import { TailwindPluginOptions } from "$fresh/plugins/tailwind/types.ts";
// import { freshSEOPlugin } from "$fresh_seo";
// import manifest from "./fresh.gen.ts";
// import { postArray } from "./utils/posts.ts";

export default defineConfig({
  plugins: [
    tailwind(tailwindConfig as TailwindPluginOptions),
    // freshSEOPlugin(manifest, {
    //   include: [...postArray.map(({ href }) => href)],
    // }),
  ],
});
