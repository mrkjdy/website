import { Filter } from "../routes/blogs/index.tsx";

type BlogTagLinksProps = {
  tags: string[];
};

export default ({ tags }: BlogTagLinksProps) => (
  <>
    {tags.map((tag, index) => {
      const params = new URLSearchParams({ [Filter.TAG]: tag });
      const href = `/blogs?${params.toString()}`;
      return (
        <>
          <a href={href} class="underline">{tag}</a>
          {index + 1 < tags.length && " · "}
        </>
      );
    })}
  </>
);
