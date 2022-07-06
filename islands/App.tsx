/** @jsx h */
/** @jsxFrag Fragment */
import { asset, Head } from "$fresh/runtime.ts";
import { Fragment, h } from "preact";
import { tw } from "@twind";

const defaultFaviconPath = Deno.env.get("ENVIRONMENT") === "PROD"
  ? "/favicon-prod.svg"
  : "/favicon-dev.svg";

const gaId = Deno.env.get("GA_ID");

type AppProps = {
  faviconPath?: string;
  children: h.JSX.Element;
};

const theme =
  `h-screen bg-white text-black dark:(bg-gray-800 text-white) font-sans flex flex-col justify-between`;

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
      {typeof gaId === "string" &&
        (
          <>
            <script
              async
              src={`https://www.googletagmanager.com/js?id=${gaId}`}
            >
            </script>
            <script>
              window.dataLayer = window.dataLayer || []; function gtag()
              &#123;dataLayer.push(arguments);&#125; gtag('js', new Date());

              gtag('config', {`'${gaId}'`});
            </script>
          </>
        )}
    </Head>
    <div class={tw`${theme}`}>
      <div class={tw`h-10`}>
        <a href="/" title="Home">📄 Web server</a>
        <a href="/about" title="About">About</a>
      </div>
      <div class={tw`mb-auto`}>
        {children}
      </div>
      <div class={tw`h-10`}>© 2022 Mark Judy</div>
    </div>
  </>
);
