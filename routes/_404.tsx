/** @jsx h */
import { h } from "preact";
import { UnknownPageProps } from "$fresh/server.ts";
import App from "../islands/App.tsx";

export default ({ url }: UnknownPageProps) => (
  <App faviconPath="/favicon-404.svg">
    <p>404 - Not found: {url.pathname}</p>
  </App>
);
