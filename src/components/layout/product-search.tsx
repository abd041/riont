"use client";

import { useEffect, useRef, useState } from "react";
import { Search } from "lucide-react";
import { useTranslations } from "next-intl";
import { useRouter } from "@/i18n/navigation";

export function ProductSearch({
  className,
  autoFocus = false,
}: {
  className?: string;
  autoFocus?: boolean;
}) {
  const t = useTranslations("common");
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);
  const [query, setQuery] = useState("");
  const [compactPlaceholder, setCompactPlaceholder] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(max-width: 639px)");
    const update = () => setCompactPlaceholder(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  useEffect(() => {
    if (!autoFocus) return;
    const id = window.requestAnimationFrame(() => inputRef.current?.focus());
    return () => window.cancelAnimationFrame(id);
  }, [autoFocus]);

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
        placeholder={
          compactPlaceholder
            ? t("searchPlaceholderShort")
            : t("searchPlaceholder")
        }
        aria-label={t("searchPlaceholder")}
        className="nex-search-input h-full w-full min-w-0 bg-transparent ps-10 pe-2 text-base text-white placeholder:text-[var(--text-muted)] focus:outline-none max-sm:ps-9 sm:pe-[4.5rem] sm:ps-11 sm:text-sm"
      />
      <kbd className="nex-search-kbd pointer-events-none absolute end-3 hidden px-2 py-1 font-mono sm:inline">
        {t("searchShortcut")}
      </kbd>
    </form>
  );
}
