"use client";

import { cn } from "@/utils/cn";

export function MarketplaceGridPagination({
  page,
  totalPages,
  onPageChange,
  ariaLabel,
}: {
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  ariaLabel: string;
}) {
  if (totalPages <= 1) return null;

  return (
    <nav className="mp-grid-pagination" aria-label={ariaLabel}>
      {Array.from({ length: totalPages }, (_, index) => {
        const pageNumber = index + 1;
        const isActive = pageNumber === page;

        return (
          <button
            key={pageNumber}
            type="button"
            className={cn(
              "mp-grid-pagination__btn",
              isActive && "mp-grid-pagination__btn--active",
            )}
            aria-current={isActive ? "page" : undefined}
            onClick={() => onPageChange(pageNumber)}
          >
            {pageNumber}
          </button>
        );
      })}
    </nav>
  );
}
