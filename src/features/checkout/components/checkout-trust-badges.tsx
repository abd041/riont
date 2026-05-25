"use client";

import { Clock, Shield, Users } from "lucide-react";
import { useTranslations } from "next-intl";

export function CheckoutTrustBadges() {
  const t = useTranslations("checkout");

  const items = [
    { icon: Shield, key: "trustEncryption" as const },
    { icon: Users, key: "trustCustomers" as const },
    { icon: Clock, key: "trustApproval" as const },
  ];

  return (
    <div className="nex-co-trust">
      {items.map(({ icon: Icon, key }) => (
        <div key={key} className="nex-co-trust-item">
          <Icon className="nex-co-trust-icon" strokeWidth={1.5} aria-hidden />
          <span>{t(key)}</span>
        </div>
      ))}
    </div>
  );
}
