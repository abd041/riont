"use client";

import { useState } from "react";
import { Search } from "lucide-react";
import { useTranslations } from "next-intl";
import { useRouter } from "@/i18n/navigation";
import { Input } from "@/components/ui/input";

export function ProductSearch({ className }: { className?: string }) {
  const t = useTranslations("common");
  const router = useRouter();
  const [query, setQuery] = useState("");

  function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    const term = query.trim();
    if (term) {
      router.push(`/products?q=${encodeURIComponent(term)}`);
      return;
    }
    router.push("/products");
  }

  return (
    <form onSubmit={handleSubmit} className={className}>
      <Search className="pointer-events-none absolute start-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--text-muted)]" />
      <Input
        type="search"
        name="q"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder={t("searchPlaceholder")}
        className="ps-10"
        aria-label={t("searchPlaceholder")}
      />
    </form>
  );
}
