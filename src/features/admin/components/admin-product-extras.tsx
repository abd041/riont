"use client";

import { useActionState, useEffect, useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  saveProductFieldsAction,
  saveProductRelatedAction,
  saveProductVariantsAction,
  type CatalogActionResult,
} from "@/server/actions/admin-catalog.actions";
import {
  PLAN_HIGHLIGHT_LABELS,
} from "@/lib/admin/labels";
import type { AdminProductField, AdminProductVariant } from "@/types/catalog";

const emptyVariant = (): AdminProductVariant => ({
  nameEn: "",
  nameAr: "",
  priceCents: 999,
  compareAtCents: null,
  offerLabelEn: "",
  offerLabelAr: "",
  benefitsEn: "",
  benefitsAr: "",
  planHighlight: "none",
  isDefault: false,
  sortOrder: 0,
});

const emptyField = (): AdminProductField => ({
  fieldKey: "",
  fieldType: "text",
  labelEn: "",
  labelAr: "",
  helpEn: "",
  helpAr: "",
  required: false,
  isSensitive: false,
  sortOrder: 0,
});

export function AdminProductExtras({
  productId,
  initialVariants,
  initialFields,
  initialRelatedIds,
  productOptions,
}: {
  productId: string;
  initialVariants: AdminProductVariant[];
  initialFields: AdminProductField[];
  initialRelatedIds: string[];
  productOptions: Array<{ id: string; name: string }>;
}) {
  const [variants, setVariants] = useState(initialVariants);
  const [fields, setFields] = useState(initialFields);
  const [relatedIds, setRelatedIds] = useState(initialRelatedIds);

  const [variantState, variantAction, savingVariants] = useActionState<
    CatalogActionResult | null,
    FormData
  >(saveProductVariantsAction, null);
  const [fieldState, fieldAction, savingFields] = useActionState<
    CatalogActionResult | null,
    FormData
  >(saveProductFieldsAction, null);
  const [relatedState, relatedAction, savingRelated] = useActionState<
    CatalogActionResult | null,
    FormData
  >(saveProductRelatedAction, null);

  useEffect(() => {
    if (variantState?.success) toast.success(variantState.message ?? "Saved");
    if (variantState?.success === false) toast.error(variantState.error);
  }, [variantState]);

  useEffect(() => {
    if (fieldState?.success) toast.success(fieldState.message ?? "Saved");
    if (fieldState?.success === false) toast.error(fieldState.error);
  }, [fieldState]);

  useEffect(() => {
    if (relatedState?.success) toast.success(relatedState.message ?? "Saved");
    if (relatedState?.success === false) toast.error(relatedState.error);
  }, [relatedState]);

  return (
    <div className="space-y-6">
      <section className="admin-panel admin-panel--flat">
        <h3 className="admin-panel__title">Plans / offer ladder</h3>
        <p className="mb-4 text-sm text-[var(--text-muted)]">
          Add month options (1 Month, 2 Months…) and/or service levels (Basic,
          Fast, VIP). Each option can have its own price, benefits, and a
          highlight badge (Best Value / Recommended / Most Popular).
        </p>

        <div className="space-y-4">
          {variants.map((variant, index) => (
            <div
              key={index}
              className="grid gap-3 rounded-md border border-[var(--border-subtle)] p-4 md:grid-cols-2"
            >
              <Input
                placeholder="Name (EN)"
                value={variant.nameEn}
                onChange={(e) =>
                  setVariants((rows) =>
                    rows.map((row, i) =>
                      i === index ? { ...row, nameEn: e.target.value } : row,
                    ),
                  )
                }
              />
              <Input
                placeholder="Name (AR)"
                value={variant.nameAr}
                onChange={(e) =>
                  setVariants((rows) =>
                    rows.map((row, i) =>
                      i === index ? { ...row, nameAr: e.target.value } : row,
                    ),
                  )
                }
              />
              <Input
                type="number"
                placeholder="Price cents"
                value={variant.priceCents}
                onChange={(e) =>
                  setVariants((rows) =>
                    rows.map((row, i) =>
                      i === index
                        ? { ...row, priceCents: Number(e.target.value) || 0 }
                        : row,
                    ),
                  )
                }
              />
              <Input
                type="number"
                placeholder="Compare-at cents"
                value={variant.compareAtCents ?? ""}
                onChange={(e) =>
                  setVariants((rows) =>
                    rows.map((row, i) =>
                      i === index
                        ? {
                            ...row,
                            compareAtCents: e.target.value ? Number(e.target.value) : null,
                          }
                        : row,
                    ),
                  )
                }
              />
              <Input
                placeholder="Offer label (EN) e.g. 20% OFF"
                value={variant.offerLabelEn ?? ""}
                onChange={(e) =>
                  setVariants((rows) =>
                    rows.map((row, i) =>
                      i === index ? { ...row, offerLabelEn: e.target.value } : row,
                    ),
                  )
                }
              />
              <Input
                placeholder="Offer label (AR)"
                value={variant.offerLabelAr ?? ""}
                onChange={(e) =>
                  setVariants((rows) =>
                    rows.map((row, i) =>
                      i === index ? { ...row, offerLabelAr: e.target.value } : row,
                    ),
                  )
                }
              />
              <label className="text-sm text-[var(--text-muted)] md:col-span-2">
                Benefits EN (one per line)
                <textarea
                  className="mt-1 flex min-h-[72px] w-full rounded-[var(--radius-md)] border border-[var(--border-default)] bg-surface px-3 py-2 text-sm"
                  value={variant.benefitsEn ?? ""}
                  onChange={(e) =>
                    setVariants((rows) =>
                      rows.map((row, i) =>
                        i === index ? { ...row, benefitsEn: e.target.value } : row,
                      ),
                    )
                  }
                  placeholder={"Priority handling\nBetter support\nLonger warranty"}
                />
              </label>
              <label className="text-sm text-[var(--text-muted)] md:col-span-2">
                Benefits AR (one per line)
                <textarea
                  className="mt-1 flex min-h-[72px] w-full rounded-[var(--radius-md)] border border-[var(--border-default)] bg-surface px-3 py-2 text-sm"
                  value={variant.benefitsAr ?? ""}
                  onChange={(e) =>
                    setVariants((rows) =>
                      rows.map((row, i) =>
                        i === index ? { ...row, benefitsAr: e.target.value } : row,
                      ),
                    )
                  }
                />
              </label>
              <label className="text-sm text-[var(--text-muted)]">
                Plan badge
                <select
                  className="mt-1 flex h-10 w-full rounded-[var(--radius-md)] border border-[var(--border-default)] bg-surface px-3 text-sm"
                  value={variant.planHighlight ?? "none"}
                  onChange={(e) =>
                    setVariants((rows) =>
                      rows.map((row, i) =>
                        i === index
                          ? {
                              ...row,
                              planHighlight: e.target.value as AdminProductVariant["planHighlight"],
                            }
                          : row,
                      ),
                    )
                  }
                >
                  {Object.entries(PLAN_HIGHLIGHT_LABELS).map(([value, label]) => (
                    <option key={value} value={value}>
                      {label}
                    </option>
                  ))}
                </select>
              </label>
              <div className="flex items-center gap-3">
                <label className="flex items-center gap-2 text-sm">
                  <input
                    type="radio"
                    name="defaultVariant"
                    checked={variant.isDefault}
                    onChange={() =>
                      setVariants((rows) =>
                        rows.map((row, i) => ({ ...row, isDefault: i === index })),
                      )
                    }
                  />
                  Default
                </label>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setVariants((rows) => rows.filter((_, i) => i !== index))}
                >
                  Remove
                </Button>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-4 flex flex-wrap gap-2">
          <Button type="button" variant="outline" onClick={() => setVariants((rows) => [...rows, emptyVariant()])}>
            Add option
          </Button>
          <form action={variantAction}>
            <input type="hidden" name="productId" value={productId} />
            <input type="hidden" name="variantsJson" value={JSON.stringify(variants)} readOnly />
            <Button type="submit" disabled={savingVariants}>
              {savingVariants ? "Saving…" : "Save options"}
            </Button>
          </form>
        </div>
      </section>

      <section className="admin-panel admin-panel--flat">
        <h3 className="admin-panel__title">Customer fields</h3>
        <p className="mb-4 text-sm text-[var(--text-muted)]">
          Only ask for what this product needs. Mark fields required or optional —
          customers are not forced to fill optional fields at checkout.
        </p>

        <div className="space-y-4">
          {fields.map((field, index) => (
            <div
              key={index}
              className="grid gap-3 rounded-md border border-[var(--border-subtle)] p-4 md:grid-cols-2"
            >
              <Input
                placeholder="Field key"
                value={field.fieldKey}
                onChange={(e) =>
                  setFields((rows) =>
                    rows.map((row, i) =>
                      i === index ? { ...row, fieldKey: e.target.value } : row,
                    ),
                  )
                }
              />
              <select
                value={field.fieldType}
                onChange={(e) =>
                  setFields((rows) =>
                    rows.map((row, i) =>
                      i === index ? { ...row, fieldType: e.target.value } : row,
                    ),
                  )
                }
                className="flex h-10 w-full rounded-[var(--radius-md)] border border-[var(--border-default)] bg-surface px-3 text-sm"
              >
                <option value="text">Text</option>
                <option value="email">Email</option>
                <option value="password">Password</option>
                <option value="textarea">Textarea</option>
                <option value="number">Number</option>
                <option value="url">URL</option>
              </select>
              <Input
                placeholder="Label (EN)"
                value={field.labelEn}
                onChange={(e) =>
                  setFields((rows) =>
                    rows.map((row, i) =>
                      i === index ? { ...row, labelEn: e.target.value } : row,
                    ),
                  )
                }
              />
              <Input
                placeholder="Label (AR)"
                value={field.labelAr}
                onChange={(e) =>
                  setFields((rows) =>
                    rows.map((row, i) =>
                      i === index ? { ...row, labelAr: e.target.value } : row,
                    ),
                  )
                }
              />
              <label className="flex items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  checked={field.required}
                  onChange={(e) =>
                    setFields((rows) =>
                      rows.map((row, i) =>
                        i === index ? { ...row, required: e.target.checked } : row,
                      ),
                    )
                  }
                />
                Required
              </label>
              <label className="flex items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  checked={field.isSensitive}
                  onChange={(e) =>
                    setFields((rows) =>
                      rows.map((row, i) =>
                        i === index ? { ...row, isSensitive: e.target.checked } : row,
                      ),
                    )
                  }
                />
                Sensitive
              </label>
              <Button
                type="button"
                variant="outline"
                onClick={() => setFields((rows) => rows.filter((_, i) => i !== index))}
              >
                Remove
              </Button>
            </div>
          ))}
        </div>

        <div className="mt-4 flex flex-wrap gap-2">
          <Button type="button" variant="outline" onClick={() => setFields((rows) => [...rows, emptyField()])}>
            Add field
          </Button>
          <form action={fieldAction}>
            <input type="hidden" name="productId" value={productId} />
            <input type="hidden" name="fieldsJson" value={JSON.stringify(fields)} readOnly />
            <Button type="submit" disabled={savingFields}>
              {savingFields ? "Saving…" : "Save fields"}
            </Button>
          </form>
        </div>
      </section>

      <section className="admin-panel admin-panel--flat">
        <h3 className="admin-panel__title">Related products</h3>
        <p className="mb-4 text-sm text-[var(--text-muted)]">
          Choose products to show under this product page.
        </p>

        <div className="grid gap-2 sm:grid-cols-2">
          {productOptions.map((option) => (
            <label key={option.id} className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={relatedIds.includes(option.id)}
                onChange={(e) => {
                  setRelatedIds((ids) =>
                    e.target.checked
                      ? [...ids, option.id]
                      : ids.filter((id) => id !== option.id),
                  );
                }}
              />
              {option.name}
            </label>
          ))}
        </div>

        <form action={relatedAction} className="mt-4">
          <input type="hidden" name="productId" value={productId} />
          <input type="hidden" name="relatedIdsJson" value={JSON.stringify(relatedIds)} readOnly />
          <Button type="submit" disabled={savingRelated}>
            {savingRelated ? "Saving…" : "Save related products"}
          </Button>
        </form>
      </section>
    </div>
  );
}
