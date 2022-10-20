import { ErrorPageProps } from "$fresh/server.ts";

export default ({ error }: ErrorPageProps) => (
  <p>500 - Internal error: {(error as Error).message}</p>
);
