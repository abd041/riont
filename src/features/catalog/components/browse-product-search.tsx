"use client";

import { useEffect, useRef, useState } from "react";
import { Search } from "lucide-react";
import { useTranslations } from "next-intl";
import { useRouter } from "@/i18n/navigation";

export function BrowseProductSearch({
  defaultQuery = "",
  className,
}: {
  defaultQuery?: string;
  className?: string;
}) {
  const t = useTranslations("catalog");
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);
  const [query, setQuery] = useState(defaultQuery);

  useEffect(() => {
    setQuery(defaultQuery);
  }, [defaultQuery]);

  function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    const term = query.trim();
    const params = new URLSearchParams(window.location.search);
    if (term) params.set("q", term);
    else params.delete("q");
    const qs = params.toString();
    router.push(qs ? `/products?${qs}` : "/products");
  }

  return (
    <form
      onSubmit={handleSubmit}
      className={`nex-search nex-browse-search relative flex items-center ${className ?? ""}`}
    >
      <Search className="pointer-events-none absolute start-4 h-[18px] w-[18px] text-[var(--text-muted)]" />
      <input
        ref={inputRef}
        type="search"
        name="q"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder={t("searchProducts")}
        aria-label={t("searchProducts")}
        className="h-full w-full rounded-[inherit] bg-transparent ps-11 pe-4 text-sm text-white placeholder:text-[var(--text-muted)] focus:outline-none"
      />
    </form>
  );
}
