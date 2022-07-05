/** @jsx h */
/** @jsxFrag Fragment */
import { asset, Head } from "$fresh/runtime.ts";
import { Fragment, h } from "preact";
import { tw } from "@twind";

const defaultFaviconPath = Deno.env.get("ENVIRONMENT") === "PROD"
  ? "/favicon-prod.svg"
  : "/favicon-dev.svg";

type AppProps = {
  faviconPath?: string;
  children: h.JSX.Element;
};

const containerStyles =
  `h-screen bg-white text-black dark:(bg-gray-800 text-white) font-sans`;

export default ({ faviconPath, children }: AppProps) => (
  <>
    <Head>
      <title>Web server</title>
      <link
        rel="icon"
        type="image/x-icon"
        href={asset(faviconPath ?? defaultFaviconPath)}
      />
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
      <link
        href="https://fonts.googleapis.com/css2?family=IBM+Plex+Mono&family=IBM+Plex+Sans&family=IBM+Plex+Serif&display=swap"
        rel="stylesheet"
      />
    </Head>
    <div class={tw`${containerStyles}`}>
      <div>
        <a href="/" title="Home">📄 Web server</a>
        <a href="/about" title="About">About</a>
      </div>
      {children}
    </div>
  </>
);
