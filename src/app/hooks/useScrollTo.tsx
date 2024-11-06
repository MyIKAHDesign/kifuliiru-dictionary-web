// hooks/useScrollTo.ts
import { useCallback } from "react";

export function useScrollTo() {
  const scrollTo = useCallback((elementId: string) => {
    const element = document.getElementById(elementId);
    if (element) {
      // Calculate the element's position relative to the viewport
      const elementRect = element.getBoundingClientRect();
      const absoluteElementTop = elementRect.top + window.pageYOffset;
      const middle =
        absoluteElementTop - window.innerHeight / 2 + elementRect.height / 2;

      // Get the total distance to scroll
      const startPosition = window.pageYOffset;
      const distance = middle - startPosition;

      // Increased duration for slower scroll (2000ms = 2 seconds)
      const duration = 2000;
      let start: number | null = null;

      // Custom animation function
      function animation(currentTime: number) {
        if (start === null) start = currentTime;
        const timeElapsed = currentTime - start;
        const progress = Math.min(timeElapsed / duration, 1);

        // Enhanced easing function for smoother movement
        const easeProgress = easeInOutCubic(progress);

        const currentPosition = startPosition + distance * easeProgress;
        window.scrollTo(0, currentPosition);

        if (timeElapsed < duration) {
          requestAnimationFrame(animation);
        }
      }

      // Enhanced easing function (cubic)
      function easeInOutCubic(t: number): number {
        return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
      }

      // Start the animation
      requestAnimationFrame(animation);
    }
  }, []);

  return scrollTo;
}
