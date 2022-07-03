/** @jsx h */
import { h } from "../client_deps.ts";
import App from "../App.tsx";
import { HandlerContext } from "../server_deps.ts";
import { lookup } from "https://deno.land/x/media_types@v3.0.2/mod.ts";
import { Environment } from "../support/environment.ts";
import { FaviconPath } from "../support/favicon.ts";

const silentReadFile = async (path: string) =>
  await Deno.readFile(path)
    .then((file) => file, () => undefined);

export const handler = async (req: Request, ctx: HandlerContext) => {
  const url = new URL(req.url);
  const path = `./public${url.pathname}`;
  if (!path.includes("../")) {
    const file = await silentReadFile(path);
    if (file !== undefined) {
      const mimeType = lookup(path);
      return new Response(file, {
        headers: {
          ...(mimeType !== undefined && { "content-type": mimeType }),
          "cache-control":
            Deno.env.get("ENVIRONMENT") === Environment.PRODUCTION
              ? "max-age=86400, public, must-revalidate"
              : "max-age=86400, public, no-cache",
        },
      });
    }
  }
  const rendered = ctx.render();
  return new Response(rendered.body, {
    headers: rendered.headers,
    status: 404,
    statusText: "Not Found",
  });
};

export default () => (
  <App faviconPath={FaviconPath.NOT_FOUND}>
    {/* <div className="container"> */}
    <p className="centered">
      404
    </p>
    {/* </div> */}
  </App>
);
