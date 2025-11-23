"use client";

import * as React from "react";

const MOBILE_BREAKPOINT = 768;

export function useIsMobile() {
  const [isMobile, setIsMobile] = React.useState<boolean>(false); // Initialiser à false pour le rendu initial

  React.useEffect(() => {
    // Ce code ne s'exécute que côté client après l'hydratation
    const checkIsMobile = () => {
      setIsMobile(window.innerWidth < MOBILE_BREAKPOINT);
    };

    checkIsMobile(); // Définir l'état initial côté client

    const mql = window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT - 1}px)`);
    mql.addEventListener("change", checkIsMobile);

    return () => mql.removeEventListener("change", checkIsMobile);
  }, []);

  return isMobile;
}