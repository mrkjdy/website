import { asset, Partial } from "$fresh/runtime.ts";
import Nav from "../islands/Nav.tsx";
import { PageProps } from "$fresh/server.ts";
import GoogleAnalyticsScripts from "../components/GoogleAnalyticsScripts.tsx";

export const TITLE = "mrkjdy.dev";

export default ({ Component }: PageProps) => (
  <html lang="en">
    <head>
      <meta charset="utf-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <title key="title">{TITLE}</title>
      <link
        rel="icon"
        type="image/png"
        href={asset("/favicon.png")}
      />
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="stylesheet" href={asset("/styles.css")} />
      <GoogleAnalyticsScripts />
    </head>
    <body class="text-black dark:text-white font-sans bg-white dark:bg-[#0d1117]">
      <div class="flex flex-col items-center relative min-h-screen top-0">
        <Nav />
        <main
          class="flex flex-col items-center mt-10 mb-20 w-full"
          f-client-nav
        >
          <Partial name="main">
            <Component />
          </Partial>
        </main>
        <footer class="w-full flex flex-row justify-center h-10 absolute bottom-0 text-gray-400">
          <p>
            © 2023 Mark Judy
          </p>
        </footer>
      </div>
    </body>
  </html>
);
