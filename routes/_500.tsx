import { PageProps } from "$fresh/server.ts";
import { Head } from "$fresh/runtime.ts";
import { TITLE } from "./_app.tsx";

export default ({ error }: PageProps) => (
  <>
    <Head>
      <title key="title">{`${TITLE} | Internal error`}</title>
    </Head>
    <p>500 - Internal error: {(error as Error).message}</p>
  </>
);
