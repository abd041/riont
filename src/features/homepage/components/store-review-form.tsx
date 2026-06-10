"use client";

import { useActionState } from "react";
import { useTranslations } from "next-intl";
import {
  submitStoreReviewAction,
  type SubmitReviewActionResult,
} from "@/server/actions/review.actions";

type StoreReviewFormProps = {
  locale: string;
  isLoggedIn: boolean;
  userEmail?: string | null;
  userDisplayName?: string | null;
};

export function StoreReviewForm({
  locale,
  isLoggedIn,
  userEmail,
  userDisplayName,
}: StoreReviewFormProps) {
  const t = useTranslations("home");
  const [state, action, pending] = useActionState<
    SubmitReviewActionResult | null,
    FormData
  >(submitStoreReviewAction, null);

  const errorCode = state && !state.success ? state.code : null;

  return (
    <form action={action} className="mp-store-review-form">
      <input type="hidden" name="locale" value={locale} />

      <h3 className="mp-store-review-form__title">{t("writeStoreReview")}</h3>
      <p className="mp-store-review-form__hint">{t("storeReviewHint")}</p>

      {!isLoggedIn && (
        <>
          <label className="mp-store-review-form__label" htmlFor="storeReviewAuthorName">
            {t("storeReviewAuthorName")}
          </label>
          <input
            id="storeReviewAuthorName"
            name="authorName"
            required
            className="mp-store-review-form__input"
            disabled={pending}
          />
          <label className="mp-store-review-form__label" htmlFor="storeReviewGuestEmail">
            {t("storeReviewGuestEmail")}
          </label>
          <input
            id="storeReviewGuestEmail"
            name="guestEmail"
            type="email"
            required
            defaultValue={userEmail ?? ""}
            className="mp-store-review-form__input"
            disabled={pending}
          />
        </>
      )}

      {isLoggedIn && userDisplayName ? (
        <input type="hidden" name="authorName" value={userDisplayName} />
      ) : null}

      <label className="mp-store-review-form__label" htmlFor="storeReviewRating">
        {t("storeReviewRating")}
      </label>
      <select
        id="storeReviewRating"
        name="rating"
        required
        defaultValue={5}
        className="mp-store-review-form__input"
        disabled={pending}
      >
        {[5, 4, 3, 2, 1].map((value) => (
          <option key={value} value={value}>
            {value} / 5
          </option>
        ))}
      </select>

      <label className="mp-store-review-form__label" htmlFor="storeReviewBody">
        {t("storeReviewBody")}
      </label>
      <textarea
        id="storeReviewBody"
        name="body"
        required
        minLength={10}
        rows={3}
        className="mp-store-review-form__textarea"
        placeholder={t("storeReviewBodyPlaceholder")}
        disabled={pending}
      />

      {errorCode ? (
        <p className="mp-store-review-form__error" role="alert">
          {t(`storeReviewErrors.${errorCode}` as "storeReviewErrors.VALIDATION")}
        </p>
      ) : null}

      {state?.success ? (
        <p className="mp-store-review-form__success" role="status">
          {t("storeReviewSuccess")}
        </p>
      ) : null}

      <button type="submit" className="mp-store-review-form__submit" disabled={pending}>
        {pending ? t("storeReviewSubmitting") : t("storeReviewSubmit")}
      </button>
    </form>
  );
}
