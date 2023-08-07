import { render, RenderOptions } from "../utils/markdown.ts";
import { asset, Head } from "$fresh/runtime.ts";
import { CSS } from "../utils/markdown.ts";

type CustomRenderOptions = RenderOptions & {
  assetPrefix?: string | undefined;
};

export const customRender = (
  templateMarkdown: string,
  { assetPrefix = "", ...otherRenderOpts }: CustomRenderOptions = {},
) => {
  const assetPattern = /{{\s*asset:\s*"([^"]*)"\s*}}/g;
  const markdown = templateMarkdown.replaceAll(assetPattern, (_, filename) => {
    if (typeof filename !== "string") {
      throw new Error(
        'Markdown template parameter "asset" must be a string. ' +
          `Received a "${typeof filename}"`,
      );
    }
    return asset(`${assetPrefix}${filename}`);
  });
  return [render(markdown, otherRenderOpts), markdown];
};

type BaseMarkdownProps = {
  class?: string;
  style?: string;
};

type MarkdownProps =
  & BaseMarkdownProps
  & ({ markdown: string; renderOptions?: RenderOptions | undefined } | {
    html: string;
  });

export default (props: MarkdownProps) => {
  const html = "html" in props
    ? props.html
    : render(props.markdown, props.renderOptions);
  return (
    <>
      <Head>
        <style dangerouslySetInnerHTML={{ __html: CSS }} />
        <link rel="stylesheet" href={asset("/styles/markdown-body.css")} />
      </Head>
      <div
        data-color-mode="auto"
        data-light-theme="light"
        data-dark-theme="dark"
        class={`markdown-body ${props.class ?? ""}`}
        style={props.style}
        dangerouslySetInnerHTML={{ __html: html }}
      />
    </>
  );
};
