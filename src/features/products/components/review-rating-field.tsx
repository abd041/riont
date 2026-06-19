"use client";

import { useState } from "react";
import { Star } from "lucide-react";
import { cn } from "@/lib/utils/cn";

type ReviewRatingFieldProps = {
  id: string;
  name: string;
  label: string;
  defaultValue?: number;
  disabled?: boolean;
};

export function ReviewRatingField({
  id,
  name,
  label,
  defaultValue = 5,
  disabled,
}: ReviewRatingFieldProps) {
  const [rating, setRating] = useState(defaultValue);
  const [hover, setHover] = useState<number | null>(null);

  const display = hover ?? rating;

  return (
    <div className="nex-review-rating">
      <span id={`${id}-label`} className="nex-review-rating__label">
        {label}
      </span>
      <input type="hidden" name={name} value={rating} />
      <div
        role="radiogroup"
        aria-labelledby={`${id}-label`}
        className="nex-review-rating__control"
        onMouseLeave={() => setHover(null)}
      >
        <div className="nex-review-rating__stars">
          {[1, 2, 3, 4, 5].map((value) => {
            const active = value <= display;
            return (
              <button
                key={value}
                id={value === rating ? id : undefined}
                type="button"
                role="radio"
                aria-checked={rating === value}
                aria-label={`${value} / 5`}
                disabled={disabled}
                className={cn(
                  "nex-review-rating__star-btn",
                  active && "nex-review-rating__star-btn--active",
                )}
                onClick={() => setRating(value)}
                onMouseEnter={() => setHover(value)}
                onFocus={() => setHover(value)}
                onBlur={() => setHover(null)}
              >
                <Star
                  strokeWidth={1.75}
                  className={cn(
                    "nex-review-rating__star-icon",
                    active && "nex-review-rating__star-icon--filled",
                  )}
                />
              </button>
            );
          })}
        </div>
        <span className="nex-review-rating__value" aria-live="polite">
          {rating} / 5
        </span>
      </div>
    </div>
  );
}
