import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { Compass } from "lucide-react";
import {
  PremiumPanel,
  StorefrontPageShell,
} from "@/components/shared";

export default async function NotFoundPage() {
  const t = await getTranslations("errors");

  return (
    <StorefrontPageShell variant="narrow">
      <PremiumPanel>
        <div className="sf-empty">
          <div className="sf-empty__icon">
            <Compass strokeWidth={1.5} />
          </div>
          <h1 className="sf-empty__title">{t("notFoundTitle")}</h1>
          <p className="sf-empty__desc">{t("notFoundDescription")}</p>
          <div className="sf-empty__action">
            <Link href="/" className="sf-btn-primary">
              {t("backHome")}
            </Link>
          </div>
        </div>
      </PremiumPanel>
    </StorefrontPageShell>
  );
}
