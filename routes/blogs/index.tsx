import { Handlers, PageProps } from "$fresh/server.ts";
import { Blog, blogArray } from "../../utils/blogs.ts";
import { match } from "../../utils/helper.ts";
import BlogIndexForm, {
  Filter,
  Sort,
  SORT_PARAM,
} from "../../islands/BlogIndexForm.tsx";
import BlogTagLinks from "../../components/BlogTagLinks.tsx";

const sorts = Object.values(Sort);

const lowerSorts = sorts.map((sort) => sort.toLowerCase()) as Lowercase<Sort>[];

const isLowerSort = (v: unknown): v is Lowercase<Sort> =>
  typeof v === "string" && lowerSorts.includes(v as Lowercase<Sort>);

const DEFAULT_SORT = Sort.NEWEST;

const allTags = new Set(blogArray.map(({ tags }) => tags).flat());

type BlogIndexData = {
  blogs: Blog[];
  currentSort: Sort;
  tags: [tag: string, selected: boolean][];
};

export const sortBlogs = (blogsToSort: Blog[], sort: Sort): Blog[] =>
  match(sort, {
    [Sort.NEWEST]: () =>
      blogsToSort.sort((blogA, blogB) =>
        blogB.date.valueOf() - blogA.date.valueOf()
      ),
    [Sort.OLDEST]: () =>
      blogsToSort.sort((blogA, blogB) =>
        blogA.date.valueOf() - blogB.date.valueOf()
      ),
  });

export const handler: Handlers<BlogIndexData> = {
  GET: (req, ctx) => {
    const url = new URL(req.url);
    // Filter the blogs
    const passedTags = url.searchParams.getAll(Filter.TAG);
    const validTags = passedTags.filter((tag) => allTags.has(tag));
    if (passedTags.length !== validTags.length) {
      url.searchParams.delete(Filter.TAG);
      validTags.forEach((tag) => url.searchParams.append(Filter.TAG, tag));
      return Response.redirect(url);
    }
    const tagsToShowMap = new Map<string, boolean>();
    const blogsToShow: Blog[] = blogArray.filter((blog) =>
      validTags.length <= 0 ||
      validTags.every((tag) => blog.tags.includes(tag))
    );
    blogsToShow.forEach((blog) =>
      blog.tags.forEach((tag) =>
        tagsToShowMap.set(tag, validTags.includes(tag))
      )
    );
    // Sort the blogs
    const givenSort = url.searchParams.get(SORT_PARAM) ?? DEFAULT_SORT;
    const lowerSort = givenSort.toLowerCase();
    if (!isLowerSort(lowerSort)) {
      url.searchParams.delete(SORT_PARAM);
      return Response.redirect(url);
    }
    const correspondingSort = sorts[lowerSorts.indexOf(lowerSort)];
    const sortedBlogsToShow = sortBlogs(blogsToShow, correspondingSort);
    return ctx.render({
      blogs: sortedBlogsToShow,
      currentSort: correspondingSort,
      tags: [...tagsToShowMap.entries()].sort(([tagA], [tagB]) =>
        tagA.localeCompare(tagB)
      ),
    });
  },
};

export default (
  { data: { blogs, currentSort, tags } }: PageProps<BlogIndexData>,
) => (
  <div class="w-full max-w-[min(65ch,calc(100%-2rem))]">
    <div class="flex justify-between flex-col space-y-4 sm:space-y-0 sm:flex-row">
      <h1 class="text-4xl font-bold">Blogs</h1>
      <BlogIndexForm
        sorts={sorts}
        currentSort={currentSort}
        tags={tags}
      />
    </div>
    <br />
    <div class="space-y-4">
      {blogs.map((blog) => (
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
