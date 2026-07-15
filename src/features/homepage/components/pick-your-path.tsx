"use client";

import { Link } from "@/i18n/navigation";
import { useTranslations } from "next-intl";
import { ArrowUpRight, Headphones, Sparkles, Zap } from "lucide-react";

type PathCardView = {
  title: string;
  description: string;
  href: string;
};

const ICONS = [Zap, Sparkles, Headphones] as const;

export function PickYourPath({ cards }: { cards: PathCardView[] }) {
  const t = useTranslations("home");
  if (cards.length === 0) return null;

  return (
    <section className="mp-path" aria-label={t("pickYourPathTitle")}>
      <div className="mp-path__head">
        <h2 className="mp-path__title">{t("pickYourPathTitle")}</h2>
        <p className="mp-path__subtitle">{t("pickYourPathSubtitle")}</p>
      </div>
      <div className="mp-path__grid">
        {cards.map((card, index) => {
          const Icon = ICONS[index % ICONS.length];
          return (
            <Link
              key={`${card.title}-${index}`}
              href={card.href}
              className="mp-path__card"
            >
              <span className="mp-path__icon" aria-hidden>
                <Icon strokeWidth={1.5} />
              </span>
              <span className="mp-path__card-copy">
                <span className="mp-path__card-title">{card.title}</span>
                <span className="mp-path__card-desc">{card.description}</span>
              </span>
              <ArrowUpRight className="mp-path__arrow" strokeWidth={1.5} aria-hidden />
            </Link>
          );
        })}
      </div>
    </section>
  );
}
