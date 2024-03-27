import { z } from "$zod";

export const headingSchema = z.object({
  text: z.string(),
  level: z.number(),
  href: z.string(),
});

export type Heading = z.infer<typeof headingSchema>;

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
