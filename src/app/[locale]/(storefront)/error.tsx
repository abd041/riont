"use client";

import { useTranslations } from "next-intl";
import { ErrorState } from "@/components/ui/error-state";

export default function StorefrontError({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const t = useTranslations("errors");
  const tCommon = useTranslations("common");

  return (
    <div className="mx-auto max-w-content py-8">
      <ErrorState
        title={t("genericTitle")}
        description={t("genericDescription")}
        retryLabel={tCommon("retry")}
        onRetry={reset}
      />
    </div>
  );
}
