export type Heading = {
  text: string;
  level: number;
  href: string;
};

type TableOfContentsProps = {
  headings: Heading[];
};

export default ({ headings }: TableOfContentsProps) => (
  <nav aria-label="Table of Contents">
    <h3 class="font-bold">Contents</h3>
    <ul class="list-disc list-inside">
      {headings.map((heading) => (
        <li>
          <a href={heading.href} class="underline">
            {heading.text}
          </a>
        </li>
      ))}
    </ul>
  </nav>
);
