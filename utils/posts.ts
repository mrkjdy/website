import { createExtractor } from "./markdown.ts";
import { parse as parseYaml } from "$std/yaml/parse.ts";
import { Parser } from "$std/front_matter/mod.ts";
import { customRender } from "../components/Markdown.tsx";
import { Heading } from "../components/TableOfContents.tsx";
import { DOMParser } from "https://deno.land/x/deno_dom@v0.1.45/deno-dom-wasm.ts";
import { imageSize } from "image-size";
import { z } from "$zod";

const postAttributesSchema = z.object({
  title: z.string(),
  date: z.string(),
  tags: z.array(z.string()),
  description: z.string(),
  cover: z.object({
    name: z.string().default("cover.png"),
    alt: z.string().default("Cover"),
    caption: z.string().optional(),
  }).default({ name: "cover.png", alt: "Cover" }),
});

type PostAttributes = z.infer<typeof postAttributesSchema>;

type PostImage = {
  staticPath: string;
  alt: string;
  caption: string | undefined;
  width: number | undefined;
  height: number | undefined;
};

type OverwrittenPostAttributes = {
  cover: PostImage;
  date: Date;
};

export type Post =
  & Omit<PostAttributes, keyof OverwrittenPostAttributes>
  & OverwrittenPostAttributes
  & {
    html: string;
    minutesToRead: number;
    href: string;
    formattedDate: string;
    markdown: string;
    headings: Heading[];
  };

const _createPost = (
  postAttrs: PostAttributes,
  templateMarkdown: string,
  postBasename: string,
): Post => {
  const href = `/posts/${postBasename}`;
  const [html, markdown] = customRender(templateMarkdown, {
    assetPrefix: `${href}/`,
  });
  const numberOfWords = markdown.split(/\s+/).length;
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
  const headings = [...headingElements].map((headingElement): Heading => {
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
  });
  const coverStaticPath = `/posts/${postBasename}/${postAttrs.cover.name}`;
  const coverDimensions = imageSize(`./static${coverStaticPath}`);
  return {
    ...postAttrs,
    // Overwritten fields
    cover: {
      staticPath: coverStaticPath,
      alt: postAttrs.cover.alt,
      caption: postAttrs.cover.caption,
      width: coverDimensions?.width,
      height: coverDimensions?.height,
    },
    date,
    // Additional fields
    href,
    html,
    minutesToRead,
    formattedDate,
    markdown,
    headings,
  };
};

const _POSTS_DIR_PATH = "./static/posts";
const _POST_FILE_NAME = "post.md";

export const postMap = new Map<string, Post>();

const _extractYaml = createExtractor({ "yaml": parseYaml as Parser });

// for await (const postDir of Deno.readDir(POSTS_DIR_PATH)) {
//   if (!postDir.isDirectory) {
//     continue;
//   }
//   const postBasename = postDir.name;
//   for await (
//     const postFile of Deno.readDir(`${POSTS_DIR_PATH}/${postBasename}`)
//   ) {
//     if (postFile.name !== POST_FILE_NAME) {
//       continue;
//     }
//     const postFilePath = `${POSTS_DIR_PATH}/${postBasename}/${POST_FILE_NAME}`;
//     const postContents = await Deno.readTextFile(postFilePath);
//     const { attrs, body: templateMarkdown } = extractYaml(postContents);
//     const postAttrs = postAttributesSchema.parse(attrs);
//     const post = createPost(postAttrs, templateMarkdown, postBasename);
//     postMap.set(postBasename, post);
//   }
// }

export const postArray = [...postMap.values()];
