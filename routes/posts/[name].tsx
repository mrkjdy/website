import { Handlers, PageProps } from "$fresh/server.ts";
import { asset, Head } from "$fresh/runtime.ts";
import Markdown from "../../components/Markdown.tsx";
import { Post, postMap } from "../../utils/posts.ts";
import PostTagLinks from "../../components/PostTagLinks.tsx";
import TableOfContents from "../../components/TableOfContents.tsx";

export const handler: Handlers<Post> = {
  GET: (_, ctx) => {
    const { name } = ctx.params;
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
        <meta name="description" content={metaDescription} />
      </Head>
      <article class="w-full max-w-[min(65ch,calc(100%-2rem))] flex flex-col space-y-[1rem]">
        <h1 class="text-4xl font-bold">{post.title}</h1>
        <img
          src={asset(post.cover.staticPath)}
          alt={post.cover.alt}
          width={post.cover?.width}
          height={post.cover?.height}
        />
        {post.cover.caption !== undefined && (
          <p class="italic text-sm">{post.cover.caption}</p>
        )}
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
