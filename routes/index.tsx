import { sortPosts } from "./posts/index.tsx";
import { postArray } from "../utils/posts.ts";
import { Sort } from "../islands/PostIndexForm.tsx";
import PostCard from "../components/PostCard.tsx";

const sortedPosts = sortPosts(postArray, Sort.NEWEST);

const latestThree = sortedPosts.slice(0, 3);

export default () => (
  <div class="w-full max-w-[min(65ch,calc(100%-2rem))] flex flex-col space-y-[1rem]">
    <p class="text-center">Hi 👋</p>
    <p class="text-left">
      Welcome to my website! I'll probably write about programming, cooking, and
      other things that I find interesting. I may even add some interactive
      content here too!
    </p>
    <p class="text-right">- Mark Judy</p>
    <h1 class="text-4xl font-bold">Latest Posts</h1>
    <div class="space-y-[1rem]">
      {latestThree.map((post) => <PostCard {...post} />)}
    </div>
  </div>
);
