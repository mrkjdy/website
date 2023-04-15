import { createReporter } from "$ga/mod.ts";
import { MiddlewareHandler } from "$fresh/server.ts";

const ga = createReporter({ id: Deno.env.get("GA_TRACKING_ID") });

export const handler: MiddlewareHandler = async (req, ctx) => {
  const { next, remoteAddr } = ctx;
  const start = performance.now();
  let resp: Response;
  let err;
  try {
    resp = await next();
  } catch (e) {
    err = e;
  } finally {
    ga(req, { remoteAddr }, resp!, start, err);
  }
  return resp!;
};
