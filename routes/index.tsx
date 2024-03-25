import { sortPosts } from "./posts/index.tsx";
import { Sort } from "../islands/PostIndexForm.tsx";
import PostCard from "../components/PostCard.tsx";
import { getPostArray, Post } from "../utils/posts.ts";
import { Handlers, PageProps } from "$fresh/server.ts";
import { Head } from "$fresh/runtime.ts";
import { TITLE } from "./_app.tsx";

type IndexData = {
  latestPosts: Post[];
};

export const handler: Handlers<IndexData> = {
  GET: async (_, ctx) => {
    const posts = await getPostArray();
    const sortedPosts = sortPosts(posts, Sort.NEWEST);
    const latestPosts = sortedPosts.slice(0, 3);
    return await ctx.render({ latestPosts });
  },
};

export default ({ data: { latestPosts } }: PageProps<IndexData>) => (
  <>
    <Head>
      <title key="title">{`${TITLE} | Home`}</title>
    </Head>
    <div class="w-full max-w-[min(65ch,calc(100%-2rem))] flex flex-col space-y-[1rem]">
      <p class="text-center">Hi 👋</p>
      <p class="text-left">
        Welcome to my website! I'll probably write about programming, cooking,
        and other things that I find interesting. I may even add some
        interactive content here too!
      </p>
      <p class="text-right">- Mark Judy</p>
      <h1 class="text-4xl font-bold">Latest Posts</h1>
      <div class="space-y-[1rem]">
        {latestPosts.map((post) => <PostCard {...post} />)}
      </div>
    </div>
  </>
);
