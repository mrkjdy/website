import { asset, Head } from "$fresh/runtime.ts";
import Nav from "../islands/Nav.tsx";
import { AppProps } from "$fresh/server.ts";
import addGoogleAnalytics from "../utils/add-google-analytics.tsx";

export default ({ Component }: AppProps) => (
  <>
    <Head>
      {addGoogleAnalytics()}
      <title>webserver</title>
      <link
        rel="icon"
        type="image/x-icon"
        href={asset("/favicon.svg")}
      />
    </Head>
    <div class="flex flex-col items-center relative min-h-screen top-0">
      <Nav />
      <main class="flex flex-col items-center mt-10 mb-20 w-full">
        <Component />
      </main>
      <footer class="w-full flex flex-row justify-center h-10 absolute bottom-0 text-gray-400">
        <p>
          © 2023 Mark Judy
        </p>
      </footer>
    </div>
  </>
);
