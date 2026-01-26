"use client";

import { usePathname, useSearchParams } from "next/navigation";
import { useEffect } from "react";

/**
 * Component that shows a loading cursor during page navigation.
 * Uses CSS to change cursor to 'progress' when navigating.
 */
export function NavigationProgress() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // biome-ignore lint/correctness/useExhaustiveDependencies: pathname and searchParams are needed to reset cursor on route change
  useEffect(() => {
    // Reset cursor when navigation completes
    document.body.style.cursor = "";

    // Add click listener to links for immediate feedback
    const handleClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const link = target.closest("a");

      if (link) {
        const href = link.getAttribute("href");
        const isInternal =
          href &&
          !href.startsWith("http") &&
          !href.startsWith("mailto:") &&
          !href.startsWith("tel:") &&
          !link.hasAttribute("target");

        if (isInternal) {
          document.body.style.cursor = "progress";
        }
      }
    };

    document.addEventListener("click", handleClick);

    return () => {
      document.removeEventListener("click", handleClick);
      document.body.style.cursor = "";
    };
  }, [pathname, searchParams]);

  return null;
}
