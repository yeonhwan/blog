import { useEffect, useRef, RefObject } from "react";

export const useAutoBlur = <T extends HTMLElement>(
  toggle: boolean,
): RefObject<T | null> => {
  const triggerRef = useRef<T>(null);

  useEffect(() => {
    const focusedEl = document.activeElement;
    if (toggle && focusedEl === triggerRef.current) {
      triggerRef.current?.blur();
    }
  }, [toggle]);

  return triggerRef;
};
