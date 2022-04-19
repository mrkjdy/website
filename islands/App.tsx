/** @jsx h */
/** @jsxFrag Fragment */
import { Fragment, h, Head, JSX } from "../client_deps.ts";
import { Environment } from "./environment.ts";
import { FaviconPath } from "./favicon.ts";

const environment = Deno.env.get("ENVIRONMENT") as Environment;

const defaultFaviconPath =
  Deno.env.get("ENVIRONMENT") === Environment.PRODUCTION
    ? FaviconPath.PRODUCTION
    : FaviconPath.DEVELOPMENT;

export default ({ children, faviconPath }: {
  children: JSX.Element;
  faviconPath?: FaviconPath;
}) => (
  <>
    <Head>
      <title>webserver</title>
      <link rel="stylesheet" href="style.css" />
      <link
        rel="icon"
        type="image/svg+xml"
        href={faviconPath ?? defaultFaviconPath}
      />
    </Head>
    {children}
  </>
);
