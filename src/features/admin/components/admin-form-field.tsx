import type { ReactNode } from "react";
import { cn } from "@/utils/cn";

export function AdminFormSection({
  title,
  description,
  step,
  children,
  className,
}: {
  title: string;
  description?: string;
  step?: number;
  children: ReactNode;
  className?: string;
}) {
  return (
    <section className={cn("admin-form-section", className)}>
      <header className="admin-form-section__head">
        {step != null && (
          <span className="admin-form-section__step" aria-hidden>
            {step}
          </span>
        )}
        <div>
          <h2 className="admin-form-section__title">{title}</h2>
          {description && (
            <p className="admin-form-section__desc">{description}</p>
          )}
        </div>
      </header>
      <div className="admin-form-section__body">{children}</div>
    </section>
  );
}

export function AdminFormField({
  label,
  hint,
  htmlFor,
  required,
  children,
  className,
}: {
  label: string;
  hint?: string;
  htmlFor?: string;
  required?: boolean;
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("admin-form-field", className)}>
      <label htmlFor={htmlFor} className="admin-form-field__label">
        {label}
        {required && (
          <span className="admin-form-field__required" aria-hidden>
            {" "}
            *
          </span>
        )}
      </label>
      {children}
      {hint && <p className="admin-form-field__hint">{hint}</p>}
    </div>
  );
}

export const adminSelectClassName =
  "mt-1 flex h-10 w-full rounded-[var(--radius-md)] border border-[var(--border-default)] bg-surface px-3 text-sm text-[var(--text-primary)]";

export const adminTextareaClassName =
  "mt-1 w-full rounded-[var(--radius-md)] border border-[var(--border-default)] bg-surface px-3 py-2 text-sm text-[var(--text-primary)] placeholder:text-[var(--text-muted)] focus:border-[var(--border-glow)] focus:outline-none";
