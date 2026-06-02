"use client";

import { useTranslations } from "next-intl";
import { ErrorState } from "@/components/ui/error-state";
import { StorefrontPageShell } from "@/components/shared/storefront-page-shell";

export default function StorefrontError({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const t = useTranslations("errors");
  const tCommon = useTranslations("common");

  return (
    <StorefrontPageShell variant="narrow">
      <ErrorState
        title={t("genericTitle")}
        description={t("genericDescription")}
        retryLabel={tCommon("retry")}
        onRetry={reset}
      />
    </StorefrontPageShell>
  );
}
