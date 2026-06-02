import type { ReactNode } from "react";
import { cn } from "@/utils/cn";

type AdminDataTableProps = {
  columns: string[];
  children: ReactNode;
  scrollable?: boolean;
  className?: string;
};

export function AdminDataTable({
  columns,
  children,
  scrollable = false,
  className,
}: AdminDataTableProps) {
  return (
    <div
      className={cn(
        "admin-table-wrap",
        scrollable && "admin-table-wrap--scroll",
        className,
      )}
    >
      <table className="admin-table">
        <thead>
          <tr>
            {columns.map((column) => (
              <th key={column}>{column}</th>
            ))}
          </tr>
        </thead>
        <tbody>{children}</tbody>
      </table>
    </div>
  );
}

export function AdminTableEmpty({ colSpan, message }: { colSpan: number; message: string }) {
  return (
    <tr>
      <td colSpan={colSpan} className="admin-table__empty">
        {message}
      </td>
    </tr>
  );
}
