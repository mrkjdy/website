import { PageProps } from "$fresh/server.ts";
import { Head } from "$fresh/runtime.ts";
import { TITLE } from "./_app.tsx";

export default ({ url }: PageProps) => (
  <>
    <Head>
      <title key="title">{`${TITLE} | Not found`}</title>
    </Head>
    <p>404 - Not found: {url.pathname}</p>
  </>
);
