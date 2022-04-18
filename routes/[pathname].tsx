/** @jsx h */
import { h } from "../client_deps.ts";
import App from "../islands/App.tsx";

const PUBLIC = "./public";

export const handler = async (req: Request) => {
  const { pathname } = new URL(req.url);
  for await (const file of Deno.readDir(PUBLIC)) {
    if (pathname === `/${file.name}`) {
      return new Response(await Deno.readFile(`${PUBLIC}${pathname}`), {
        headers: {
          "content-type": "text/css",
        },
      });
    }
  }
};

export default () => (
  <App>
    <div className="content">
      404
    </div>
  </App>
);
