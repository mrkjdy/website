import { Sort, sortPosts } from "./posts/index.tsx";
import { postArray } from "../utils/posts.ts";
import PostTagLinks from "../components/PostTagLinks.tsx";

const sortedPosts = sortPosts(postArray, Sort.NEWEST);

const latestThree = sortedPosts.slice(0, 3);

export default () => (
  <div class="w-full max-w-[min(65ch,calc(100%-2rem))]">
    <p class="text-center">Hi 👋</p>
    <br />
    <p class="text-left">
      Welcome to my website! I'll probably write about programming, cooking, and
      other things that I find interesting. I may even add some interactive
      content here too!
    </p>
    <p class="text-right">- Mark Judy</p>
    <br />
    <h1 class="text-4xl font-bold">Latest Posts</h1>
    <br />
    <div class="space-y-4">
      {latestThree.map((post) => (
        <div class="dark:bg-[#161B22] rounded-md border border-[#30363d] p-4">
          <h2>
            <a class="text-3xl" href={post.href}>{post.title}</a>
          </h2>
          <br />
          <div class="flex space-x-4">
            <span>{post.formattedDate}</span>
            <span>{`${post.minutesToRead} minute read`}</span>
            <span>
              <PostTagLinks tags={post.tags} />
            </span>
          </div>
          <br />
          <p>{post.description}</p>
          <br />
          <a href={post.href}>Read more</a>
        </div>
      ))}
    </div>
  </div>
);
