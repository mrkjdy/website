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
    <p class="font-bold">Contents</p>
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
