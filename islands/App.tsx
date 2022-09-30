import { asset, Head, IS_BROWSER } from "$fresh/runtime.ts";
import { JSX } from "preact/jsx-runtime";
import Nav, { NavProps } from "./Nav.tsx";

let defaultFaviconPath = "/favicon-dev.svg";
if (!IS_BROWSER && Deno.env.get("ENVIRONMENT") === "PROD") {
  defaultFaviconPath = "/favicon-prod.svg";
}

type AppProps =
  & {
    faviconPath?: string;
    children: JSX.Element | JSX.Element[];
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
    </Head>
    <Nav boldLink={boldLink} />
    <div class="flex flex-col items-center">
      <main class="mt-20 flex flex-col items-center">
        {children}
      </main>
      <footer class="w-full flex flex-row justify-center mt-10 mb-5">
        <p>
          © 2022 Mark Judy
        </p>
      </footer>
    </div>
  </>
);
