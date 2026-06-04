"use client";

import { useEffect, useRef, useState } from "react";
import { Search } from "lucide-react";
import { useTranslations } from "next-intl";
import { useRouter } from "@/i18n/navigation";

export function ProductSearch({ className }: { className?: string }) {
  const t = useTranslations("common");
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);
  const [query, setQuery] = useState("");

  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        inputRef.current?.focus();
      }
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

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
    <form
      onSubmit={handleSubmit}
      className={`nex-search relative flex w-full items-center ${className ?? ""}`}
    >
      <Search className="pointer-events-none absolute start-4 h-[18px] w-[18px] text-[var(--text-muted)]" />
      <input
        ref={inputRef}
        type="search"
        name="q"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder={t("searchPlaceholder")}
        aria-label={t("searchPlaceholder")}
        className="nex-search-input h-full w-full bg-transparent ps-11 pe-3 text-base text-white placeholder:text-[var(--text-muted)] focus:outline-none sm:pe-[4.5rem] sm:text-sm"
      />
      <kbd className="nex-search-kbd pointer-events-none absolute end-3 hidden px-2 py-1 font-mono sm:inline">
        {t("searchShortcut")}
      </kbd>
    </form>
  );
}
