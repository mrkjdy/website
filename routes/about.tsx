import App from "../islands/App.tsx";
import { render } from "../utils/markdown.ts";

const markdown = `
Hi I'm Mark Judy. Here are some links:
* https://github.com/mrkjdy
* https://www.linkedin.com/in/mrkjdy/
`;

export default () => (
  <App faviconPath="favicon-head.svg" boldLink="About">
    <main
      data-color-mode="auto"
      data-light-theme="light"
      data-dark-theme="dark"
      class="markdown-body"
      style="background-color: var(--color-canvas-default);
      color: var(--color-fg-default); margin: 0 auto;
      padding: 2rem 1rem;"
    >
      <h1>About Me</h1>
      <div
        dangerouslySetInnerHTML={{ __html: render(markdown) }}
      />
    </main>
  </App>
);
