import { makeHackle } from "https://deno.land/x/hackle@1.1.1/mod.ts";

const globals = globalThis as typeof globalThis & {
  hackle?: ReturnType<typeof makeHackle>;
};

globals.hackle ??= makeHackle();
