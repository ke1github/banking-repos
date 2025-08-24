"use client";

import { useRouter } from "next/navigation";

/**
 * A utility hook to navigate between pages with tablist version
 * @returns Functions to navigate between original and tablist versions
 */
export function useVersionNavigation() {
  const router = useRouter();

  /**
   * Navigate to a page with TabList version
   * @param path The path to navigate to
   */
  const navigateToTabListVersion = (path: string) => {
    const cleanPath = path.endsWith("/") ? path.slice(0, -1) : path;
    router.push(`${cleanPath}?version=tablist`);
  };

  /**
   * Navigate to the original version of a page
   * @param path The path to navigate to
   */
  const navigateToOriginalVersion = (path: string) => {
    const cleanPath = path.endsWith("/") ? path.slice(0, -1) : path;
    router.push(cleanPath);
  };

  return {
    navigateToTabListVersion,
    navigateToOriginalVersion,
  };
}

export default useVersionNavigation;
