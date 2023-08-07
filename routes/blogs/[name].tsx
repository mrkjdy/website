import { Handlers, PageProps } from "$fresh/server.ts";
import { asset, Head } from "$fresh/runtime.ts";
import Markdown from "../../components/Markdown.tsx";
import { Blog, blogMap } from "../../utils/blogs.ts";
import BlogTagLinks from "../../components/BlogTagLinks.tsx";
import TableOfContents from "../../components/TableOfContents.tsx";

export const handler: Handlers<Blog> = {
  GET: (_, ctx) => {
    const { name } = ctx.params;
    const blog = blogMap.get(name);
    if (blog === undefined) {
      return ctx.renderNotFound();
    }
    return ctx.render(blog);
  },
};

export default ({ data: blog }: PageProps<Blog>) => {
  const metaDescription = `\
Category: blog, \
Author: Mark Judy, \
Blog title: ${blog.title}, \
Blog tags: ${blog.tags}, \
Published: ${blog.formattedDate}, \
Blog description: ${blog.description}, \
Minutes to read: ${blog.minutesToRead}`;
  return (
    <>
      <Head>
        <meta name="description" content={metaDescription} />
      </Head>
      <article class="w-full max-w-[min(65ch,calc(100%-2rem))]">
        <h1 class="text-4xl font-bold">{blog.title}</h1>
        <br />
        <img src={asset(blog.coverPhoto)} alt="Cover" />
        <br />
        <p class="flex space-x-4">
          <span>{blog.formattedDate}</span>
          <span>{`${blog.minutesToRead} minute read`}</span>
          <span>
            <BlogTagLinks tags={blog.tags} />
          </span>
        </p>
        <br />
        <TableOfContents markdown={blog.markdown} />
        <br />
        <Markdown html={blog.html} />
      </article>
    </>
  );
};
