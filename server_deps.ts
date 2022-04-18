export * from "https://raw.githubusercontent.com/lucacasonato/fresh/main/server.ts";

// WORKAROUND temporary workaround until URLPattern is defined
// see https://github.com/lucacasonato/fresh/issues/76
// and https://github.com/denoland/deno/issues/12558
declare global {
  // deno-lint-ignore no-explicit-any no-var
  var URLPattern: any;
}
