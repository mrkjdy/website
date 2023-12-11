import { Filter } from "../routes/posts/index.tsx";

type PostTagLinksProps = {
  tags: string[];
};

export default ({ tags }: PostTagLinksProps) => (
  <>
    {tags.map((tag, index) => {
      const params = new URLSearchParams({ [Filter.TAG]: tag });
      const href = `/posts?${params.toString()}`;
      return (
        <>
          <a href={href} class="underline">{tag}</a>
          {index + 1 < tags.length && " · "}
        </>
      );
    })}
  </>
);
