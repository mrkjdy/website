import { ComponentProps } from "preact";

export default (props: Omit<ComponentProps<"svg">, "children">) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 20 20"
    fill="none"
    stroke="currentColor"
    class="w-5 h-5"
    {...props}
  >
    <path
      fillRule="evenodd"
      d="M10 18a8 8 0 100-16 8 8 0 000 16z"
      clipRule="evenodd"
    />
  </svg>
);
