import { Handlers, PageProps } from "$fresh/server.ts";
import { Head } from "$fresh/runtime.ts";
import Markdown from "../../components/Markdown.tsx";
import { getPostMap, Post } from "../../utils/posts.ts";
import PostTagLinks from "../../components/PostTagLinks.tsx";
import TableOfContents from "../../components/TableOfContents.tsx";
import { TITLE } from "../_app.tsx";
import Picture from "../../components/Picture.tsx";

export const handler: Handlers<Post> = {
  GET: async (_, ctx) => {
    const { name } = ctx.params;
    const postMap = await getPostMap();
    const post = postMap.get(name);
    if (post === undefined) {
      return ctx.renderNotFound();
    }
    return ctx.render(post);
  },
};

export default ({ data: post }: PageProps<Post>) => {
  const metaDescription = `\
Category: post, \
Author: Mark Judy, \
Post title: ${post.title}, \
Post tags: ${post.tags}, \
Published: ${post.formattedDate}, \
Post description: ${post.description}, \
Minutes to read: ${post.minutesToRead}`;
  return (
    <>
      <Head>
        <title key="title">{`${TITLE} | ${post.title}`}</title>
        <meta name="description" content={metaDescription} />
      </Head>
      <article class="w-full max-w-[min(65ch,calc(100%-2rem))] flex flex-col space-y-[1rem]">
        <h1 class="text-4xl font-bold">{post.title}</h1>
        <div class="flex flex-col space-y-[0.25rem]">
          <Picture
            avifSrc={post.cover.avifSrc}
            jpegSrc={post.cover.jpegSrc}
            alt={post.cover.alt}
            width={post.cover.width}
            height={post.cover.height}
          />
          {post.cover.caption !== undefined && (
            <p class="italic text-sm">{post.cover.caption}</p>
          )}
        </div>
        <p class="flex space-x-4">
          <span>{post.formattedDate}</span>
          <span>{`${post.minutesToRead} minute read`}</span>
          <span>
            <PostTagLinks tags={post.tags} />
          </span>
        </p>
        <TableOfContents headings={post.headings} />
        <Markdown html={post.html} />
      </article>
    </>
  );
};
