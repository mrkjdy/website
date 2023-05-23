import { useEffect, useRef, useState } from "preact/hooks";
import { DropdownPosition } from "./Dropdown.tsx";
import { match } from "../utils/helper.ts";
import {
  CheckCircleIcon,
  ChevronDownIcon,
  ChevronUpIcon,
} from "@heroicons/24/outline";
import CheckCircleEmptyIcon from "./CheckCircleEmptyIcon.tsx";

type OnChangeHandler = (options: [option: string, selected: boolean][]) => void;

type MultiSelectProps = {
  initialOptions: [option: string, selected: boolean][];
  buttonText: string;
  onChange?: OnChangeHandler;
  name: string;
  buttonClass?: string | undefined;
  listClass?: string | undefined;
  activeListItemClass?: string | undefined;
  setListItemClass?: ((optionIndex: number) => string) | undefined;
};

export default (
  {
    initialOptions,
    buttonText,
    onChange,
    name,
    buttonClass = "",
    listClass = "",
    activeListItemClass = "bg-gray-600",
    setListItemClass = () => "",
  }: MultiSelectProps,
) => {
  // State
  const [isOpen, setIsOpen] = useState(false);
  const [options, setOptions] = useState(initialOptions);
  const [focusIndex, setFocusIndex] = useState(-1);
  const [ddPos, setDdPos] = useState<DropdownPosition>({
    y: "bottom-[0px] mb-1",
    x: "left-[0px]",
  });
  // Refs
  const multiSelectRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const optionRefs = options.map(() => useRef<HTMLLIElement>(null));

  const numSelected = options.reduce(
    (sum, [_, selected]) => sum + (selected ? 1 : 0),
    0,
  );

  const toggleDropdown = () => setIsOpen(!isOpen);

  const handleOptionClick = (optionIndex: number) => {
    setOptions((prevOptions) => {
      prevOptions[optionIndex][1] = !prevOptions[optionIndex][1];
      return [...prevOptions];
    });
    setIsOpen(false);
    buttonRef.current?.focus();
  };

  const handleKeyDown = (event: KeyboardEvent) =>
    match(event.key, {
      "Tab": () => setIsOpen(false),
      "Enter": () => {
        if (isOpen && focusIndex >= 0) {
          handleOptionClick(focusIndex);
          event.preventDefault();
          buttonRef.current?.focus();
        }
      },
      "Escape": () => {
        setIsOpen(false);
        buttonRef.current?.focus();
      },
      "ArrowUp": () => {
        setFocusIndex((
          prevIndex,
        ) => (prevIndex <= 0 ? options.length - 1 : prevIndex - 1));
        event.preventDefault();
      },
      "ArrowDown": () => {
        setFocusIndex((
          prevIndex,
        ) => (prevIndex >= options.length - 1 ? 0 : prevIndex + 1));
        event.preventDefault();
      },
      _: () => {},
    });

  const handleClickOutside = (event: MouseEvent) => {
    if (!multiSelectRef.current?.contains(event.target as Node)) {
      setIsOpen(false);
    }
  };

  const calcAndSetDdPos = () => {
    if (buttonRef.current === null) {
      return;
    }
    const rect = buttonRef.current.getBoundingClientRect();
    const spaceUp = rect.top;
    const spaceDown = document.body.clientHeight - rect.bottom;
    const spaceLeft = rect.left;
    const spaceRight = document.body.clientWidth - rect.right;

    setDdPos({
      y: spaceDown > spaceUp
        ? `top-[${rect.bottom}px] mt-1`
        : `bottom-[${rect.top}px] mb-1`,
      x: spaceRight > spaceLeft
        ? `left-[${spaceLeft}px]`
        : `right-[${spaceRight}px]`,
    });
  };

  useEffect(() => {
    globalThis.addEventListener("mousedown", handleClickOutside);
    globalThis.addEventListener("resize", calcAndSetDdPos);
    return () => {
      globalThis.removeEventListener("mousedown", handleClickOutside);
      globalThis.removeEventListener("resize", calcAndSetDdPos);
    };
  });

  useEffect(() => {
    setFocusIndex(-1);
    calcAndSetDdPos();
  }, [isOpen]);

  useEffect(() => {
    if (isOpen && focusIndex >= 0) {
      optionRefs[focusIndex].current?.focus();
    }
  }, [isOpen, focusIndex]);

  useEffect(() => {
    if (onChange) {
      onChange(options);
    }
  }, [options]);

  return (
    <div
      ref={multiSelectRef}
      onKeyDown={handleKeyDown}
      class="flex flex-col justify-end"
    >
      <button
        class={`px-2 py-1 flex space-x-2 items-center ${buttonClass}`}
        onClick={toggleDropdown}
        ref={buttonRef}
        type="button"
      >
        {numSelected > 0 && (
          <span class="bg-white text-[#0d1117] px-1 rounded-md text-sm">
            {numSelected}
          </span>
        )}
        <span>{buttonText}</span>
        <span class="h-5 w-5">
          {isOpen ? <ChevronUpIcon /> : <ChevronDownIcon />}
        </span>
      </button>
      {options.map(([option, selected]) => (
        <input
          type="hidden"
          name={selected ? name : undefined}
          value={option}
        />
      ))}
      {isOpen && (
        <ul
          class={`absolute z-8 ${ddPos.y} ${ddPos.x} ${listClass}`}
          role="listbox"
        >
          {options.map(([option, selected], optionIndex) => (
            <li
              key={option}
              onClick={() => handleOptionClick(optionIndex)}
              class={`flex justify-between space-x-2 cursor-pointer px-2 py-2 \
               items-center hover:${activeListItemClass} ${
                optionIndex === focusIndex ? activeListItemClass : ""
              } ${setListItemClass(optionIndex)}`}
              role="option"
              id={`${name}-option-${optionIndex}-${option}`}
              tabIndex={0}
              ref={optionRefs[optionIndex]}
            >
              <span class="h-4 w-4">
                {selected ? <CheckCircleIcon /> : <CheckCircleEmptyIcon />}
              </span>
              <span>{option}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};
