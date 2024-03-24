import { asset, Head } from "$fresh/runtime.ts";
import Markdown, { customRender } from "../components/Markdown.tsx";
import { imageSize } from "image-size";

const aboutMarkdown = await Deno.readTextFile("./static/about/me.md");

const [aboutHtml] = customRender(aboutMarkdown);

const headshotPath = "about/headshot.jpeg";
const headshotDimensions = imageSize(`./static/${headshotPath}`);

export default () => (
  <>
    <Head>
      <title key="title">mrkjdy.dev | About</title>
    </Head>
    <div class="w-full max-w-[min(65ch,calc(100%-2rem))] flex flex-col space-y-[1rem]">
      <h1 class="text-4xl font-bold">About me</h1>
      <img
        src={asset(headshotPath)}
        alt="Profile picture"
        class="w-48 h-48 rounded-md"
        width={headshotDimensions.width}
        height={headshotDimensions.height}
      />
      <Markdown html={aboutHtml} />
    </div>
  </>
);
