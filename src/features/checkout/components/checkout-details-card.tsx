"use client";

import { UserRound } from "lucide-react";
import { useTranslations } from "next-intl";
import type { CheckoutField } from "@/types/order";
import { CheckoutMotionItem } from "./checkout-motion";

type CheckoutDetailsCardProps = {
  fields: CheckoutField[];
  fieldValues: Record<string, string>;
  onFieldChange: (key: string, value: string) => void;
  isLoggedIn: boolean;
  userEmail?: string | null;
  pending: boolean;
};

export function CheckoutDetailsCard({
  fields,
  fieldValues,
  onFieldChange,
  isLoggedIn,
  userEmail,
  pending,
}: CheckoutDetailsCardProps) {
  const t = useTranslations("checkout");

  return (
    <CheckoutMotionItem className="nex-co-card nex-co-card--details">
      <div className="nex-co-card-head">
        <div className="nex-co-card-icon-wrap" aria-hidden>
          <UserRound className="nex-co-card-icon" strokeWidth={1.5} />
        </div>
        <div>
          <h2 className="nex-co-card-title">{t("yourDetails")}</h2>
          <p className="nex-co-card-desc">{t("yourDetailsDesc")}</p>
        </div>
      </div>

      <div className="nex-co-card-body">
        {!isLoggedIn && (
          <div className="nex-co-field">
            <label htmlFor="guestEmail" className="nex-co-label">
              {t("guestEmail")}
            </label>
            <input
              id="guestEmail"
              name="guestEmail"
              type="email"
              required
              defaultValue={userEmail ?? ""}
              disabled={pending}
              className="nex-co-input"
              placeholder={t("guestEmailPlaceholder")}
            />
          </div>
        )}

        {fields.map((field) => (
          <CheckoutDynamicField
            key={field.id}
            field={field}
            fieldValues={fieldValues}
            onFieldChange={onFieldChange}
            pending={pending}
          />
        ))}

        <div className="nex-co-field">
          <label htmlFor="customerNote" className="nex-co-label">
            {t("orderNote")}
          </label>
          <textarea
            id="customerNote"
            name="customerNote"
            rows={4}
            disabled={pending}
            className="nex-co-textarea"
            placeholder={t("orderNotePlaceholder")}
          />
        </div>
      </div>
    </CheckoutMotionItem>
  );
}

export function CheckoutDynamicField({
  field,
  fieldValues,
  onFieldChange,
  pending,
  inputId,
}: {
  field: CheckoutField;
  fieldValues: Record<string, string>;
  onFieldChange: (key: string, value: string) => void;
  pending: boolean;
  inputId?: string;
}) {
  const id = inputId ?? field.fieldKey;
  return (
    <div className="nex-co-field">
      <label htmlFor={id} className="nex-co-label">
        {field.label}
        {field.required ? <span className="nex-co-required"> *</span> : null}
      </label>
      {field.fieldType === "textarea" ? (
        <textarea
          id={id}
          required={field.required}
          disabled={pending}
          rows={4}
          value={fieldValues[field.fieldKey] ?? ""}
          onChange={(e) => onFieldChange(field.fieldKey, e.target.value)}
          className="nex-co-textarea"
        />
      ) : (
        <input
          id={id}
          type={
            field.fieldType === "password"
              ? "password"
              : field.fieldType === "email"
                ? "email"
                : "text"
          }
          required={field.required}
          disabled={pending}
          value={fieldValues[field.fieldKey] ?? ""}
          onChange={(e) => onFieldChange(field.fieldKey, e.target.value)}
          className="nex-co-input"
        />
      )}
      {field.helpText ? <p className="nex-co-field-hint">{field.helpText}</p> : null}
    </div>
  );
}
