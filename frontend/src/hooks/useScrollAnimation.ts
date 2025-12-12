import { useAnimationControls } from "framer-motion";
import { useEffect, useRef, type MutableRefObject } from "react";

type UseScrollAnimationOptions = {
  threshold?: number;
  rootMargin?: string;
  once?: boolean;
};

type UseScrollAnimationReturn = {
  ref: MutableRefObject<HTMLElement | null>;
  controls: ReturnType<typeof useAnimationControls>;
};

export function useScrollAnimation(
  options?: UseScrollAnimationOptions
): UseScrollAnimationReturn {
  const { threshold = 0.2, rootMargin = "0px", once = true } = options ?? {};
  const ref = useRef<HTMLElement | null>(null);
  const controls = useAnimationControls();

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    controls.set("hidden");

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          controls.start("visible");
          if (once) {
            observer.disconnect();
          }
        } else if (!once) {
          controls.start("hidden");
        }
      },
      { threshold, rootMargin }
    );

    observer.observe(element);

    return () => observer.disconnect();
  }, [controls, once, rootMargin, threshold]);

  return { ref, controls };
}
