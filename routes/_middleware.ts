import { createReporter } from "$ga/mod.ts";
import { MiddlewareHandlerContext } from "$fresh/server.ts";

interface State {
  data: string;
}

const GA_ID = Deno.env.get("GA_ID");

export const handler = async (
  req: Request,
  ctx: MiddlewareHandlerContext<State>,
): Promise<Response> => {
  const resp = await ctx.next();
  const start = performance.now();
  if (typeof GA_ID === "string") {
    const ga = createReporter({ id: GA_ID });
    ga(req, ctx, resp, start);
  }
  return resp;
};
