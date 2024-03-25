import { asset, Head } from "$fresh/runtime.ts";
import { Handlers, PageProps } from "$fresh/server.ts";
import Markdown, { customRender } from "../components/Markdown.tsx";
import { imageSize } from "image-size";
import { TITLE } from "./_app.tsx";

type AboutData = {
  html: string;
  headshot: {
    path: string;
    width: number | undefined;
    height: number | undefined;
  };
};

export const handler: Handlers<AboutData> = {
  GET: async (_, ctx) => {
    const markdown = await Deno.readTextFile("./static/about/me.md");
    const html = customRender(markdown);
    const headshotPath = "about/headshot.jpeg";
    const headshotDimensions = imageSize(`./static/${headshotPath}`);
    return ctx.render({
      html,
      headshot: {
        path: headshotPath,
        width: headshotDimensions.width,
        height: headshotDimensions.height,
      },
    });
  },
};

export default ({ data: { html, headshot } }: PageProps<AboutData>) => (
  <>
    <Head>
      <title key="title">{`${TITLE} | About`}</title>
    </Head>
    <div class="w-full max-w-[min(65ch,calc(100%-2rem))] flex flex-col space-y-[1rem]">
      <h1 class="text-4xl font-bold">About me</h1>
      <img
        src={asset(headshot.path)}
        alt="Profile picture"
        class="w-48 h-48 rounded-md"
        width={headshot.width}
        height={headshot.height}
      />
      <Markdown html={html} />
    </div>
  </>
);
