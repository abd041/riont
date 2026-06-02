import type { ReactNode } from "react";

type AdminPageHeaderProps = {
  title: string;
  description?: string;
  actions?: ReactNode;
};

export function AdminPageHeader({ title, description, actions }: AdminPageHeaderProps) {
  return (
    <header className="admin-page__header">
      <div>
        <h1 className="admin-page__title">{title}</h1>
        {description && <p className="admin-page__desc">{description}</p>}
      </div>
      {actions && <div className="admin-page__actions">{actions}</div>}
    </header>
  );
}
