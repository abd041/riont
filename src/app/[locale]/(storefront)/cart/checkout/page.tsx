import { CartCheckoutPageClient } from "@/features/cart/components/cart-checkout-page";
import { getPaymentInstructions } from "@/server/services/site-settings.service";
import { getSession } from "@/server/services/auth.service";

export default async function CartCheckoutPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const user = await getSession();
  const paymentInstructions = await getPaymentInstructions(locale);

  return (
    <CartCheckoutPageClient
      locale={locale}
      paymentInstructions={paymentInstructions}
      isLoggedIn={Boolean(user)}
      userEmail={user?.email}
    />
  );
}
