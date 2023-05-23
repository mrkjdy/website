import Markdown, { customRender } from "../components/Markdown.tsx";

const aboutMarkdown = await Deno.readTextFile("./static/about.md");

const aboutHtml = await customRender(aboutMarkdown);

export default () => (
  <div class="w-full max-w-[min(65ch,calc(100%-2rem))]">
    <Markdown html={aboutHtml} />
  </div>
);
