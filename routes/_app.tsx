import { asset, Head, IS_BROWSER } from "$fresh/runtime.ts";
import Nav from "../islands/Nav.tsx";
import { CSS } from "../utils/markdown.ts";
import { AppProps } from "$fresh/server.ts";

const GA_ID = IS_BROWSER ? undefined : Deno.env.get("GA_ID");

export default ({ Component }: AppProps) => (
  <>
    <Head>
      {GA_ID !== undefined && (
        <>
          <script
            async
            src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`}
          >
          </script>
          <script
            srcDoc={`
              window.dataLayer = window.dataLayer || [];
              function gtag() { dataLayer.push(arguments); }
              gtag('js', new Date());
              gtag('config', '${GA_ID}');
            `}
          >
          </script>
        </>
      )}
      <title>webserver</title>
      <link
        rel="icon"
        type="image/x-icon"
        href={asset("favicon.svg")}
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
          © 2023 Mark Judy
        </p>
      </footer>
    </div>
  </>
);
