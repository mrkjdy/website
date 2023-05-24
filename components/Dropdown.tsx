import { useEffect, useRef, useState } from "preact/hooks";
import CheckIcon from "./icons/20/CheckIcon.tsx";
import ChevronDownIcon from "./icons/20/ChevronDownIcon.tsx";
import ChevronUpIcon from "./icons/20/ChevronUpIcon.tsx";
import { match } from "../utils/helper.ts";

export type DropdownPosition = {
  y: `top-[${number}px] mt-1` | `bottom-[${number}px] mb-1`;
  x: `left-[${number}px]` | `right-[${number}px]`;
};

type OnChangeHandler<T extends string> = (selectedOption: T) => void;

type DropdownProps<T extends string> = {
  options: T[];
  initialSelected: T;
  buttonText?: string | undefined;
  onChange?: OnChangeHandler<T>;
  name: string;
  buttonClass?: string | undefined;
  listClass?: string | undefined;
  activeListItemClass?: string | undefined;
  setListItemClass?: ((optionIndex: number) => string) | undefined;
};

export default <T extends string>(
  {
    options,
    initialSelected,
    buttonText,
    onChange,
    name,
    buttonClass = "",
    listClass = "",
    activeListItemClass = "bg-gray-600",
    setListItemClass = () => "",
  }: DropdownProps<T>,
) => {
  // State
  const [isOpen, setIsOpen] = useState(false);
  const [selectedOption, setSelectedOption] = useState(initialSelected);
  const [focusIndex, setFocusIndex] = useState(-1);
  const [ddPos, setDdPos] = useState<DropdownPosition>({
    y: "bottom-[0px] mb-1",
    x: "left-[0px]",
  });
  // Refs
  const dropdownRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const optionRefs = options.map(() => useRef<HTMLLIElement>(null));

  const toggleDropdown = () => setIsOpen(!isOpen);

  const handleOptionClick = (optionIndex: number) => {
    setSelectedOption(options[optionIndex]);
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
    if (!dropdownRef.current?.contains(event.target as Node)) {
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
      onChange(selectedOption);
    }
  }, [selectedOption]);

  return (
    <div ref={dropdownRef} onKeyDown={handleKeyDown}>
      <button
        class={`px-2 py-1 flex space-x-2 items-center ${buttonClass}`}
        onClick={toggleDropdown}
        ref={buttonRef}
        type="button"
        aria-haspopup="true"
        aria-expanded={isOpen}
      >
        <span>{buttonText ?? selectedOption}</span>
        <span class="sr-only">Toggle dropdown menu</span>
        {isOpen ? <ChevronUpIcon /> : <ChevronDownIcon />}
      </button>
      <input
        type="hidden"
        name={name}
        value={selectedOption}
        aria-hidden="true"
      />
      {isOpen && (
        <ul
          class={`absolute z-8 ${ddPos.y} ${ddPos.x} ${listClass}`}
          role="listbox"
          aria-activedescendant={`${name}-option-${focusIndex}-${
            options[focusIndex]
          }`}
        >
          {options.map((option, optionIndex) => (
            <li
              key={option}
              onClick={() => handleOptionClick(optionIndex)}
              class={`flex justify-between space-x-2 cursor-pointer px-2 py-2 \
              items-center justify-end hover:${activeListItemClass} ${
                optionIndex === focusIndex ? activeListItemClass : ""
              } ${setListItemClass(optionIndex)}`}
              role="option"
              id={`${name}-option-${optionIndex}-${option}`}
              tabIndex={0}
              ref={optionRefs[optionIndex]}
              aria-selected={option === selectedOption}
            >
              {option === selectedOption && <CheckIcon />}
              <span>{option}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};
