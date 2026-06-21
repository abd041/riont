"use client";

import type { ReactNode } from "react";
import { ArrowLeft } from "lucide-react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { cn } from "@/utils/cn";

type StorefrontPageHeaderProps = {
  title: string;
  subtitle?: string;
  backHref?: string;
  backLabel?: string;
  meta?: ReactNode;
  actions?: ReactNode;
  className?: string;
};

/** Unified page header — matches homepage section hierarchy. */
export function StorefrontPageHeader({
  title,
  subtitle,
  backHref,
  backLabel,
  meta,
  actions,
  className,
}: StorefrontPageHeaderProps) {
  const tCommon = useTranslations("common");

  return (
    <header className={cn("sf-page__header", className)}>
      <div className="sf-page__header-start">
        {backHref && (
          <Link
            href={backHref}
            className="sf-page__back"
            aria-label={backLabel ?? tCommon("back")}
          >
            <ArrowLeft strokeWidth={1.5} aria-hidden />
          </Link>
        )}
        <div className="sf-page__header-copy">
          <h1 className="sf-page__title">{title}</h1>
          {subtitle && <p className="sf-page__subtitle">{subtitle}</p>}
        </div>
      </div>
      {(meta || actions) && (
        <div className="sf-page__header-end">
          {meta && <div className="sf-page__meta">{meta}</div>}
          {actions}
        </div>
      )}
    </header>
  );
}
