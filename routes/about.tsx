import Markdown from "../components/Markdown.tsx";

const markdown = `
## About Me

Hi I'm Mark Judy. Here are some links:
* https://github.com/mrkjdy
* https://www.linkedin.com/in/mrkjdy/
`;

export default () => (
  <div>
    <Markdown markdown={markdown} />
  </div>
);
