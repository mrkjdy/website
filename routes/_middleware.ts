import { createReporter } from "$ga/mod.ts";
import { MiddlewareHandler } from "$fresh/server.ts";
import { GA_TRACKING_ID } from "../utils/add-google-analytics.tsx";

const ga = createReporter({ id: GA_TRACKING_ID });

export const handler: MiddlewareHandler = async (req, ctx) => {
  const start = performance.now();
  let resp: Response;
  let err;
  try {
    resp = await ctx.next();
    return resp;
  } catch (e) {
    resp = new Response("Internal Server Error", {
      status: 500,
    });
    err = e;
    throw e;
  } finally {
    ga(req, ctx, resp!, start, err);
  }
};
