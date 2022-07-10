/** @jsx h */
/** @jsxFrag Fragment */
import { asset, Head, IS_BROWSER } from "$fresh/runtime.ts";
import { Fragment, h } from "preact";
import { tw } from "@twind";
import Nav, { NavProps } from "./Nav.tsx";

let defaultFaviconPath = "/favicon-dev.svg";
let gaId: string | undefined;
if (!IS_BROWSER) {
  gaId === Deno.env.get("GA_ID");
  if (Deno.env.get("ENVIRONMENT") === "PROD") {
    defaultFaviconPath = "/favicon-prod.svg";
  }
}

type AppProps =
  & {
    faviconPath?: string;
    children: h.JSX.Element;
  }
  & {
    [Key in keyof NavProps]: NavProps[Key];
  };

export default ({ faviconPath, children, boldLink }: AppProps) => (
  <>
    <Head>
      <title>Web server</title>
      <link
        rel="icon"
        type="image/x-icon"
        href={asset(faviconPath ?? defaultFaviconPath)}
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
    <Nav boldLink={boldLink} />
    <div class={tw`flex flex-col items-center`}>
      <main class={tw`mt-20 flex flex-col items-center`}>
        {children}
      </main>
      <footer class={tw`w-full flex flex-row justify-center mt-10 mb-5`}>
        <p>
          © 2022 Mark Judy
        </p>
      </footer>
    </div>
  </>
);
