import { parse, Renderer } from "https://esm.sh/marked@10.0.0";

type Header = {
  text: string;
  level: number;
  escapedText: string;
};

type TableOfContentsProps = {
  markdown: string;
};

export default ({ markdown }: TableOfContentsProps) => {
  const renderer = new Renderer({ gfm: true });
  const headers: Header[] = [];
  renderer.heading = (text, level) => {
    const escapedText = text.toLowerCase().replace(/[^\w]+/g, "-");
    headers.push({ text, level, escapedText });
    return "";
  };
  parse(markdown, { renderer });
  return (
    <nav aria-label="Table of Contents">
      <h3 class="font-bold">Contents</h3>
      <ul class="list-disc list-inside">
        {headers.map((header) => (
          <li>
            <a href={`#${header.escapedText}`} class="underline">
              {header.text}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
};
