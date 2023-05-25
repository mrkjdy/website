import { BlogTagLinks, sortBlogs } from "./blogs/index.tsx";
import { blogArray } from "../utils/blogs.ts";
import { Sort } from "../islands/BlogIndexForm.tsx";

const sortedBlogs = sortBlogs(blogArray, Sort.NEWEST);

const latestThree = sortedBlogs.slice(0, 3);

export default () => (
  <div class="w-full max-w-[min(65ch,calc(100%-2rem))]">
    <div class="text-center">
      Hi 👋
      <br />
      <br />
      Welcome to my website! I'll probably post blogs here about programming and
      other things like cooking, and anything else that I find interesting. I
      might even make some interactive content here too!
      <br />
      - Mark Judy
    </div>
    <br />
    <h1 class="text-4xl font-bold">Latest Blogs</h1>
    <br />
    <div class="space-y-4">
      {latestThree.map((blog) => (
        <div class="dark:bg-[#161B22] rounded-md border border-[#30363d] p-4">
          <h2>
            <a class="text-3xl" href={blog.href}>{blog.title}</a>
          </h2>
          <br />
          <div class="flex space-x-4">
            <span>{blog.formattedDate}</span>
            <span>{`${blog.minutesToRead} minute read`}</span>
            <span>
              <BlogTagLinks tags={blog.tags} />
            </span>
          </div>
          <br />
          <p>{blog.description}</p>
          <br />
          <a href={blog.href}>Read more</a>
        </div>
      ))}
    </div>
  </div>
);
