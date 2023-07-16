import { basename, extname } from "$std/path/mod.ts";
import { createExtractor } from "./markdown.ts";
import { parse } from "$std/yaml/parse.ts";
import { Format, Parser } from "$std/front_matter/mod.ts";
import { isRecord } from "./helper.ts";
import { customRender } from "../components/Markdown.tsx";

type BlogAttrs = {
  title: string;
  date: string;
  tags: string[];
  description: string;
  coverPhoto: string;
};

const extractBlogAttrs = (attrs: Record<string, unknown>): BlogAttrs => {
  if (!isRecord(attrs)) {
    throw new Error(
      `Blog attributes must be a Record. Received a ${typeof attrs}`,
    );
  }
  let { title, date, coverPhoto, tags, description } = attrs;
  if (typeof title !== "string") {
    throw new Error("Blog front matter must have a title of type string");
  }
  if (typeof date !== "string") {
    throw new Error("Blog front matter must have a date of type string");
  }
  if (typeof description !== "string") {
    throw new Error("Blog front matter must have a description of type string");
  }
  if (typeof coverPhoto !== "string") {
    throw new Error("Blog front matter must have an image of type string");
  }
  tags ??= [];
  if (!Array.isArray(tags)) {
    throw new Error("Blog front matter tags must be an array");
  }
  if (!tags.every((tag): tag is string => typeof tag === "string")) {
    throw new Error("Blog front matter tags may only be an array of strings");
  }
  return { title, date, coverPhoto, tags, description };
};

export type Blog = Omit<BlogAttrs, "date"> & {
  html: string;
  minutesToRead: number;
  href: string;
  date: Date;
  formattedDate: string;
};

const createBlog = async (
  blogAttrs: BlogAttrs,
  templateMarkdown: string,
  blogPath: string,
): Promise<Blog> => {
  const href = `/blogs/${blogPath}`;
  const html = await customRender(templateMarkdown, {
    assetPrefix: `${href}/`,
  });
  const numberOfWords = html
    .replace(/<(?:.|\n)*?>/gm, "") // Remove html tags
    .trim() // Remove whitespace from beginning and end
    .split(/\s+/) // Split text on whitespace into an array of words
    .length;
  const wordsPerMinute = 200;
  const minutesToRead = Math.ceil(numberOfWords / wordsPerMinute);
  const date = new Date(blogAttrs.date);
  const formattedDate = date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
  const coverPhoto = `/images/${blogPath}/${blogAttrs.coverPhoto}`;
  return {
    ...blogAttrs,
    href,
    html,
    minutesToRead,
    date, // Overwrite the date with a Date object
    coverPhoto, // Overwrite the relative coverPhoto path
    formattedDate,
  };
};

const BLOGS_DIR_PATH = "./static/blogs/";

export const blogMap = new Map<string, Blog>();

const extractYaml = createExtractor({ [Format.YAML]: parse as Parser });

for await (const dirEntry of Deno.readDir(BLOGS_DIR_PATH)) {
  if (dirEntry.isFile && dirEntry.name.endsWith(".md")) {
    const fileContents = await Deno.readTextFile(
      `${BLOGS_DIR_PATH}${dirEntry.name}`,
    );
    const blogBasename = basename(dirEntry.name, extname(dirEntry.name));
    const { attrs, body: templateMarkdown } = extractYaml(fileContents);
    const blogAttrs = extractBlogAttrs(attrs);
    const blog = await createBlog(blogAttrs, templateMarkdown, blogBasename);
    blogMap.set(blogBasename, blog);
  }
}

export const blogArray = [...blogMap.values()];
