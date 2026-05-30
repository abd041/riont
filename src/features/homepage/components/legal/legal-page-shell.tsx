import type { ReactNode } from "react";

type LegalPageShellProps = {
  title: string;
  children: ReactNode;
};

export function LegalPageShell({ title, children }: LegalPageShellProps) {
  return (
    <div className="mp-legal-page">
      <h1 className="mp-legal-page__title">{title}</h1>
      <div className="mp-legal-page__body">{children}</div>
    </div>
  );
}
