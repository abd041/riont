"use client";

import { Gamepad2, Gift, MessageCircle, Monitor } from "lucide-react";
import { useReducedMotion } from "framer-motion";
import { cn } from "@/lib/utils/cn";

const FLOATING_ICONS = [
  { id: "steam", Icon: Gamepad2, className: "nex-ambient-icon--steam" },
  { id: "discord", Icon: MessageCircle, className: "nex-ambient-icon--discord" },
  { id: "windows", Icon: Monitor, className: "nex-ambient-icon--windows" },
  { id: "gift", Icon: Gift, className: "nex-ambient-icon--gift" },
] as const;

type MarketplaceAmbientDecorProps = {
  variant?: "hero" | "promo";
  showMark?: boolean;
};

export function MarketplaceAmbientDecor({
  variant = "hero",
  showMark = false,
}: MarketplaceAmbientDecorProps) {
  const reduceMotion = useReducedMotion();

  return (
    <div
      className={cn(
        "nex-ambient-decor",
        variant === "promo" && "nex-ambient-decor--promo",
        reduceMotion && "nex-ambient-decor--static",
      )}
      aria-hidden
    >
      <span className="nex-ambient-decor__particles" />
      {showMark ? (
        <span className="nex-hero__ambient-mark">R</span>
      ) : null}
      {FLOATING_ICONS.map(({ id, Icon, className }) => (
        <span key={id} className={cn("nex-ambient-icon", className)}>
          <Icon strokeWidth={1.5} aria-hidden />
        </span>
      ))}
    </div>
  );
}
