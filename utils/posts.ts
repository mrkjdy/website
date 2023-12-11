import { basename, extname } from "$std/path/mod.ts";
import { createExtractor } from "./markdown.ts";
import { parse as parseYaml } from "$std/yaml/parse.ts";
import { Parser } from "$std/front_matter/mod.ts";
import { isRecord } from "./helper.ts";
import { customRender } from "../components/Markdown.tsx";
import { IS_BROWSER } from "$fresh/runtime.ts";

type PostAttributes = {
  title: string;
  date: string;
  tags: string[];
  description: string;
  cover: string;
  coverAltText: string | undefined;
  thumb: string;
};

const verifyPostAttributes = (
  attrs: Record<string, unknown>,
): PostAttributes => {
  if (!isRecord(attrs)) {
    throw new Error(
      `Post attributes must be a Record. Received a ${typeof attrs}`,
    );
  }
  let { title, date, cover, coverAltText, tags, description, thumb } = attrs;
  if (typeof title !== "string") {
    throw new Error("Post front matter must have a title of type string");
  }
  if (typeof date !== "string") {
    throw new Error("Post front matter must have a date of type string");
  }
  if (typeof description !== "string") {
    throw new Error("Post front matter must have a description of type string");
  }
  cover ??= "cover.png";
  if (typeof cover !== "string") {
    throw new Error("Post front matter may have an image of type string");
  }
  if (coverAltText !== undefined && typeof coverAltText !== "string") {
    throw new Error("Post front matter may have a coverAltText of type string");
  }
  thumb ??= "thumb.png";
  if (typeof thumb !== "string") {
    throw new Error("Post front matter may have an image of type string");
  }
  tags ??= [];
  if (!Array.isArray(tags)) {
    throw new Error("Post front matter tags must be an array");
  }
  if (!tags.every((tag): tag is string => typeof tag === "string")) {
    throw new Error("Post front matter tags may only be an array of strings");
  }
  return { title, date, cover, coverAltText, thumb, tags, description };
};

export type Post = Omit<PostAttributes, "date"> & {
  html: string;
  minutesToRead: number;
  href: string;
  date: Date;
  formattedDate: string;
  markdown: string;
};

const createPost = (
  postAttrs: PostAttributes,
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
  const cover = `/images/${postPath}/${postAttrs.cover}`;
  return {
    ...postAttrs,
    href,
    html,
    minutesToRead,
    date, // Overwrite the date with a Date object
    cover, // Overwrite the relative coverPhoto path
    formattedDate,
    markdown,
  };
};

const POSTS_DIR_PATH = "./static/posts/";

export const postMap = new Map<string, Post>();

const extractYaml = createExtractor({ "yaml": parseYaml as Parser });

if (!IS_BROWSER) { // So that islands work
  for await (const dirEntry of Deno.readDir(POSTS_DIR_PATH)) {
    const { name: filename } = dirEntry;
    if (dirEntry.isFile && filename.endsWith(".md")) {
      const postPath = `${POSTS_DIR_PATH}${filename}`;
      const fileContents = await Deno.readTextFile(postPath);
      const postBasename = basename(filename, extname(filename));
      const { attrs, body: templateMarkdown } = extractYaml(fileContents);
      const postAttrs = verifyPostAttributes(attrs);
      const post = createPost(postAttrs, templateMarkdown, postBasename);
      postMap.set(postBasename, post);
    }
  }
}

export const postArray = [...postMap.values()];
