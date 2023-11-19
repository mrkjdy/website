import { asset, Head, Partial } from "$fresh/runtime.ts";
import Nav from "../islands/Nav.tsx";
import { AppProps } from "$fresh/server.ts";
import GoogleAnalyticsScripts from "../components/GoogleAnalyticsScripts.tsx";

export default ({ Component }: AppProps) => (
  <>
    <Head>
      <GoogleAnalyticsScripts />
      {/* {addGoogleAnalytics()} */}
      <title>webserver</title>
      <link
        rel="icon"
        type="image/x-icon"
        href={asset("/favicon.svg")}
      />
    </Head>
    <div class="flex flex-col items-center relative min-h-screen top-0">
      <Nav />
      <main class="flex flex-col items-center mt-10 mb-20 w-full" f-client-nav>
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
  </>
);
