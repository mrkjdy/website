import { createExtractor } from "./markdown.ts";
import { parse as parseYaml } from "$std/yaml/parse.ts";
import { Parser } from "$std/front_matter/mod.ts";
import { customRender } from "../components/Markdown.tsx";
import { Heading, headingSchema } from "../components/TableOfContents.tsx";
import {
  DOMParser,
  initParser,
} from "https://deno.land/x/deno_dom@v0.1.45/deno-dom-wasm-noinit.ts";
import { z } from "$zod";
import { basename, extname } from "$std/path/mod.ts";
import { ensureFile } from "$std/fs/mod.ts";

const postAttributesSchema = z.object({
  title: z.string(),
  date: z.string(),
  tags: z.array(z.string()),
  description: z.string(),
  cover: z.object({
    alt: z.string().default("Cover"),
    caption: z.string().optional(),
  }).default({ alt: "Cover" }),
});

type PostAttributes = z.infer<typeof postAttributesSchema>;

const postSchema = postAttributesSchema.and(z.object({
  cover: z.object({
    avifSrc: z.string(),
    jpegSrc: z.string(),
    width: z.number().optional(),
    height: z.number().optional(),
  }),
  html: z.string(),
  minutesToRead: z.number(),
  href: z.string(),
  formattedDate: z.string(),
  headings: z.array(headingSchema),
}));

export type Post = z.infer<typeof postSchema>;

const createPost = async (
  postAttrs: PostAttributes,
  templateMarkdown: string,
  postBasename: string,
): Promise<Post> => {
  const href = `/posts/${postBasename}`;
  const html = customRender(templateMarkdown, {
    assetPrefix: `${href}/`,
  });
  const numberOfWords = templateMarkdown.split(/\s+/).length;
  const wordsPerMinute = 200;
  const minutesToRead = Math.ceil(numberOfWords / wordsPerMinute);
  const date = new Date(postAttrs.date);
  const formattedDate = date.toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
  const domParser = new DOMParser();
  const dom = domParser.parseFromString(html, "text/html");
  if (dom === null) {
    throw new Error("Unable to create dom");
  }
  const headingElements = dom.querySelectorAll(
    "h1, h2, h3, h4, h5, h6",
  ) as unknown as NodeListOf<HTMLHeadingElement>;
  const headings = Array.from(headingElements).map(
    (headingElement): Heading => {
      const text = headingElement.textContent;
      if (text === null) {
        throw new Error("Missing text content in heading");
      }
      const level = Number.parseInt(headingElement.tagName.slice(1), 10);
      const href = headingElement.querySelector("a")?.getAttribute("href");
      if (typeof href !== "string") {
        throw new Error("Missing href for heading element");
      }
      return { text, level, href };
    },
  );
  const coverAvifSrc = `/posts/${postBasename}/cover.avif`;
  const coverJpegSrc = `/posts/${postBasename}/cover.jpeg`;
  const { default: sharp } = await import("sharp");
  const { width: coverWidth, height: coverHeight } = await sharp(
    `./static${coverAvifSrc}`,
  ).metadata();
  return {
    ...postAttrs,
    cover: {
      ...postAttrs.cover,
      avifSrc: coverAvifSrc,
      jpegSrc: coverJpegSrc,
      width: coverWidth,
      height: coverHeight,
    },
    href,
    html,
    minutesToRead,
    formattedDate,
    headings,
  };
};

const POSTS_DIR_PATH = "./static/posts";
const POST_FILE_NAME = "post.md";
const BUILT_POSTS_DIR_PATH = "./_posts";

export const buildPosts = async () => {
  const extractYaml = createExtractor({ "yaml": parseYaml as Parser });
  await initParser();
  for await (const postDir of Deno.readDir(POSTS_DIR_PATH)) {
    if (!postDir.isDirectory) {
      continue;
    }
    const postBasename = postDir.name;
    for await (
      const postFile of Deno.readDir(`${POSTS_DIR_PATH}/${postBasename}`)
    ) {
      if (postFile.name !== POST_FILE_NAME) {
        continue;
      }
      const postFilePath =
        `${POSTS_DIR_PATH}/${postBasename}/${POST_FILE_NAME}`;
      const postContents = await Deno.readTextFile(postFilePath);
      const { attrs, body: templateMarkdown } = extractYaml(postContents);
      const postAttrs = postAttributesSchema.parse(attrs);
      const post = await createPost(postAttrs, templateMarkdown, postBasename);
      const postOutputPath = `${BUILT_POSTS_DIR_PATH}/${postBasename}.json`;
      await ensureFile(postOutputPath);
      await Deno.writeTextFile(
        postOutputPath,
        JSON.stringify(post),
      );
    }
  }
};

let postMap: Map<string, Post>;

export const getPostMap = async (): Promise<Map<string, Post>> => {
  if (postMap !== undefined) {
    return postMap;
  }
  postMap = new Map();
  // Load the pre-built posts into memory
  for await (const builtPostDirEntry of Deno.readDir(BUILT_POSTS_DIR_PATH)) {
    const { isFile, name: postFilename } = builtPostDirEntry;
    if (isFile && postFilename.endsWith(".json")) {
      const postJsonPath = `${BUILT_POSTS_DIR_PATH}/${postFilename}`;
      const postJson = await Deno.readTextFile(postJsonPath);
      const post = postSchema.parse(JSON.parse(postJson));
      const postBasename = basename(postFilename, extname(postFilename));
      postMap.set(postBasename, post);
    }
  }
  return postMap;
};

export const getPostArray = async () => [...(await getPostMap()).values()];
