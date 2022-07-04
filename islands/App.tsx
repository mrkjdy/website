/** @jsx h */
/** @jsxFrag Fragment */
import { asset, Head } from "$fresh/runtime.ts";
import { Fragment, h } from "preact";

const defaultFaviconPath = Deno.env.get("ENVIRONMENT") === "PROD"
  ? "/favicon-prod.svg"
  : "/favicon-dev.svg";

type AppProps = {
  faviconPath?: string;
  children: h.JSX.Element;
};

export default ({ faviconPath, children }: AppProps) => (
  <>
    <Head>
      <title>webserver</title>
      <link
        rel="icon"
        type="image/x-icon"
        href={asset(faviconPath ?? defaultFaviconPath)}
      />
    </Head>
    {children}
  </>
);
