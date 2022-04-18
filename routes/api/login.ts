import { HandlerContext } from "../../server_deps.ts";

export const handler = (_req: Request, _ctx: HandlerContext): Response => {
  // _req.
  return new Response("Hi");
};
