import { basename, extname } from "$std/path/mod.ts";
import { createExtractor } from "./markdown.ts";
import { parse } from "$std/yaml/parse.ts";
import { Format, Parser } from "$std/front_matter/mod.ts";
import { isRecord } from "./helper.ts";
import { customRender } from "../components/Markdown.tsx";
import { IS_BROWSER } from "$fresh/runtime.ts";

type PostAttrs = {
  title: string;
  date: string;
  tags: string[];
  description: string;
  coverPhoto: string;
};

const extractPostAttrs = (attrs: Record<string, unknown>): PostAttrs => {
  if (!isRecord(attrs)) {
    throw new Error(
      `Post attributes must be a Record. Received a ${typeof attrs}`,
    );
  }
  let { title, date, coverPhoto, tags, description } = attrs;
  if (typeof title !== "string") {
    throw new Error("Post front matter must have a title of type string");
  }
  if (typeof date !== "string") {
    throw new Error("Post front matter must have a date of type string");
  }
  if (typeof description !== "string") {
    throw new Error("Post front matter must have a description of type string");
  }
  if (typeof coverPhoto !== "string") {
    throw new Error("Post front matter must have an image of type string");
  }
  tags ??= [];
  if (!Array.isArray(tags)) {
    throw new Error("Post front matter tags must be an array");
  }
  if (!tags.every((tag): tag is string => typeof tag === "string")) {
    throw new Error("Post front matter tags may only be an array of strings");
  }
  return { title, date, coverPhoto, tags, description };
};

export type Post = Omit<PostAttrs, "date"> & {
  html: string;
  minutesToRead: number;
  href: string;
  date: Date;
  formattedDate: string;
  markdown: string;
};

const createPost = (
  postAttrs: PostAttrs,
  templateMarkdown: string,
  postPath: string,
): Post => {
  const href = `/posts/${postPath}`;
  const [html, markdown] = customRender(templateMarkdown, {
    assetPrefix: `${href}/`,
  });
  const numberOfWords = html
    .replace(/<(?:.|\n)*?>/gm, "") // Remove html tags
    .trim() // Remove whitespace from beginning and end
    .split(/\s+/) // Split text on whitespace into an array of words
    .length;
  const wordsPerMinute = 200;
  const minutesToRead = Math.ceil(numberOfWords / wordsPerMinute);
  const date = new Date(postAttrs.date);
  const formattedDate = date.toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
  const coverPhoto = `/images/${postPath}/${postAttrs.coverPhoto}`;
  return {
    ...postAttrs,
    href,
    html,
    minutesToRead,
    date, // Overwrite the date with a Date object
    coverPhoto, // Overwrite the relative coverPhoto path
    formattedDate,
    markdown,
  };
};

const POSTS_DIR_PATH = "./static/posts/";

export const postMap = new Map<string, Post>();

const extractYaml = createExtractor({ [Format.YAML]: parse as Parser });

if (!IS_BROWSER) { // So that islands work
  for await (const dirEntry of Deno.readDir(POSTS_DIR_PATH)) {
    const { name: filename } = dirEntry;
    if (dirEntry.isFile && filename.endsWith(".md")) {
      const postPath = `${POSTS_DIR_PATH}${filename}`;
      const fileContents = await Deno.readTextFile(postPath);
      const postBasename = basename(filename, extname(filename));
      const { attrs, body: templateMarkdown } = extractYaml(fileContents);
      const postAttrs = extractPostAttrs(attrs);
      const post = createPost(postAttrs, templateMarkdown, postBasename);
      postMap.set(postBasename, post);
    }
  }
}

export const postArray = [...postMap.values()];
