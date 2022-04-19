/** @jsx h */
import { h } from "../client_deps.ts";
import App from "../islands/App.tsx";
import { HandlerContext } from "../server_deps.ts";
import { lookup } from "https://deno.land/x/media_types@v3.0.2/mod.ts";
import { Environment } from "../islands/environment.ts";
import { FaviconPath } from "../islands/favicon.ts";

export const handler = async (req: Request, ctx: HandlerContext) => {
  const url = new URL(req.url);
  const path = `./public${url.pathname}`;
  if (!path.includes("../")) {
    const mimeType = lookup(path);
    try {
      const file = await Deno.readFile(path);
      const isProd = Deno.env.get("ENVIRONMENT") === Environment.PRODUCTION;
      return new Response(
        file,
        mimeType === undefined ? undefined : {
          headers: {
            "content-type": mimeType,
            // Tell browsers that public files can be cached 1 day (in seconds)
            "cache-control": isProd
              ? "max-age=86400, public, must-revalidate"
              : "max-age=86400, public, no-cache",
          },
        },
      );
    } catch {
      // Throw the file read away if it fails
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
    <div className="content">
      404
    </div>
  </App>
);
