import { useEffect, useRef } from "react";

export function useAutoScroll<T extends HTMLElement>(deps: any[] = []) {
  const ref = useRef<T | null>(null);

  useEffect(() => {
    const el = ref.current;
    if (el) {
      el.scrollTop = el.scrollHeight;
    }
  }, deps); // runs whenever your dependencies (like messages) change

  return ref;
}