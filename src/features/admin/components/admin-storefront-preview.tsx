"use client";

import { useState } from "react";
import { RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";

export function AdminStorefrontPreview() {
  const [locale, setLocale] = useState<"en" | "ar">("en");
  const [frameKey, setFrameKey] = useState(0);

  return (
    <aside className="admin-storefront-preview" aria-label="Live storefront preview">
      <div className="admin-storefront-preview__toolbar">
        <p className="admin-storefront-preview__label">Live preview</p>
        <div className="admin-storefront-preview__actions">
          <div className="admin-storefront-preview__locales" role="group" aria-label="Preview language">
            {(["en", "ar"] as const).map((code) => (
              <button
                key={code}
                type="button"
                className={
                  locale === code
                    ? "admin-storefront-preview__locale admin-storefront-preview__locale--active"
                    : "admin-storefront-preview__locale"
                }
                aria-pressed={locale === code}
                onClick={() => setLocale(code)}
              >
                {code === "en" ? "English" : "Arabic"}
              </button>
            ))}
          </div>
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="admin-storefront-preview__refresh"
            onClick={() => setFrameKey((k) => k + 1)}
          >
            <RefreshCw className="h-3.5 w-3.5" aria-hidden />
            Refresh
          </Button>
        </div>
      </div>
      <div className="admin-storefront-preview__frame-wrap">
        <iframe
          key={`${locale}-${frameKey}`}
          src={`/${locale}`}
          title={`Storefront preview (${locale})`}
          className="admin-storefront-preview__frame"
          loading="lazy"
        />
      </div>
      <p className="admin-storefront-preview__hint">
        Cover text also has a live draft preview on Admin → Homepage before you
        save. After saving theme/image/extras, click Refresh here to see the
        public homepage.
      </p>
    </aside>
  );
}
