"use client";

import Image from "next/image";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import {
  AnimatePresence,
  motion,
  useReducedMotion,
} from "framer-motion";
import { ArrowRight, Headphones, PackageCheck, Shield, Zap } from "lucide-react";
import type { HeroBlockContent } from "@/server/services/content-block.service";
import {
  HERO_ANIMATION_DEFAULT,
  lineItem,
  textItem,
  textStagger,
} from "./hero-animation.default";
import { cn } from "@/lib/utils/cn";
import { HERO_SLIDES } from "./hero-slides";
import { MarketplaceAmbientDecor } from "./marketplace-ambient-decor";

/** Client hero banner artwork — replace file in public/hero/ to update. */
const HERO_BACKGROUND_IMAGE = "/hero/hero-marketplace-bg.png";

const HERO_TRUST_ITEMS = [
  { icon: Shield, titleKey: "whySecureTitle", descKey: "whySecureDesc" },
  { icon: Zap, titleKey: "whyInstantTitle", descKey: "whyInstantDesc" },
  { icon: Headphones, titleKey: "whySupportTitle", descKey: "whySupportDesc" },
  { icon: PackageCheck, titleKey: "whyTrackingTitle", descKey: "whyTrackingDesc" },
] as const;

const SWIPE_THRESHOLD_PX = 50;

type SlideCopy = {
  title: string;
  highlight: string;
  subtitle: string;
  tag: string;
};

