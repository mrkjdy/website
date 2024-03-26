import PostTagLinks from "./PostTagLinks.tsx";
import { Post } from "../utils/posts.ts";
import Picture from "./Picture.tsx";

export default (post: Post) => (
  <div class="dark:bg-[#161B22] rounded-md border border-[#30363d] p-4 flex flex-col space-y-[1rem]">
    <a
      class="flex justify-between items-start space-x-[1rem]"
      href={post.href}
    >
      <div class="flex flex-col space-y-[1rem] max-w-[calc(100%-(20ch+1rem))]">
        <h2 class="text-3xl">{post.title}</h2>
        <p>{post.description}</p>
      </div>
      <Picture
        avifSrc={post.cover.avifSrc}
        jpegSrc={post.cover.jpegSrc}
        alt={post.cover.alt}
        width={post.cover.width}
        height={post.cover.height}
        class="w-[20ch] h-[20ch] object-cover"
      />
    </a>
    <div class="flex space-x-[1rem]">
      <span>{post.formattedDate}</span>
      <span>{`${post.minutesToRead} minute read`}</span>
      <span>
        <PostTagLinks tags={post.tags} />
      </span>
    </div>
  </div>
);
