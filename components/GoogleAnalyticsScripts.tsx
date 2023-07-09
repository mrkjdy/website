import { IS_BROWSER } from "$fresh/runtime.ts";

export const GA_TRACKING_ID = IS_BROWSER
  ? undefined
  : Deno.env.get("GA_TRACKING_ID");

export default () => (
  <>
    {GA_TRACKING_ID !== undefined && (
      <>
        <script
          async
          src={`https://www.googletagmanager.com/gtag/js?id=${GA_TRACKING_ID}`}
        >
        </script>
        <script
          srcDoc={`
          window.dataLayer = window.dataLayer || [];
          function gtag() { dataLayer.push(arguments); }
          gtag('js', new Date());
          gtag('config', '${GA_TRACKING_ID}');
        `}
        >
        </script>
      </>
    )}
  </>
);
