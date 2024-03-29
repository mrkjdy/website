import { Head } from "$fresh/runtime.ts";
import Markdown, { customRender } from "../components/Markdown.tsx";

const aboutMarkdown = await Deno.readTextFile("./static/about.md");

const [aboutHtml] = customRender(aboutMarkdown);

export default () => (
  <>
    <Head>
      <title key="title">mrkjdy.dev | About</title>
    </Head>
    <div class="w-full max-w-[min(65ch,calc(100%-2rem))]">
      <h1 class="text-4xl font-bold">About me</h1>
      <br />
      <img
        src="/images/headshot.jpeg"
        alt="Profile picture"
        class="w-48 h-48 rounded-md"
      />
      <br />
      <Markdown html={aboutHtml} />
    </div>
  </>
);
