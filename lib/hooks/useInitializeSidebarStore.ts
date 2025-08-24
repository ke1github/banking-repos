"use client";

import { useEffect } from "react";
import { useSidebarMode } from "./useSidebarMode";

export function useInitializeSidebarStore() {
  const { hydrate } = useSidebarMode();

  useEffect(() => {
    // Hydrate the store on the client side
    hydrate();
  }, [hydrate]);
}
