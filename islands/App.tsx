/** @jsx h */
import { h, JSX } from "../client_deps.ts";

export default ({ children }: { children: JSX.Element }) => (
  <html>
    <head>
      <link rel="stylesheet" href="style.css" />
      <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
    </head>
    <body>
      {children}
    </body>
  </html>
);
