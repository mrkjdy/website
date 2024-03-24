import { Handlers, PageProps } from "$fresh/server.ts";
import { Post, postArray } from "../../utils/posts.ts";
import { match } from "../../utils/helper.ts";
import PostIndexForm from "../../islands/PostIndexForm.tsx";
import { Filter, Sort, SORT_PARAM } from "../../islands/PostIndexForm.tsx";
import PostCard from "../../components/PostCard.tsx";

const sorts = Object.values(Sort);

const lowerSorts = sorts.map((sort) => sort.toLowerCase()) as Lowercase<Sort>[];

const isLowerSort = (v: unknown): v is Lowercase<Sort> =>
  typeof v === "string" && lowerSorts.includes(v as Lowercase<Sort>);

const DEFAULT_SORT = Sort.NEWEST;

const allTags = new Set(postArray.map(({ tags }) => tags).flat());

type PostIndexData = {
  posts: Post[];
  currentSort: Sort;
  tags: [tag: string, selected: boolean][];
};

export const sortPosts = (postsToSort: Post[], sort: Sort): Post[] =>
  match(sort, {
    [Sort.NEWEST]: () =>
      postsToSort.sort((postA, postB) =>
        postB.date.valueOf() - postA.date.valueOf()
      ),
    [Sort.OLDEST]: () =>
      postsToSort.sort((postA, postB) =>
        postA.date.valueOf() - postB.date.valueOf()
      ),
  });

export const handler: Handlers<PostIndexData> = {
  GET: (req, ctx) => {
    const url = new URL(req.url);
    // Filter the posts
    const passedTags = url.searchParams.getAll(Filter.TAG);
    const validTags = passedTags.filter((tag) => allTags.has(tag));
    if (passedTags.length !== validTags.length) {
      url.searchParams.delete(Filter.TAG);
      validTags.forEach((tag) => url.searchParams.append(Filter.TAG, tag));
      return Response.redirect(url);
    }
    const tagsToShowMap = new Map<string, boolean>();
    const postsToShow: Post[] = postArray.filter((post) =>
      validTags.length <= 0 ||
      validTags.every((tag) => post.tags.includes(tag))
    );
    postsToShow.forEach((post) =>
      post.tags.forEach((tag) =>
        tagsToShowMap.set(tag, validTags.includes(tag))
      )
    );
    // Sort the posts
    const givenSort = url.searchParams.get(SORT_PARAM) ?? DEFAULT_SORT;
    const lowerSort = givenSort.toLowerCase();
    if (!isLowerSort(lowerSort)) {
      url.searchParams.delete(SORT_PARAM);
      return Response.redirect(url);
    }
    const correspondingSort = sorts[lowerSorts.indexOf(lowerSort)];
    const sortedPostsToShow = sortPosts(postsToShow, correspondingSort);
    return ctx.render({
      posts: sortedPostsToShow,
      currentSort: correspondingSort,
      tags: [...tagsToShowMap.entries()].sort(([tagA], [tagB]) =>
        tagA.localeCompare(tagB)
      ),
    });
  },
};

export default (
  { data: { posts, currentSort, tags } }: PageProps<PostIndexData>,
) => (
  <div class="w-full max-w-[min(65ch,calc(100%-2rem))] flex flex-col space-y-[1rem]">
    <div class="flex justify-between flex-col space-y-[1rem] sm:flex-row sm:space-y-0">
      <h1 class="text-4xl font-bold">Posts</h1>
      <PostIndexForm
        sorts={sorts}
        currentSort={currentSort}
        tags={tags}
      />
    </div>
    <div class="space-y-[1rem]">
      {posts.map((post) => <PostCard {...post} />)}
    </div>
  </div>
);
