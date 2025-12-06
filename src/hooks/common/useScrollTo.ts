import { useRef, useEffect, useState, useCallback, useMemo } from "react";

// See:
// - Keep overflow div scrolled to bottom unless user scrolls up https://stackoverflow.com/a/21067431/13351497
// - https://developer.mozilla.org/en-US/docs/Web/API/Element/scrollHeight#determine_if_an_element_has_been_totally_scrolled

/**
 * Hook for scrolling to the top or bottom of an element
 * @param position The position to scroll to
 * @returns The ref to the element, a scroll state check and a function to scroll
 */
export default function useScrollTo(position: "top" | "bottom") {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [isScrolledToPosition, setIsScrolledToPosition] = useState(false);

  const checkScrollIsAtPosition = useMemo(() => {
    switch (position) {
      case "top":
        return (element: HTMLDivElement) => element.scrollTop === 0;

      case "bottom":
        return (element: HTMLDivElement) =>
          Math.abs(element.scrollHeight - element.clientHeight - element.scrollTop) <= 1;

      default:
        return () => false;
    }
  }, [position]);

  const handleScroll = useCallback(() => {
    if (!scrollRef.current) return;

    // Only set the state if the position has changed
    if (checkScrollIsAtPosition(scrollRef.current)) {
      if (!isScrolledToPosition) setIsScrolledToPosition(true);
    } else {
      if (isScrolledToPosition) setIsScrolledToPosition(false);
    }
  }, [checkScrollIsAtPosition, isScrolledToPosition]);

  useEffect(() => {
    const ref = scrollRef.current;
    if (!ref) return undefined;

    // Set the initial state
    setIsScrolledToPosition(checkScrollIsAtPosition(ref));

    ref.addEventListener("scroll", handleScroll);
    return () => ref.removeEventListener("scroll", handleScroll);
  }, [checkScrollIsAtPosition, handleScroll, scrollRef]);

  const scrollToPosition =
    position === "top"
      ? () => scrollRef.current?.scrollTo({ top: 0 })
      : () => scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight });

  return {
    scrollRef,
    isScrolledToPosition,
    scrollToPosition,
  };
}
