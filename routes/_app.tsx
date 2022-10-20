import { asset, Head, IS_BROWSER } from "$fresh/runtime.ts";
import Nav from "../islands/Nav.tsx";
import { CSS } from "../utils/markdown.ts";
import { AppProps } from "$fresh/server.ts";

const defaultFaviconPath = !IS_BROWSER && Deno.env.get("ENVIRONMENT") === "PROD"
  ? "/favicon-prod.svg"
  : "/favicon-dev.svg";

export default (props: AppProps) => (
  <>
    <Head>
      <title>webserver</title>
      <link
        rel="icon"
        type="image/x-icon"
        href={asset(defaultFaviconPath)}
      />
      <style>
        {CSS}
      </style>
    </Head>
    <Nav />
    <div class="flex flex-col items-center">
      <main class="mt-20 flex flex-col items-center">
        <props.Component />
      </main>
      <footer class="w-full flex flex-row justify-center mt-10 mb-5">
        <p>
          © 2022 Mark Judy
        </p>
      </footer>
    </div>
  </>
);
