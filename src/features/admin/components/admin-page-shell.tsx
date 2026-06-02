import type { ReactNode } from "react";

type AdminPageShellProps = {
  children: ReactNode;
};

export function AdminPageShell({ children }: AdminPageShellProps) {
  return <div className="admin-page">{children}</div>;
}
