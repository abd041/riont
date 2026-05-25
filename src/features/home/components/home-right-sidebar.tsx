import { getTranslations } from "next-intl/server";
import Image from "next/image";
import { Link } from "@/i18n/navigation";
import { Zap, Shield, Clock, Award } from "lucide-react";
import { listBestSellingProducts } from "@/server/services/product.service";
import { HomeBestSellerRow } from "./home-best-seller-row";
import { getLocale } from "next-intl/server";
import { HomeMotionSection } from "@/features/home/motion/home-motion-section";
import { HomeMotionStagger } from "@/features/home/motion/home-motion-stagger";

const iconStroke = 1.5;

export async function HomeRightSidebar() {
  const t = await getTranslations("home");
  const tCommon = await getTranslations("common");
  const locale = await getLocale();
  const bestSellers = await listBestSellingProducts(locale, 3);

  const whyItems = [
    { icon: Zap, title: t("whyInstantTitle"), desc: t("whyInstantDesc") },
    { icon: Shield, title: t("whySecureTitle"), desc: t("whySecureDesc") },
    { icon: Clock, title: t("whySupportTitle"), desc: t("whySupportDesc") },
    { icon: Award, title: t("whyQualityTitle"), desc: t("whyQualityDesc") },
  ];

  return (
    <aside className="home-right-sidebar hidden w-[var(--right-sidebar-width)] shrink-0 flex-col xl:flex">
      <HomeMotionSection>
        <section className="nex-rs-card">
          <h2 className="nex-rs-section-label">{t("whyChooseUs")}</h2>
          <HomeMotionStagger as="ul" className="nex-rs-feature-list">
            {whyItems.map(({ icon: Icon, title, desc }) => (
              <div key={title} className="nex-rs-feature">
                <span className="nex-rs-icon">
                  <Icon strokeWidth={iconStroke} />
                </span>
                <div className="min-w-0">
                  <p className="nex-rs-feature-title">{title}</p>
                  <p className="nex-rs-feature-desc">{desc}</p>
                </div>
              </div>
            ))}
          </HomeMotionStagger>
        </section>
      </HomeMotionSection>

      <HomeMotionSection delay={0.08}>
        <section className="nex-rs-card">
          <h2 className="nex-rs-section-label">{t("bestSellers")}</h2>
          <HomeMotionStagger as="ul" className="nex-rs-product-list">
            {bestSellers.map((product) => (
              <HomeBestSellerRow key={product.slug} product={product} />
            ))}
          </HomeMotionStagger>
          <Link href="/products" className="nex-rs-view-all">
            {tCommon("viewAll")}
          </Link>
        </section>
      </HomeMotionSection>

      <HomeMotionSection delay={0.12}>
        <section className="nex-rs-deals">
          <div className="nex-rs-deals-bg" aria-hidden>
            <Image
              src="/right-sidebar/exclusive-deals-chest.png"
              alt=""
              fill
              sizes="300px"
              className="nex-rs-deals-bg-img"
              priority={false}
            />
          </div>
          <div className="nex-rs-deals-scrim" aria-hidden />
          <div className="nex-rs-deals-body">
            <p className="nex-rs-deals-eyebrow">{t("exclusiveDeals")}</p>
            <p className="nex-rs-deals-headline">{t("exclusiveDealsSub")}</p>
            <Link href="/products" className="nex-rs-deals-cta">
              {t("shopDeals")}
            </Link>
          </div>
        </section>
      </HomeMotionSection>
    </aside>
  );
}
