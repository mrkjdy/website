/** @jsx h */
import { h, JSX } from "../client_deps.ts";

export default ({ children }: { children: JSX.Element }) => (
  <html>
    <head>
      <link rel="stylesheet" href="style.css" />
    </head>
    <body>
      {children}
    </body>
  </html>
);
