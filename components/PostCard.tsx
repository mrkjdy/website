import PostTagLinks from "./PostTagLinks.tsx";
import { Post } from "../utils/posts.ts";
import { asset } from "$fresh/runtime.ts";

type PostCardProps = Post;

export default (props: PostCardProps) => (
  <div class="dark:bg-[#161B22] rounded-md border border-[#30363d] p-4 flex flex-col space-y-[1rem]">
    <a
      class="flex justify-between items-start space-x-[1rem]"
      href={props.href}
    >
      <div class="flex flex-col space-y-[1rem]">
        <h2 class="text-3xl">{props.title}</h2>
        <p>{props.description}</p>
      </div>
      <img
        src={asset(props.cover.staticPath)}
        alt={props.cover.alt}
        width={props.cover?.width}
        height={props.cover?.height}
        class="w-[20ch] h-[20ch] object-cover"
      />
    </a>
    <div class="flex space-x-[1rem]">
      <span>{props.formattedDate}</span>
      <span>{`${props.minutesToRead} minute read`}</span>
      <span>
        <PostTagLinks tags={props.tags} />
      </span>
    </div>
  </div>
);
