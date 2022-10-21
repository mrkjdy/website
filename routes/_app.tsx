import { asset, Head, IS_BROWSER } from "$fresh/runtime.ts";
import Nav from "../islands/Nav.tsx";
import { CSS } from "../utils/markdown.ts";
import { AppProps } from "$fresh/server.ts";

const defaultFaviconPath = !IS_BROWSER && Deno.env.get("ENVIRONMENT") === "PROD"
  ? "/favicon-prod.svg"
  : "/favicon-dev.svg";

export default ({ Component }: AppProps) => (
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
    <div class="flex flex-col items-center relative min-h-screen top-0">
      <Nav />
      <main class="flex flex-col items-center mt-20 mb-20">
        <Component />
      </main>
      <footer class="w-full flex flex-row justify-center h-10 absolute bottom-0">
        <p>
          © 2022 Mark Judy
        </p>
      </footer>
    </div>
  </>
);