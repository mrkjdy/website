#!/usr/bin/env -S deno run -A --watch=static/,routes/

import dev from "$fresh/dev.ts";
import { buildPosts } from "./utils/posts.ts";

await buildPosts();

const { default: config } = await import("./fresh.config.ts");

await dev(import.meta.url, "./main.ts", config);
