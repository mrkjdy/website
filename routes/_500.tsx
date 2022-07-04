/** @jsx h */
import { h } from "preact";
import { ErrorPageProps } from "$fresh/server.ts";
import App from "../islands/App.tsx";

export default ({ error }: ErrorPageProps) => (
  <App faviconPath="favicon-500.svg">
    <p>500 - Internal error: {(error as Error).message}</p>
  </App>
);