export function HeroSection({
  content,
  compact = false,
}: {
  content?: HeroBlockContent | null;
  compact?: boolean;
}) {
  const t = useTranslations("home");
  const tCommon = useTranslations("common");
  const reduceMotion = useReducedMotion();
  const [activeIndex, setActiveIndex] = useState(0);
  const [interactionPaused, setInteractionPaused] = useState(false);
  const touchStart = useRef<{ x: number; y: number } | null>(null);

  const { slideIntervalMs, presenceMode } = HERO_ANIMATION_DEFAULT;

  const primaryLabel = content?.primaryLabel || tCommon("shopNow");
  const primaryHref = content?.primaryHref || "/products";
  const secondaryLabel = content?.secondaryLabel || tCommon("explore");
  const secondaryHref = content?.secondaryHref || "/categories";

  const slideCopy: SlideCopy[] = useMemo(
    () =>
      HERO_SLIDES.map((slide, index) => {
        if (index === 0 && content) {
          return {
            title: content.title ?? t(slide.titleKey),
            highlight: content.highlight ?? t(slide.highlightKey),
            subtitle: content.subtitle ?? t(slide.subtitleKey),
            tag: t(slide.tagKey),
          };
        }
        return {
          title: t(slide.titleKey),
          highlight: t(slide.highlightKey),
          subtitle: t(slide.subtitleKey),
          tag: t(slide.tagKey),
        };
      }),
    [content, t],
  );

  const trustItems = useMemo(
    () =>
      HERO_TRUST_ITEMS.map((item) => ({
        icon: item.icon,
        title: t(item.titleKey),
        description: t(item.descKey),
      })),
    [t],
  );

  const goToSlide = useCallback((index: number) => {
    setActiveIndex(index);
  }, []);

  const advanceSlide = useCallback(() => {
    setActiveIndex((current) => (current + 1) % HERO_SLIDES.length);
  }, []);

  const goPrevSlide = useCallback(() => {
    setActiveIndex(
      (current) => (current - 1 + HERO_SLIDES.length) % HERO_SLIDES.length,
    );
  }, []);

  const goNextSlide = useCallback(() => {
    setActiveIndex((current) => (current + 1) % HERO_SLIDES.length);
  }, []);

  useEffect(() => {
    if (interactionPaused) return;

    const ms = reduceMotion ? slideIntervalMs * 1.5 : slideIntervalMs;
    const id = window.setInterval(advanceSlide, ms);
    return () => window.clearInterval(id);
  }, [advanceSlide, interactionPaused, reduceMotion, slideIntervalMs]);

  const handleTouchStart = useCallback((event: React.TouchEvent) => {
    const touch = event.touches[0];
    if (!touch) return;
    touchStart.current = { x: touch.clientX, y: touch.clientY };
    setInteractionPaused(true);
  }, []);

  const handleTouchEnd = useCallback(
    (event: React.TouchEvent) => {
      const start = touchStart.current;
      touchStart.current = null;
      setInteractionPaused(false);

      if (!start || reduceMotion) return;

      const touch = event.changedTouches[0];
      if (!touch) return;

      const deltaX = touch.clientX - start.x;
      const deltaY = touch.clientY - start.y;

      if (
        Math.abs(deltaX) < SWIPE_THRESHOLD_PX ||
        Math.abs(deltaX) < Math.abs(deltaY)
      ) {
        return;
      }

      if (deltaX < 0) {
        goNextSlide();
      } else {
        goPrevSlide();
      }
    },
    [goNextSlide, goPrevSlide, reduceMotion],
  );

  const handleTouchCancel = useCallback(() => {
    touchStart.current = null;
    setInteractionPaused(false);
  }, []);

  const activeSlide = HERO_SLIDES[activeIndex];
  const copy = slideCopy[activeIndex];

  return (
    <section
      className={cn(
        "nex-hero nex-hero-slider nex-hero--image-bg nex-hero--premium nex-hero--cinematic",
        compact && "nex-hero--compact",
      )}
      aria-label={t("heroAriaLabel")}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      onTouchCancel={handleTouchCancel}
    >
      <span className="nex-hero__float-orb nex-hero__float-orb--a" aria-hidden />
      <span className="nex-hero__float-orb nex-hero__float-orb--b" aria-hidden />
      {!compact ? <MarketplaceAmbientDecor variant="hero" showMark /> : null}
      <span className="nex-hero__ambient-orb nex-hero__ambient-orb--a" aria-hidden />
      <span className="nex-hero__ambient-orb nex-hero__ambient-orb--b" aria-hidden />
      <div className="nex-hero-media absolute inset-0 z-[0] overflow-hidden">
        <Image
          src={HERO_BACKGROUND_IMAGE}
          alt=""
          fill
          priority
          className="nex-hero-bg-image object-cover object-center"
          sizes="(max-width: 768px) 100vw, 1280px"
          draggable={false}
        />
        <div className="nex-hero-bg-scrim" aria-hidden />
        <div className="nex-hero-cinematic-bloom" aria-hidden />
        <div className="nex-hero-cinematic-mist" aria-hidden />
        <div className="nex-hero-cinematic-vignette" aria-hidden />
        <div className="nex-hero-cinematic-sparkles" aria-hidden />
      </div>

      <span className="nex-hero-cinematic-frame" aria-hidden />

      <div className="nex-hero-scrim-bottom z-[1]" aria-hidden />

      <div
        className={cn(
          "nex-hero-cinematic-content relative z-[10] flex flex-col",
          compact
            ? "min-h-0 justify-end px-3 py-2 md:min-h-0 md:justify-end md:px-4 md:py-2.5"
            : "min-h-[380px] justify-between px-7 py-6 md:min-h-[392px] md:px-8 md:py-7",
        )}
      >
        <div className="nex-hero-copy max-w-[420px]" aria-live="polite">
          <AnimatePresence mode={presenceMode} initial={false}>
            <motion.div
              key={activeSlide.id}
              variants={textStagger}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="nex-hero-copy-inner"
            >
              <motion.span
                variants={textItem}
                className="nex-hero-badge nex-hero-badge--promo inline-flex items-center gap-1.5 rounded-full border px-3 py-1 uppercase"
              >
                <Zap className="h-3 w-3 shrink-0 text-accent-400" strokeWidth={2.5} />
                {copy.tag}
              </motion.span>

              <h1 className="nex-hero-title mt-3 overflow-hidden uppercase">
                <motion.span
                  variants={lineItem}
                  className="nex-hero-title-line block text-white"
                >
                  {copy.title}
                </motion.span>
                <motion.span
                  variants={lineItem}
                  className="nex-hero-title-accent mt-0.5 block"
                >
                  {copy.highlight}
                </motion.span>
              </h1>

              <motion.p
                variants={textItem}
                className={cn("nex-hero-subtitle mt-2", compact && "mt-1.5")}
              >
                {copy.subtitle}
              </motion.p>

              <motion.div
                variants={textItem}
                className={cn(
                  "flex flex-wrap items-center gap-2.5",
                  compact ? "mt-2.5" : "mt-5",
                )}
              >
                <Link
                  href={primaryHref}
                  className="nex-btn-primary nex-hero-cta-primary inline-flex items-center gap-2"
                >
                  {primaryLabel}
                  <ArrowRight className="nex-hero-cta-arrow h-3.5 w-3.5" strokeWidth={2.5} />
                </Link>
                {!compact && (
                  <Link
                    href={secondaryHref}
                    className="nex-btn-outline nex-hero-cta-explore inline-flex items-center gap-2"
                  >
                    {secondaryLabel}
                  </Link>
                )}
              </motion.div>
            </motion.div>
          </AnimatePresence>
        </div>

        <div
          className={cn(
            "nex-hero-trust mt-4 flex items-stretch overflow-hidden rounded-[var(--radius-md)]",
            compact && "nex-hero-trust--compact",
          )}
        >
          {trustItems.map(({ icon: Icon, title, description }, index) => (
            <div key={title} className="nex-hero-trust__item flex min-w-0 flex-1 items-center">
              {index > 0 && (
                <div className="nex-hero-trust__divider hidden shrink-0 sm:block" aria-hidden />
              )}
              <div className="nex-hero-trust__cell flex min-w-0 flex-1 items-center gap-2 px-2.5 py-2.5 sm:gap-2.5 sm:px-3 sm:py-3">
                <span className="nex-hero-trust__icon flex h-8 w-8 shrink-0 items-center justify-center rounded-full sm:h-9 sm:w-9">
                  <Icon className="h-3.5 w-3.5 text-accent-400 sm:h-4 sm:w-4" strokeWidth={1.75} />
                </span>
                <div className="nex-hero-trust__text min-w-0 leading-none">
                  <p className="nex-hero-trust__title truncate text-[11px] font-bold text-white sm:text-[12px]">
                    {title}
                  </p>
                  {!compact && (
                    <p className="nex-hero-trust__desc mt-1 line-clamp-2 text-[10px] text-slate-400/90 sm:text-[10.5px]">
                      {description}
                    </p>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        <div
          className={cn(
            "nex-hero-slide-dots flex gap-1.5",
            compact
              ? "mt-2 md:absolute md:bottom-3 md:end-4 md:mt-0"
              : "mt-4 md:absolute md:bottom-7 md:end-8 md:mt-0",
          )}
          role="tablist"
          aria-label={t("heroSlidesLabel")}
        >
          {HERO_SLIDES.map((slide, index) => (
            <button
              key={slide.id}
              type="button"
              role="tab"
              aria-selected={index === activeIndex}
              aria-label={t("heroSlideLabel", { number: index + 1 })}
              className={cn(
                "nex-hero-dot h-1 rounded-full",
                index === activeIndex
                  ? "w-6 bg-accent-500"
                  : "w-2 bg-white/25",
              )}
              onClick={() => goToSlide(index)}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
