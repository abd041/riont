"use client";

import { useActionState } from "react";
import { useTranslations } from "next-intl";
import {
  submitProductReviewAction,
  type SubmitReviewActionResult,
} from "@/server/actions/review.actions";
import { ReviewRatingField } from "./review-rating-field";

export function ProductReviewForm({
  productId,
  productSlug,
  locale,
  isLoggedIn,
  userEmail,
  userDisplayName,
}: {
  productId: string;
  productSlug: string;
  locale: string;
  isLoggedIn: boolean;
  userEmail?: string | null;
  userDisplayName?: string | null;
}) {
  const t = useTranslations("product");
  const [state, action, pending] = useActionState<
    SubmitReviewActionResult | null,
    FormData
  >(submitProductReviewAction, null);

  const errorCode = state && !state.success ? state.code : null;

  return (
    <form action={action} className="nex-pdp-review-form">
      <input type="hidden" name="productId" value={productId} />
      <input type="hidden" name="productSlug" value={productSlug} />
      <input type="hidden" name="locale" value={locale} />

      <h3 className="nex-pdp-review-form__title">{t("writeReview")}</h3>
      <p className="nex-pdp-review-form__hint">{t("reviewModerationHint")}</p>

      {!isLoggedIn && (
        <>
          <label className="nex-pdp-review-form__label" htmlFor="reviewAuthorName">
            {t("reviewAuthorName")}
          </label>
          <input
            id="reviewAuthorName"
            name="authorName"
            required
            className="nex-pdp-review-form__input"
            disabled={pending}
          />
          <label className="nex-pdp-review-form__label" htmlFor="reviewGuestEmail">
            {t("reviewGuestEmail")}
          </label>
          <input
            id="reviewGuestEmail"
            name="guestEmail"
            type="email"
            required
            defaultValue={userEmail ?? ""}
            className="nex-pdp-review-form__input"
            disabled={pending}
          />
        </>
      )}

      {isLoggedIn && userDisplayName ? (
        <input type="hidden" name="authorName" value={userDisplayName} />
      ) : null}

      <ReviewRatingField
        id="reviewRating"
        name="rating"
        label={t("reviewRating")}
        defaultValue={5}
        disabled={pending}
      />

      <label className="nex-pdp-review-form__label" htmlFor="reviewBody">
        {t("reviewBody")}
      </label>
      <textarea
        id="reviewBody"
        name="body"
        required
        minLength={10}
        rows={4}
        className="nex-pdp-review-form__textarea"
        placeholder={t("reviewBodyPlaceholder")}
        disabled={pending}
      />

      {errorCode ? (
        <p className="nex-pdp-review-form__error" role="alert">
          {t(`reviewErrors.${errorCode}` as "reviewErrors.VALIDATION")}
        </p>
      ) : null}

      {state?.success ? (
        <p className="nex-pdp-review-form__success" role="status">
          {t("reviewSubmitted")}
        </p>
      ) : null}

      <button type="submit" className="nex-pdp-review-form__submit" disabled={pending}>
        {pending ? t("reviewSubmitting") : t("reviewSubmit")}
      </button>
    </form>
  );
}
