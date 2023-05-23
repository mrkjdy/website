import { useRef } from "preact/hooks";
import Dropdown from "../components/Dropdown.tsx";
import MultiSelect from "../components/MultiSelect.tsx";
import { XMarkIcon } from "@heroicons/24/outline";

export const SORT_PARAM = "sort";

export enum Sort {
  NEWEST = "Newest",
  OLDEST = "Oldest",
}

export enum Filter {
  TAG = "tag",
}

type BlogIndexMenuProps = {
  sorts: Sort[];
  currentSort: Sort;
  tags: [tag: string, selected: boolean][];
};

export default ({ sorts, currentSort, tags }: BlogIndexMenuProps) => {
  const formRef = useRef<HTMLFormElement>(null);
  const numSelected = tags.reduce(
    (sum, [_, selected]) => sum + (selected ? 1 : 0),
    0,
  );
  const primaryButtonClasses =
    "bg-white dark:bg-[#161B22] rounded-md border border-[#30363d]";
  return (
    <form ref={formRef} class="flex space-x-4">
      {numSelected > 0 && (
        <div class="flex flex-col justify-end">
          <button
            class="rounded-md border border-[#30363d] px-2 py-1 flex space-x-2"
            type="button"
            onClick={() => {
              const url = new URL(window.location.href);
              url.searchParams.delete(Filter.TAG);
              window.location.assign(url);
            }}
          >
            <span>Clear</span>
            <span class="h-6 w-6">
              <XMarkIcon />
            </span>
          </button>
        </div>
      )}
      <MultiSelect
        initialOptions={tags}
        buttonText="Tags"
        onChange={(options) => {
          if (tags !== options && formRef.current) {
            formRef.current.submit();
          }
        }}
        name={Filter.TAG}
        buttonClass={primaryButtonClasses}
        listClass={primaryButtonClasses}
        setListItemClass={(optionIndex) =>
          `${optionIndex === 0 ? "rounded-t-md" : ""} ${
            optionIndex === tags.length - 1 ? "rounded-b-md" : ""
          }`}
      />
      <Dropdown<Sort>
        options={sorts}
        initialSelected={currentSort}
        onChange={(option) => {
          if (option !== currentSort && formRef.current) {
            formRef.current.submit();
          }
        }}
        name={SORT_PARAM}
        buttonClass={primaryButtonClasses}
        listClass={primaryButtonClasses}
        setListItemClass={(optionIndex) =>
          `${optionIndex === 0 ? "rounded-t-md" : ""} ${
            optionIndex === sorts.length - 1 ? "rounded-b-md" : ""
          }`}
      />
    </form>
  );
};
