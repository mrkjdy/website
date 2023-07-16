import { render, RenderOptions } from "../utils/markdown.ts";
import { asset, Head } from "$fresh/runtime.ts";
import { CSS } from "../utils/markdown.ts";
import { match } from "../utils/helper.ts";

const findCodeBlockLanguages = (markdown: string): string[] => {
  const regex = /```(\w*)/g;
  let match;
  const languages = [];

  while ((match = regex.exec(markdown)) !== null) {
    const [_, language] = match;
    if (language) {
      languages.push(language.toLowerCase());
    }
  }

  return languages;
};

type CustomRenderOptions = RenderOptions & {
  assetPrefix?: string | undefined;
};

export const customRender = async (
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
  const detectedLanguages = findCodeBlockLanguages(markdown);
  for (const language of detectedLanguages) {
    await match(language, {
      "python": () => import("prismjs/components/prism-python.js?no-check"),
      "rust": () => import("prismjs/components/prism-rust.js?no-check"),
      "typescript": () =>
        import("prismjs/components/prism-typescript.js?no-check"),
      "_": () => {
        throw new Error(`"${language}" not available`);
      },
    });
    // TODO - Once Deno Deploy supports non-statically analyzable dynamic
    // imports, remove match above and use dynamic import below.
    // See https://github.com/denoland/deploy_feedback/issues/1
    // await import(`prismjs/components/prism-${language}.js?no-check`);
  }
  return render(markdown, otherRenderOpts);
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
        <style>{CSS}</style>
        <link rel="stylesheet" href={asset("/styles/prism.css")} />
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
