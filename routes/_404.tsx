import { UnknownPageProps } from "$fresh/server.ts";

export default ({ url }: UnknownPageProps) => (
  <p>404 - Not found: {url.pathname}</p>
);
