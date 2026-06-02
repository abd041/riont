import { redirect } from "next/navigation";
import { getSession } from "@/server/services/auth.service";
import { AccountSectionShell } from "@/features/account/components/account-section-shell";

export default async function AccountSectionLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const user = await getSession();

  if (!user) {
    redirect(`/${locale}/login?next=/${locale}/account/orders`);
  }

  return <AccountSectionShell>{children}</AccountSectionShell>;
}
