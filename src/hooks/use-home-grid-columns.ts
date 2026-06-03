"use client";

import { useEffect, useState } from "react";

/** Match `.mp-browse-section--primary .mp-grid__inner` column breakpoints. */
function getHomeGridColumns(width: number): number {
  if (width >= 1024) return 5;
  if (width >= 640) return 4;
  if (width >= 480) return 3;
  return 2;
}

export function useHomeGridColumns(): number {
  const [columns, setColumns] = useState(2);

  useEffect(() => {
    const update = () => setColumns(getHomeGridColumns(window.innerWidth));
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  return columns;
}

export const HOME_FEATURED_GRID_ROWS = 3;
