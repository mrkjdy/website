import { render } from "../utils/markdown.ts";

type MarkdownProps = {
  markdown: string;
  class?: string;
  style?: string;
};

export default (props: MarkdownProps) => (
  <div
    data-color-mode="auto"
    data-light-theme="light"
    data-dark-theme="dark"
    class={`markdown-body ${props.class ?? ""}`}
    style={`background-color: var(--color-canvas-default);
      color: var(--color-fg-default); margin: 0 auto;
      padding: 2rem 1rem; ${props.style ?? ""}`}
    dangerouslySetInnerHTML={{ __html: render(props.markdown) }}
  />
);
