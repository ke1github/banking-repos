"use client";

import { useState, useEffect } from "react";

export function useHydration() {
  const [isHydrated, setIsHydrated] = useState(false);

  // This effect runs once on mount, setting isHydrated to true
  useEffect(() => {
    setIsHydrated(true);
  }, []);

  return isHydrated;
}
