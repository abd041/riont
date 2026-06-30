"use client";

import { MessageCircle } from "lucide-react";
import { useSiteStore } from "@/components/providers/site-store-provider";
import { whatsappHref } from "@/lib/site/store-config";

export function FloatingContactButton() {
  const { features, supportWhatsapp } = useSiteStore();

  if (!features.floatingWhatsappEnabled) return null;

  const href = whatsappHref(supportWhatsapp);
  if (!href) return null;

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="sf-floating-contact"
      aria-label="Contact on WhatsApp"
    >
      <MessageCircle className="h-5 w-5" strokeWidth={2} />
    </a>
  );
}
