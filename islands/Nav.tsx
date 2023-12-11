import { useEffect, useRef, useState } from "preact/hooks";
import XMarkIcon from "../components/icons/24/XMarkIcon.tsx";
import Bars3Icon from "../components/icons/24/Bars3Icon.tsx";

const headerPairs = [
  ["Home", "/"],
  ["Posts", "/posts"],
  ["About", "/about"],
  ["Source", "https://github.com/mrkjdy/website"],
] as const;

export default () => {
  const [currentPath, setCurrentPath] = useState<string | undefined>();
  const [isHamburgerMenuOpen, setIsHamburgerMenuOpen] = useState(false);
  const [isOverlayVisible, setIsOverlayVisible] = useState(false);
  const hideOverlayTimeoutIdRef = useRef<number | null>(null);
  const hamburgerMenuTransitionDuration = 200;

  const toggleHamburgerMenu = () => {
    if (isHamburgerMenuOpen) {
      setIsHamburgerMenuOpen(false);
      hideOverlayTimeoutIdRef.current = setTimeout(
        () => setIsOverlayVisible(false),
        hamburgerMenuTransitionDuration,
      );
    } else {
      if (hideOverlayTimeoutIdRef.current) {
        clearTimeout(hideOverlayTimeoutIdRef.current);
      }
      setIsHamburgerMenuOpen(true);
      setIsOverlayVisible(true);
    }
  };

  useEffect(() => {
    setCurrentPath(window.location.pathname);
  });

  const headerListItems = headerPairs.map(([title, href]) => (
    <li>
      <a
        href={href}
        title={title}
        class={`hover:text-blue-600 ${currentPath === href ? "font-bold" : ""}`}
      >
        {title}
      </a>
    </li>
  ));

  return (
    <header class="sticky top-0 w-full flex flex-row py-2 z-10 bg-white dark:bg-[#0d1117]">
      <ul class="align-left space-x-4 flex-row pl-5 mr-auto hidden md:flex">
        {headerListItems}
      </ul>
      <button
        onClick={toggleHamburgerMenu}
        class="text-black dark:text-white ml-5 md:hidden"
        aria-labelledby="hamburgerButton"
      >
        {isHamburgerMenuOpen
          ? <XMarkIcon id="hamburgerButton" title="Close Side Nav" />
          : <Bars3Icon id="hamburgerButton" title="Open Side Nav" />}
      </button>
      <nav
        class={`${
          isHamburgerMenuOpen ? "translate-x-0" : "-translate-x-full"
        } transform transition-transform \
        duration-${hamburgerMenuTransitionDuration} ease-in-out fixed top-10 \
        left-0 h-screen w-64 bg-white dark:bg-[#0d1117] md:static flex md:hidden z-10`}
      >
        <ul class="md:flex items-center md:space-x-4 py-2 md:py-0 pl-5 space-y-4">
          {headerListItems}
        </ul>
      </nav>
      <div
        onClick={toggleHamburgerMenu}
        onTransitionEnd={() => {
          if (!isOverlayVisible) {
            setIsOverlayVisible(false);
          }
        }}
        class={`${
          isOverlayVisible
            ? "pointer-events-auto visible"
            : "pointer-events-none invisible"
        } ${
          isHamburgerMenuOpen ? "opacity-50" : "opacity-0"
        } z-9 fixed top-10 left-0 w-full h-full bg-black transition-opacity \
        duration-${hamburgerMenuTransitionDuration} ease-in-out md:hidden`}
      />
    </header>
  );
};
