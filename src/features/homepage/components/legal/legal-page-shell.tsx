import type { ReactNode } from "react";
import { StorefrontPageShell } from "@/components/shared/storefront-page-shell";

type LegalPageShellProps = {
  title: string;
  children: ReactNode;
  updated?: string;
};

export function LegalPageShell({ title, children, updated }: LegalPageShellProps) {
  return (
    <StorefrontPageShell variant="narrow">
      <div className="sf-legal-page">
        <h1 className="sf-legal-page__title">{title}</h1>
        {updated && <p className="sf-legal-page__updated">{updated}</p>}
        <div className="sf-legal-page__body">{children}</div>
      </div>
    </StorefrontPageShell>
  );
}
