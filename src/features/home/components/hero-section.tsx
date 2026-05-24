"use client";

import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Zap } from "lucide-react";
import type { HeroBlockContent } from "@/server/services/content-block.service";

export function HeroSection({ content }: { content?: HeroBlockContent | null }) {
  const t = useTranslations("home");
  const tCommon = useTranslations("common");

  const title = content?.title ?? t("heroTitle");
  const highlight = content?.highlight ?? t("heroHighlight");
  const subtitle = content?.subtitle ?? t("heroSubtitle");
  const primaryLabel = content?.primaryLabel || tCommon("shopNow");
  const primaryHref = content?.primaryHref || "/products";
  const secondaryLabel = content?.secondaryLabel || tCommon("explore");
  const secondaryHref = content?.secondaryHref || "/categories";

  return (
    <section className="relative overflow-hidden rounded-[var(--radius-lg)] glass-card p-8 md:p-12">
      <div
        className="pointer-events-none absolute end-0 top-0 h-64 w-64 rounded-full opacity-40 blur-[80px]"
        style={{ background: "rgba(139, 92, 246, 0.25)" }}
        aria-hidden
      />

      <div className="relative grid gap-8 md:grid-cols-2 md:items-center">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.25 }}
        >
          <h1 className="text-3xl font-bold leading-tight md:text-4xl lg:text-5xl">
            {title}{" "}
            <span className="text-gradient-primary">{highlight}</span>
          </h1>
          <p className="mt-4 max-w-lg text-[var(--text-secondary)]">{subtitle}</p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Button asChild size="lg">
              <Link href={primaryHref}>{primaryLabel}</Link>
            </Button>
            <Button variant="outline" asChild size="lg">
              <Link href={secondaryHref}>{secondaryLabel}</Link>
            </Button>
          </div>
        </motion.div>

        <motion.div
          className="flex justify-center"
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3, delay: 0.1 }}
        >
          <div className="relative flex h-48 w-48 items-center justify-center rounded-2xl border border-[var(--border-glow)] bg-surface md:h-56 md:w-56 glow-lg">
            <div className="absolute inset-0 rounded-2xl bg-[image:var(--gradient-hero)]" />
            <Zap className="relative h-20 w-20 text-accent-500 drop-shadow-[0_0_24px_var(--accent-glow)]" />
          </div>
        </motion.div>
      </div>
    </section>
  );
}
