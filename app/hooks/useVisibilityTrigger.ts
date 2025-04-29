import { useEffect, useRef } from "react";

type VisibiltyTriggerOption = {
  onVisible?: () => void;
  onHidden?: () => void;
};

export const useVisibilityTrigger = <T extends HTMLElement>(
  opts: IntersectionObserverInit & VisibiltyTriggerOption,
  dependencies: any[] = [],
) => {
  const targetRef = useRef<T | null>(null);
  const prevVisibility = useRef<boolean>(false);
  const { onVisible, onHidden } = opts;

  const intersectionCallback: IntersectionObserverCallback = (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting === prevVisibility.current) return;
      if (entry.isIntersecting) {
        prevVisibility.current = true;
        onVisible?.();
      } else {
        prevVisibility.current = false;
        onHidden?.();
      }
    });
  };

  useEffect(() => {
    const observer = new IntersectionObserver(intersectionCallback, opts);
    if (!targetRef.current) return;

    observer.observe(targetRef.current);
  }, [targetRef.current, ...dependencies]);

  return targetRef;
};
