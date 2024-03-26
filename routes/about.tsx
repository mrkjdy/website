import { Head } from "$fresh/runtime.ts";
import { Handlers, PageProps } from "$fresh/server.ts";
import Markdown, { customRender } from "../components/Markdown.tsx";
import { TITLE } from "./_app.tsx";
import Picture, { PictureProps } from "../components/Picture.tsx";
import sharp from "sharp";

type AboutData = {
  html: string;
  headshot: PictureProps;
};

let aboutData: AboutData;

export const handler: Handlers<AboutData> = {
  GET: async (_, ctx) => {
    if (aboutData === undefined) {
      const markdown = await Deno.readTextFile("./static/about/me.md");
      const html = customRender(markdown);
      const headshotAvifSrc = `/about/headshot.avif`;
      const headshotJpegSrc = `/about/headshot.jpeg`;
      const { width: headshotWidth, height: headshotHeight } = await sharp(
        `./static${headshotAvifSrc}`,
      ).metadata();
      aboutData = {
        html,
        headshot: {
          avifSrc: headshotAvifSrc,
          jpegSrc: headshotJpegSrc,
          alt: "A picture of me",
          width: headshotWidth,
          height: headshotHeight,
        },
      };
    }
    return ctx.render(aboutData);
  },
};

export default ({ data: { html, headshot } }: PageProps<AboutData>) => (
  <>
    <Head>
      <title key="title">{`${TITLE} | About`}</title>
    </Head>
    <div class="w-full max-w-[min(65ch,calc(100%-2rem))] flex flex-col space-y-[1rem]">
      <h1 class="text-4xl font-bold">About me</h1>
      <Picture
        avifSrc={headshot.avifSrc}
        jpegSrc={headshot.jpegSrc}
        alt="A picture of me"
        class="w-48 h-48 rounded-md"
        width={headshot.width}
        height={headshot.height}
      />
      <Markdown html={html} />
    </div>
  </>
);
