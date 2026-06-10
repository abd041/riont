"use client";

import {
  Gamepad2,
  Crown,
  Gift,
  Users,
  FileCog,
  LayoutGrid,
  ChevronRight,
  type LucideIcon,
} from "lucide-react";
import { useTranslations } from "next-intl";
import { Link, useRouter } from "@/i18n/navigation";
import { useSearchParams } from "next/navigation";
import { cn } from "@/lib/utils/cn";
import type { CatalogCategory } from "@/types/catalog";

const SLUG_ICON: Record<string, LucideIcon> = {
  gaming: Gamepad2,
  games: Gamepad2,
  software: FileCog,
  subscriptions: Crown,
  "gift-cards": Gift,
  gifts: Gift,
  accounts: Users,
  instagram: Users,
};

const PLATFORMS = [
  { id: "windows", labelKey: "platformWindows" as const, categories: ["software"] },
  { id: "playstation", labelKey: "platformPlayStation" as const, categories: ["gaming"] },
  { id: "xbox", labelKey: "platformXbox" as const, categories: ["gaming"] },
  { id: "steam", labelKey: "platformSteam" as const, categories: ["gaming"] },
  { id: "nintendo", labelKey: "platformNintendo" as const, categories: ["gaming"] },
] as const;

const MAX_PRICE_CENTS = 100_000;

type ProductsFilterSidebarProps = {
  categories: CatalogCategory[];
  activeCategorySlug?: string | null;
  onNavigate?: () => void;
};

export function ProductsFilterSidebar({
  categories,
  activeCategorySlug,
  onNavigate,
}: ProductsFilterSidebarProps) {
  const t = useTranslations("catalog");
  const router = useRouter();
  const searchParams = useSearchParams();

  const maxPriceParam = searchParams.get("maxPrice");
  const maxPriceCents = maxPriceParam
    ? Math.min(MAX_PRICE_CENTS, Math.max(0, Number(maxPriceParam) || MAX_PRICE_CENTS))
    : MAX_PRICE_CENTS;

  const activePlatforms = searchParams.getAll("platform");

  function updateParams(mutate: (params: URLSearchParams) => void) {
    const params = new URLSearchParams(searchParams.toString());
    mutate(params);
    const qs = params.toString();
    router.push(qs ? `/products?${qs}` : "/products");
  }

  function togglePlatform(id: string) {
    updateParams((params) => {
      const current = params.getAll("platform");
      params.delete("platform");
      if (current.includes(id)) {
        current.filter((p) => p !== id).forEach((p) => params.append("platform", p));
      } else {
        [...current, id].forEach((p) => params.append("platform", p));
      }
    });
  }

  function clearFilters() {
    router.push("/products");
  }

  function handleNavigate() {
    onNavigate?.();
  }

  return (
    <aside className="nex-browse-filters">
      <section className="nex-browse-filter-section" aria-labelledby="browse-filter-categories">
        <h3 id="browse-filter-categories" className="nex-browse-filter-title">
          {t("categories")}
        </h3>
        <ul className="nex-browse-cat-list">
          <li>
            <Link
              href="/products"
              className={cn(
                "nex-browse-cat-link",
                !activeCategorySlug && "nex-browse-cat-link--active",
              )}
              onClick={handleNavigate}
            >
              <LayoutGrid className="nex-browse-cat-icon" strokeWidth={1.5} />
              <span className="nex-browse-cat-label">{t("allCategories")}</span>
              <ChevronRight className="nex-browse-cat-chevron" strokeWidth={1.5} />
            </Link>
          </li>
          {categories.map((cat) => {
            const Icon = SLUG_ICON[cat.slug.toLowerCase()] ?? Gamepad2;
            const href = `/products?category=${cat.slug}`;
            return (
              <li key={cat.id}>
                <Link
                  href={href}
                  className={cn(
                    "nex-browse-cat-link",
                    activeCategorySlug === cat.slug && "nex-browse-cat-link--active",
                  )}
                  onClick={handleNavigate}
                >
                  <Icon className="nex-browse-cat-icon" strokeWidth={1.5} />
                  <span className="nex-browse-cat-label">{cat.name}</span>
                  <ChevronRight className="nex-browse-cat-chevron" strokeWidth={1.5} />
                </Link>
              </li>
            );
          })}
        </ul>
      </section>

      <section className="nex-browse-filter-section" aria-labelledby="browse-filter-price">
        <h3 id="browse-filter-price" className="nex-browse-filter-title">
          {t("priceRange")}
        </h3>
        <div className="nex-browse-price-values">
          <span dir="ltr">$0</span>
          <span dir="ltr">${Math.round(maxPriceCents / 100)}</span>
        </div>
        <input
          type="range"
          min={0}
          max={MAX_PRICE_CENTS}
          step={500}
          value={maxPriceCents}
          className="nex-browse-range"
          aria-label={t("priceRange")}
          onChange={(e) => {
            const value = Number(e.target.value);
            updateParams((params) => {
              if (value >= MAX_PRICE_CENTS) params.delete("maxPrice");
              else params.set("maxPrice", String(value));
            });
          }}
        />
      </section>

      <section className="nex-browse-filter-section" aria-labelledby="browse-filter-platform">
        <h3 id="browse-filter-platform" className="nex-browse-filter-title">
          {t("platform")}
        </h3>
        <div className="nex-browse-platform-list">
          {PLATFORMS.map(({ id, labelKey }) => (
            <label key={id} className="nex-browse-check">
              <input
                type="checkbox"
                checked={activePlatforms.includes(id)}
                onChange={() => togglePlatform(id)}
              />
              {t(labelKey)}
            </label>
          ))}
        </div>
      </section>

      <button
        type="button"
        className="nex-browse-clear"
        onClick={() => {
          clearFilters();
          handleNavigate();
        }}
      >
        {t("clearFilters")}
      </button>
    </aside>
  );
}

export function filterProductsByPlatform<T extends { categorySlug?: string }>(
  products: T[],
  platformIds: string[],
): T[] {
  if (platformIds.length === 0) return products;
  const allowedSlugs = new Set<string>();
  for (const id of platformIds) {
    const platform = PLATFORMS.find((p) => p.id === id);
    platform?.categories.forEach((s) => allowedSlugs.add(s));
  }
  if (allowedSlugs.size === 0) return products;
  return products.filter((p) =>
    p.categorySlug ? allowedSlugs.has(p.categorySlug) : true,
  );
}

export { MAX_PRICE_CENTS };
