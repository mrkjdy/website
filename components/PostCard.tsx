import PostTagLinks from "./PostTagLinks.tsx";
import { Post } from "../utils/posts.ts";
import Picture from "./Picture.tsx";

export default (post: Post) => (
  <div class="dark:bg-[#161B22] rounded-md border border-[#30363d] p-4 flex flex-col space-y-[1rem]">
    <a
      class="flex md:justify-between items-start flex-col space-y-[1rem] md:flex-row md:space-x-[1rem] md:space-y-0"
      href={post.href}
    >
      <div class="flex flex-col space-y-[1rem] md:max-w-[calc(100%-17rem)]">
        <h2 class="text-3xl">{post.title}</h2>
        <p>{post.description}</p>
      </div>
      <Picture
        avifSrc={post.cover.avifSrc}
        jpegSrc={post.cover.jpegSrc}
        alt={post.cover.alt}
        width={post.cover.width}
        height={post.cover.height}
        class="w-[12rem] h-[12rem] object-cover"
      />
    </a>
    <div class="flex flex-col space-y-[0.5rem] md:flex-row md:space-x-[1rem] md:space-y-0">
      <span>{post.formattedDate}</span>
      <span>{`${post.minutesToRead} minute read`}</span>
      <span>
        <PostTagLinks tags={post.tags} />
      </span>
    </div>
  </div>
);
