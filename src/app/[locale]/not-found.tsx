import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { Button } from "@/components/ui/button";

export default async function NotFoundPage() {
  const t = await getTranslations("errors");

  return (
    <div className="flex min-h-[60vh] items-center justify-center p-6">
      <div className="glass-card max-w-md rounded-[var(--radius-lg)] p-10 text-center">
        <h1 className="text-2xl font-bold">{t("notFoundTitle")}</h1>
        <p className="mt-2 text-sm text-[var(--text-muted)]">
          {t("notFoundDescription")}
        </p>
        <Button className="mt-6" asChild>
          <Link href="/">{t("backHome")}</Link>
        </Button>
      </div>
    </div>
  );
}
