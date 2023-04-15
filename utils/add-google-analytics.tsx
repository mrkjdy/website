import { IS_BROWSER } from "$fresh/runtime.ts";

export default () => {
  if (IS_BROWSER) {
    return undefined;
  }
  const GA_TRACKING_ID = Deno.env.get("GA_TRACKING_ID");
  if (GA_TRACKING_ID === undefined) {
    return undefined;
  }
  return (
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
  );
};
