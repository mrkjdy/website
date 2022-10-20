import { createReporter } from "$ga/mod.ts";
import { MiddlewareHandlerContext } from "$fresh/server.ts";

export interface State {
  pathname: string;
}

const GA_ID = Deno.env.get("GA_ID");

export const handler = async (
  req: Request,
  ctx: MiddlewareHandlerContext<State>,
): Promise<Response> => {
  const start = performance.now();
  const resp = await ctx.next();
  if (typeof GA_ID === "string") {
    const ga = createReporter({ id: GA_ID });
    ga(req, ctx, resp, start);
  }
  return resp;
};
